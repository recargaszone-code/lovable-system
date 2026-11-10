'use strict';
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const http = require('http');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');

const { aguardarEClicarPorTexto, preencherNomeComConfirmacao } = require('./humanize');
const { login_account_api } = require('./castle_bypass');

const EMAIL = 'ygvgtfsz33@outlook.com';
const PASSWORD = 'Lov_EQgus5ly!1';
const TEMPLATE_URL = 'https://lovable.dev/projects/d2d2f51d-b553-46f7-9e86-585e519f1e19';
const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';

function aguardarPortaDebug(porta, timeoutMs = 45000) {
  const inicio = Date.now();
  return new Promise((resolve, reject) => {
    const tentar = () => {
      const req = http.get(`http://127.0.0.1:${porta}/json/version`, res => {
        res.resume();
        if (res.statusCode === 200) return resolve(true);
        retry();
      });
      req.on('error', retry);
      req.setTimeout(1000, () => { req.destroy(); retry(); });
    };
    const retry = () => {
      if (Date.now() - inicio > timeoutMs) return reject(new Error('Timeout aguardando Chrome'));
      setTimeout(tentar, 500);
    };
    tentar();
  });
}

async function abrirChrome() {
  const porta = crypto.randomInt(9222, 9999);
  const pastaTemp = path.join(os.tmpdir(), `chrome_temp_${Date.now()}_${crypto.randomInt(100000, 999999)}`);
  const chromeArgs = [
    `--user-data-dir=${pastaTemp}`,
    `--remote-debugging-port=${porta}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--start-maximized',
    '--window-size=1366,768',
    '--lang=pt-BR,pt,en-US,en'
  ];

  console.log(`[CHROME] porta: ${porta}`);
  const chromeProc = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    chromeArgs,
    { detached: true, stdio: 'ignore' }
  );
  chromeProc.unref();
  await aguardarPortaDebug(porta);
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${porta}`,
    defaultViewport: null
  });
  return { browser, chromeProc };
}

