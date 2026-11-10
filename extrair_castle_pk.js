'use strict';

// extrair_castle_pk.js
// abre lovable.dev com puppeteer, intercepta os bundles JS,
// extrai a castle publishable key (pk_*) e o castle SDK config
//
// a pk_ vive em app-shared-*.js onde jE (createRiskSignalToken) é exportado
// e o castle SDK é configurado via _castle("setAccount", pk)

const puppeteer = require('puppeteer-core');
const fs = require('fs');

function find_chrome_path() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const found = candidates.find(p => p && fs.existsSync(p));
  if (!found) throw new Error('chrome/edge not found — set CHROME_PATH');
  return found;
}

// padrões que a castle SDK usa pra receber a pk
const PK_PATTERNS = [
  /pk_[A-Za-z0-9_-]{10,}/g,
  /["']pk_[A-Za-z0-9_-]{10,}["']/g,
  /setAccount\s*\(\s*["']([^"']+)["']/g,
  /configure\s*\(\s*\{[^}]*pk\s*:\s*["']([^"']+)["']/g,
  /publishableKey\s*[:=]\s*["']([^"']+)["']/g,
  /castle[_.]?(?:pk|key|publishable)\s*[:=]\s*["']([^"']+)["']/g,
];

function extract_pks_from_text(text) {
  const keys = new Set();
  for (const pattern of PK_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m;
    while ((m = re.exec(text)) !== null) {
      // pode ser grupo 1 (capture group) ou match inteiro
      const val = m[1] || m[0];
      const clean = val.replace(/['"]/g, '');
      if (clean.startsWith('pk_')) keys.add(clean);
    }
  }
  return keys;
}

async function extrair_pk(proxy_server = null) {
  const executablePath = process.env.CHROME_PATH || find_chrome_path();
  const all_keys = new Set();
  const bundle_hits = [];
  const castle_config = {};

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      ...(proxy_server ? [`--proxy-server=${proxy_server}`] : []),
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  // interceptar TODOS os responses JS pra achar pk_
  page.on('response', async res => {
    const url = res.url();
    const ct = (res.headers()['content-type'] || '').toLowerCase();
    const is_js = ct.includes('javascript') || url.endsWith('.js');
    const is_html = ct.includes('html');

    if (!is_js && !is_html) return;

    try {
      const body = await res.text();
      const keys = extract_pks_from_text(body);

      if (keys.size > 0) {
        const short_url = url.length > 100 ? '...' + url.slice(-80) : url;
        console.log(`[+] ${keys.size} pk(s) em ${short_url}`);
        keys.forEach(k => {
          all_keys.add(k);
          bundle_hits.push({ url: short_url, key: k });
        });
      }

      // se é o app-shared bundle, extrai mais contexto
      if (url.includes('app-shared')) {
        console.log(`[*] analisando app-shared bundle (${(body.length / 1024).toFixed(0)}KB)...`);

        // procura o castle configure / setAccount
        const castle_set = body.match(/(?:setAccount|configure)\s*\([^)]{0,200}pk_[^)]+\)/g);
        if (castle_set) {
          castle_config.setAccount = castle_set;
          console.log(`[+] castle config encontrado: ${castle_set[0].substring(0, 100)}`);
        }

        // procura createRiskSignalToken export
        const risk_token = body.match(/createRiskSignalToken/g);
        if (risk_token) {
          console.log(`[+] createRiskSignalToken referenciado ${risk_token.length}x no bundle`);
        }

        // salva o bundle inteiro pra análise manual se precisar
        fs.writeFileSync('app_shared_bundle.js', body, 'utf8');
        console.log('[*] bundle salvo em app_shared_bundle.js');
      }
    } catch (e) {
      // response body pode falhar
    }
  });

  // interceptar requests pro castle domain
  page.on('request', req => {
    const url = req.url();
    const post = req.postData() || '';
    if (url.includes('castle.io') || url.includes('castle')) {
      console.log(`[castle-req] ${req.method()} ${url.substring(0, 120)}`);
      if (post) {
        const keys = extract_pks_from_text(post);
        keys.forEach(k => all_keys.add(k));
      }
    }
  });

  console.log('[*] abrindo lovable.dev...');
  await page.goto('https://lovable.dev/', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  // tenta extrair pk_ do runtime global do castle
  console.log('[*] checando globals castle no runtime...');
  const runtime_pk = await page.evaluate(() => {
    const results = {};

    // castle v2 global
    if (typeof window._castle === 'function') {
      results.castle_global = true;
    }

    // tenta achar config em qualquer global
    for (const key of Object.keys(window)) {
      try {
        const val = window[key];
        if (typeof val === 'object' && val !== null) {
          const str = JSON.stringify(val).substring(0, 5000);
          const m = str.match(/pk_[A-Za-z0-9_-]{10,}/);
          if (m) {
            results[key] = m[0];
          }
        }
      } catch (e) {}
    }

    // procura na castle CDN script
    const castle_scripts = Array.from(document.querySelectorAll('script[src*="castle"]'));
    results.castle_scripts = castle_scripts.map(s => s.src);

    // procura no cloudfront (castle CDN)
    const cf_scripts = Array.from(document.querySelectorAll('script[src*="cloudfront"]'));
    results.cloudfront_scripts = cf_scripts.map(s => s.src);

    return results;
  });

  console.log('[runtime]', JSON.stringify(runtime_pk, null, 2));
  for (const [k, v] of Object.entries(runtime_pk)) {
    if (typeof v === 'string' && v.startsWith('pk_')) {
      all_keys.add(v);
    }
  }

  // navega pra /login — força castle a ativar o scoring
  console.log('[*] navegando pra /login...');
  try {
    await page.goto('https://lovable.dev/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // após login page carregar, castle SDK já deve estar ativa
    const login_pk = await page.evaluate(() => {
      // tenta via castle internal state
      try {
        if (window._castle) {
          // castle v2 guarda a pk internamente, tenta acessar
          const config = window._castle('getConfig') || {};
          return { config };
        }
      } catch (e) {}

      // fallback: procura nos scripts carregados
      const all = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
      return { scripts: all.filter(u => u.includes('app-shared') || u.includes('castle') || u.includes('cloudfront')) };
    });
    console.log('[login]', JSON.stringify(login_pk, null, 2));
  } catch (e) {
    console.log('[login] falhou:', e.message);
  }

  // se ainda não achou, busca manualmente nos bundles carregados
  if (all_keys.size === 0) {
    console.log('[*] fallback: buscando pk_ diretamente nos bundles...');
    const urls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]'))
        .map(s => s.src)
        .filter(u => u.includes('assets/'));
    });

    for (const url of urls.slice(0, 15)) {
      try {
        const body = await page.evaluate(async (u) => {
          const r = await fetch(u);
          return await r.text();
        }, url);

        const keys = extract_pks_from_text(body);
        if (keys.size > 0) {
          console.log(`[+] fallback hit em ${url.substring(url.lastIndexOf('/'))}: ${[...keys].join(', ')}`);
          keys.forEach(k => all_keys.add(k));
        }
      } catch (e) {}
    }
  }

  await browser.close();

  // resultado final
  const keys = Array.from(all_keys);
  console.log('\n' + '='.repeat(60));
  if (keys.length > 0) {
    console.log(`CASTLE PK(s) ENCONTRADA(s): ${keys.length}`);
    keys.forEach(k => console.log(`  → ${k}`));

    // salva
    const output = {
      keys,
      bundle_hits,
      castle_config,
      extracted_at: new Date().toISOString(),
    };
    fs.writeFileSync('castle_pk.txt', keys.join('\n'), 'utf8');
    fs.writeFileSync('castle_pk.json', JSON.stringify(output, null, 2), 'utf8');
    console.log('\nsalvo em castle_pk.txt e castle_pk.json');
  } else {
    console.log('NENHUMA PK ENCONTRADA');
    console.log('\nse o app-shared bundle foi salvo, busca manualmente:');
    console.log('  grep -oP "pk_[A-Za-z0-9_-]{10,}" app_shared_bundle.js');
    console.log('\nou abre lovable.dev manualmente:');
    console.log('  F12 > Sources > Ctrl+Shift+F > "pk_"');
    console.log('  F12 > Sources > Ctrl+Shift+F > "setAccount"');
    console.log('  F12 > Sources > Ctrl+Shift+F > "castle"');
  }
  console.log('='.repeat(60));

  return keys;
}

const proxy = process.argv[2] || null;
extrair_pk(proxy).catch(e => {
  console.error('[ERRO]', e.message);
  process.exit(1);
});