(async () => {
  const hits = [];

  // === 1. LOGIN VIA API (castle token + Firebase) ===
  console.log('[recon] login via API com castle token...');
  const loginResult = await login_account_api(EMAIL, PASSWORD);
  if (!loginResult.success) {
    console.error('[FATAL] login API falhou:', loginResult.error);
    process.exit(1);
  }
  console.log(`[recon] login OK — uid: ${loginResult.uid}`);

  // === 2. ABRIR CHROME + INJETAR AUTH ===
  const { browser, chromeProc } = await abrirChrome();
  const page = (await browser.pages())[0] || await browser.newPage();

  // interceptar API
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if ((url.includes('api.lovable.dev') || url.includes('supabase') || url.includes('lovable.dev/_serverFn')) && req.method() !== 'OPTIONS') {
      hits.push({ phase: 'request', url, method: req.method(), postData: req.postData() || null, headers: req.headers(), ts: Date.now() });
    }
    req.continue();
  });
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('api.lovable.dev') || url.includes('supabase') || url.includes('lovable.dev/_serverFn')) {
      let body = '';
      try { body = await res.text(); } catch {}
      if (res.status() !== 204) {
        hits.push({ phase: 'response', url, status: res.status(), body: body.slice(0, 2000), ts: Date.now() });
      }
    }
  });

  // navegar pra lovable.dev pra criar o IndexedDB
  console.log('[recon] abrindo lovable.dev pra injetar auth...');
  await page.goto('https://lovable.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // injetar Firebase auth no IndexedDB
  const nowMs = Date.now();
  const authValue = {
    uid: loginResult.uid,
    email: EMAIL,
    emailVerified: true,
    isAnonymous: false,
    providerData: [{ uid: EMAIL, email: EMAIL, providerId: 'password' }],
    stsTokenManager: {
      accessToken: loginResult.idToken,
      refreshToken: loginResult.refreshToken || loginResult.idToken,
      expirationTime: nowMs + 3600 * 1000,
    },
    createdAt: String(nowMs),
    lastLoginAt: String(nowMs),
    apiKey: FIREBASE_API_KEY,
    appName: '[DEFAULT]',
  };
  const fbaseKey = `firebase:authUser:${FIREBASE_API_KEY}:[DEFAULT]`;

  console.log('[recon] injetando sessão no IndexedDB...');
  await page.evaluate(async ({ fbaseKey, authValue }) => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.open('firebaseLocalStorageDb');
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('firebaseLocalStorage')) {
          db.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const storeName = db.objectStoreNames[0] || 'firebaseLocalStorage';
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put({ fbase_key: fbaseKey, value: authValue });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      req.onerror = () => reject(req.error);
    });
  }, { fbaseKey, authValue });

  console.log('[recon] auth injetado, recarregando...');
  await page.goto('https://lovable.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  console.log(`[recon] url pos-auth: ${page.url()}`);
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_screen1.png' });

  if (page.url().includes('/login')) {
    await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_login_fail.png' });
    throw new Error('Auth injection falhou — ainda no login');
  }

  // === ONBOARDING ===
  if (!page.url().includes('getting-started')) {
    console.log('[recon] forçando getting-started...');
    await page.goto('https://lovable.dev/getting-started?redirect=%2Fdashboard', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log(`[recon] onboarding em: ${page.url()}`);
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_ob0.png' });

  // step 1: style → Next
  console.log('[recon] step 1: Next (style)');
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_ob1.png' });
  await aguardarEClicarPorTexto(page, ['next', 'continue']);

  // step 2: nome
  console.log('[recon] step 2: nome');
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_ob2.png' });
  await preencherNomeComConfirmacao(page, 'Dev Max');

  // step 2b: Next
  console.log('[recon] step 2b: Next (nome)');
  await new Promise(r => setTimeout(r, 6000));
  await aguardarEClicarPorTexto(page, ['next', 'continue']);

  // step 3: role → Founder
  console.log('[recon] step 3: Founder');
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_ob3.png' });
  await aguardarEClicarPorTexto(page, ['founder']);

  // step 3b: Next
  await new Promise(r => setTimeout(r, 3000));
  await aguardarEClicarPorTexto(page, ['next', 'continue']);

  // step 4: team → Solo
  console.log('[recon] step 4: Solo');
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_ob4.png' });
  await aguardarEClicarPorTexto(page, ['solo']);

  // step 4b: Next final
  await new Promise(r => setTimeout(r, 3000));
  await aguardarEClicarPorTexto(page, ['next', 'continue']);

  await new Promise(r => setTimeout(r, 6000));
  console.log(`[recon] pos-onboarding: ${page.url()}`);
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_ob_final.png' });

  // === REMIX ===
  console.log(`[recon] remix: ${TEMPLATE_URL}`);
  await page.goto(TEMPLATE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));
  console.log(`[recon] url template: ${page.url()}`);
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_remix1.png' });

  // 1. abrir modal remix
  await aguardarEClicarPorTexto(page, ['remix', 'fork', 'use this']);
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_remix_modal.png' });

  // 2. confirmar modal
  console.log('[recon] confirmando modal remix...');
  for (let mAttempt = 1; mAttempt <= 15; mAttempt++) {
    const res = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') ||
                    document.querySelector('form[data-testid="remix-dialog-content"]');
      if (!modal) return { submitted: true };

      const buttons = Array.from(modal.querySelectorAll('button, div[role="button"]'));
      let submitBtn = null;

      for (const b of buttons) {
        const label = b.querySelector('[data-button-label]')?.textContent?.trim().toLowerCase();
        if (label === 'remix' || label === 'remixar') { submitBtn = b; break; }
      }
      if (!submitBtn) {
        for (const b of buttons) {
          const txt = (b.innerText || b.textContent || '').trim().toLowerCase();
          const aria = (b.getAttribute('aria-label') || '').toLowerCase();
          if (txt === 'cancel' || txt === 'cancelar' || aria.includes('close') || txt === '×' || txt === 'x') continue;
          if (b.type === 'submit' && (txt === 'remix' || txt.includes('remix'))) { submitBtn = b; break; }
        }
      }
      if (!submitBtn) {
        for (const b of buttons) {
          const txt = (b.innerText || b.textContent || '').trim().toLowerCase();
          const aria = (b.getAttribute('aria-label') || '').toLowerCase();
          if (txt === 'cancel' || txt === 'cancelar' || aria.includes('close') || txt === '×' || txt === 'x') continue;
          if (txt === 'remix' || txt === 'remixar' || txt.includes('clone') || txt.includes('confirm')) { submitBtn = b; break; }
        }
      }

      if (submitBtn) {
        try {
          submitBtn.removeAttribute('data-trigger-disabled');
          submitBtn.removeAttribute('disabled');
          if ('disabled' in submitBtn) submitBtn.disabled = false;
        } catch(e) {}
        submitBtn.focus();
        const opts = { bubbles: true, cancelable: true, view: window, buttons: 1, detail: 1 };
        try {
          submitBtn.dispatchEvent(new PointerEvent('pointerdown', opts));
          submitBtn.dispatchEvent(new MouseEvent('mousedown', opts));
          submitBtn.dispatchEvent(new PointerEvent('pointerup', opts));
          submitBtn.dispatchEvent(new MouseEvent('mouseup', opts));
          submitBtn.dispatchEvent(new MouseEvent('click', opts));
          submitBtn.click();
        } catch(e) {}
        const form = submitBtn.closest('form') || modal.querySelector('form');
        if (form) {
          try { form.requestSubmit(submitBtn); } catch(err1) {
            try { form.requestSubmit(); } catch(err2) {
              form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
          }
        }
        return { clicked: true };
      }
      return { waiting: true };
    });
    if (res.submitted) { console.log('[recon] modal já foi submetido'); break; }
    if (res.clicked) { console.log('[recon] modal confirmado!'); break; }
    await new Promise(r => setTimeout(r, 1000));
  }

  // 3. aguardar novo project ID (até 180s)
  const templateProjId = 'd2d2f51d-b553-46f7-9e86-585e519f1e19';
  let newProjectId = null;
  console.log('[recon] aguardando novo projeto...');
  for (let sec = 1; sec <= 180; sec++) {
    const curUrl = page.url();
    const m = curUrl.match(/projects\/([a-zA-Z0-9-]+)/i);
    if (m && m[1] !== templateProjId) {
      newProjectId = m[1];
      console.log(`[recon] NOVO PROJECT: ${newProjectId}`);
      break;
    }
    if (sec % 10 === 0) process.stdout.write(`\r[recon] aguardando: ${sec}s...`);
    await new Promise(r => setTimeout(r, 1000));
  }

  if (newProjectId) {
    await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_remix2.png' });
    console.log(`\n[recon] PROJECT ID: ${newProjectId}`);
  } else {
    await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_remix_fail.png' });
    console.log('[recon] AVISO: remix timeout, tentando extrair key mesmo assim');
  }

  // === API KEY — extração via revealSecret nos frames ===
  let chaveExtraida = null;

  console.log('[recon] extraindo key via revealSecret...');
  await new Promise(r => setTimeout(r, 10000));
  for (let attempt = 1; attempt <= 30; attempt++) {
    for (const frame of page.frames()) {
      try {
        const fUrl = frame.url() || '';
        if (!fUrl.includes('lovableproject.com') && !fUrl.includes('lovable.app') && !fUrl.includes('localhost')) continue;
        const k = await frame.evaluate(async () => {
          try {
            const res = await fetch('/_serverFn/revealSecret', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: { name: 'LOVABLE_API_KEY' } })
            });
            if (res.ok) {
              const j = await res.json();
              if (j && j.value && j.value.startsWith('sk_')) return j.value;
            }
          } catch(e) {}
          return null;
        });
        if (k) { chaveExtraida = k; break; }
      } catch(e) {}
    }
    if (chaveExtraida) break;

    if (attempt === 15) {
      let previewUrl = null;
      for (const f of page.frames()) {
        const fUrl = f.url() || '';
        if ((fUrl.includes('lovableproject.com') || fUrl.includes('lovable.app')) && !fUrl.includes('about:blank')) {
          previewUrl = fUrl; break;
        }
      }
      if (!previewUrl) {
        previewUrl = await page.evaluate(() => {
          const iframes = Array.from(document.querySelectorAll('iframe'));
          const valid = iframes.find(f => {
            const s = (f.src || '').toLowerCase();
            return (s.includes('lovableproject.com') || s.includes('lovable.app')) && !s.includes('about:blank');
          });
          return valid ? valid.src : null;
        }).catch(() => null);
      }
      if (previewUrl) {
        console.log(`[recon] preview: ${previewUrl}`);
        try {
          const urlBase = new URL(previewUrl).origin;
          const abaSecrets = await page.browserContext().newPage();
          await abaSecrets.goto(`${urlBase}/secrets`, { waitUntil: 'domcontentloaded', timeout: 25000 });
          await new Promise(r => setTimeout(r, 2000));
          chaveExtraida = await abaSecrets.evaluate(async () => {
            try {
              const res = await fetch('/_serverFn/revealSecret', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { name: 'LOVABLE_API_KEY' } })
              });
              if (res.ok) { const j = await res.json(); if (j?.value?.startsWith('sk_')) return j.value; }
            } catch(e) {}
            return null;
          });
          try { await abaSecrets.close(); } catch(e) {}
        } catch(e) { console.log(`[recon] /secrets fallback: ${e.message}`); }
      }
    }
    if (chaveExtraida) break;
    await new Promise(r => setTimeout(r, 1500));
  }

  if (chaveExtraida) {
    console.log(`\n[recon] ========================================`);
    console.log(`[recon] API KEY: ${chaveExtraida}`);
    console.log(`[recon] ========================================`);
  } else {
    console.log('[recon] FALHA: key não extraida');
    await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_v2_key_fail.png' });
  }

  // === RESULTADOS ===
  await new Promise(r => setTimeout(r, 3000));
  console.log(`\n[recon] url final: ${page.url()}`);
  console.log(`[recon] ${hits.length} API hits\n`);

  const endpoints = [...new Set(hits.filter(h => h.phase === 'request').map(h => `${h.method} ${h.url.split('?')[0]}`))];
  console.log('=== ENDPOINTS ===');
  endpoints.forEach(e => console.log(e));

  console.log('\n=== RESPONSES ===');
  hits.filter(h => h.phase === 'response' && h.body && h.body.length > 2).forEach(h => {
    console.log(`${h.status} ${h.url.split('?')[0]}`);
    console.log(`  ${h.body.slice(0, 300)}`);
  });

  const result = { chaveExtraida, newProjectId, hits, endpoints };
  fs.writeFileSync('B:\\Lovable - Copy\\recon_onboarding_v2.json', JSON.stringify(result, null, 2));
  console.log('\nsalvo em recon_onboarding_v2.json');

  await browser.close();
  chromeProc.kill();
})().catch(e => { console.error('[FATAL]', e.message); process.exit(1); });
