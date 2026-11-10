'use strict';

/**
 * FABRICADOR, APROPRIADOR E EXTRATOR DE CHAVES LOVABLE (SMAILPRO NATIVO)
 * 1. Resolução de tela 100% natural (sem esticar e sem barras cinzas).
 * 2. Controle de histórico estrito: emails_processados_com_sucesso.txt para evitar repetições.
 * 3. Criação de nova conta OU apropriação automática via PASSWORD_RESET.
 * 4. Execução fiel do Remix do Template (com confirmação de modal e redirect pro novo projeto).
 * 5. Extração da nova API Key e salvamento imediato no active_keys.json.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
// Modo Conexão Direta (Sem Proxy)


const {
  criarEmailReal,
  dispararResetSenha,
  aguardarLinkResetSmailPro,
  aplicarNovaSenhaViaRest
} = require('./smailpro_account_claimer');

const { aguardarLinkLovableSmailPro } = require('./smailpro_auto_helper');
const { clicarHumano, clicarHumanoPorSeletor, clicarHumanoPorTexto, aguardarEClicarPorTexto, preencherNomeComConfirmacao, simularPresencaHumanaInicial, digitarHumanoAleatorio } = require('./humanize');
// fingerprint spoofing desativado: hardware real e coerente

const TEMPLATE_URL = 'https://lovable.dev/projects/d2d2f51d-b553-46f7-9e86-585e519f1e19';
const TEMPLATE_PROJECT_ID = 'd2d2f51d-b553-46f7-9e86-585e519f1e19';

const ACTIVE_KEYS_FILE = 'C:\\Users\\ShadezinX\\active_keys.json';
const ACCOUNTS_JSON = 'C:\\Users\\ShadezinX\\Desktop\\accounts.json';
const TOKENS_TXT = path.join(__dirname, 'tokens_capturados.txt');
const HISTORICO_CONCLUIDOS_FILE = path.join(__dirname, 'contas_concluidas_com_chave.txt');

function carregarHistoricoConcluidos() {
  const concluidos = new Set();

  const lerArquivoParaSet = (caminho) => {
    if (fs.existsSync(caminho)) {
      try {
        const linhas = fs.readFileSync(caminho, 'utf-8').split(/\r?\n/).filter(Boolean);
        for (const linha of linhas) {
          const em = linha.split('|')[0]?.toLowerCase().trim();
          if (em && em.includes('@')) concluidos.add(em);
        }
      } catch(e) {}
    }
  };

  // 1. contas_concluidas_com_chave.txt (local)
  lerArquivoParaSet(HISTORICO_CONCLUIDOS_FILE);

  // 2. Desktop lovable_api_keys.txt
  const desktopFile = path.join(process.env.USERPROFILE || 'C:\\Users\\ShadezinX', 'Desktop', 'lovable_api_keys.txt');
  lerArquivoParaSet(desktopFile);

  // 3. captured_keys.txt local
  lerArquivoParaSet(path.join(__dirname, 'captured_keys.txt'));

  // 4. captured_keys.txt em Lovable_Remix_Auto
  lerArquivoParaSet('B:\\Lovable_Remix_Auto\\captured_keys.txt');

  // 5. progress.json em Lovable_Remix_Auto
  try {
    const progPath = 'B:\\Lovable_Remix_Auto\\progress.json';
    if (fs.existsSync(progPath)) {
      const prog = JSON.parse(fs.readFileSync(progPath, 'utf-8'));
      if (prog && prog.processedEmails) {
        for (const [em, data] of Object.entries(prog.processedEmails)) {
          if (data && (data.status === 'success' || data.key)) {
            concluidos.add(em.toLowerCase().trim());
          }
        }
      }
    }
  } catch(e) {}

  return concluidos;
}

function salvarHistoricoConcluido(email, apiKey) {
  try {
    fs.appendFileSync(HISTORICO_CONCLUIDOS_FILE, `${email}|${apiKey}|${new Date().toISOString()}\n`, 'utf-8');
  } catch(e) {}
}

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

async function abrirChromeNativo() {
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

  // Conexão direta via rede local nativa

  console.log(`[CHROME] Abrindo Chrome normal (perfil: ${pastaTemp}, porta debug: ${porta})...`);

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

function salvarConta(email, senha, token = null, refreshToken = null) {
  let contas = [];
  if (fs.existsSync(ACCOUNTS_JSON)) {
    try { contas = JSON.parse(fs.readFileSync(ACCOUNTS_JSON, 'utf-8')); } catch(e) { contas = []; }
  }
  contas = contas.filter(c => c.email.toLowerCase() !== email.toLowerCase());
  contas.push({
    email,
    password: senha,
    token,
    accessToken: token,
    refreshToken,
    createdAt: new Date().toISOString()
  });
  try { fs.writeFileSync(ACCOUNTS_JSON, JSON.stringify(contas, null, 2), 'utf-8'); } catch(e) {}
  try { fs.appendFileSync(TOKENS_TXT, `${email}|${senha}|${token || 'sem_token'}\n`, 'utf-8'); } catch(e) {}
}

function salvarChaveNoPool(apiKey, email, historicoConcluidos = null) {
  if (!apiKey || !apiKey.startsWith('sk_')) return;
  const cleanKey = apiKey.trim();
  if (cleanKey.includes('sk_jpSFVb')) return;

  // 1. active_keys.json da Bridge
  let keys = [];
  if (fs.existsSync(ACTIVE_KEYS_FILE)) {
    try { keys = JSON.parse(fs.readFileSync(ACTIVE_KEYS_FILE, 'utf-8')); } catch(e) { keys = []; }
  }
  if (!keys.includes(cleanKey)) {
    keys.unshift(cleanKey);
    try {
      fs.writeFileSync(ACTIVE_KEYS_FILE, JSON.stringify(keys, null, 2), 'utf-8');
      console.log(`\n🎉 NOVA CHAVE API SALVA COM SUCESSO NO POOL! Total ativo: ${keys.length}`);
    } catch(e) {}
  }

  // 2. Desktop lovable_api_keys.txt
  try {
    const desktopFile = path.join(process.env.USERPROFILE || 'C:\\Users\\ShadezinX', 'Desktop', 'lovable_api_keys.txt');
    fs.appendFileSync(desktopFile, `${email}|${cleanKey}\n`, 'utf-8');
  } catch (e) {}

  // 3. captured_keys.txt local
  try {
    const capFile = path.join(__dirname, 'captured_keys.txt');
    fs.appendFileSync(capFile, `${email}|${cleanKey}\n`, 'utf-8');
  } catch (e) {}

  // 4. POST para a bridge local localhost:3001
  try {
    const postData = JSON.stringify({ key: cleanKey, email: email });
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/add-key',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 2000
    }, (res) => {
      console.log(`[BRIDGE POOL] Despacho HTTP status: ${res.statusCode}`);
    });
    req.on('error', () => {});
    req.write(postData);
    req.end();
  } catch (e) {}

  // 5. Salva no histórico de concluídos
  salvarHistoricoConcluido(email, cleanKey);
  if (historicoConcluidos) {
    historicoConcluidos.add(email.toLowerCase().trim());
  }
}

function gerarSenhaForte() {
  const maiusculas = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const minusculas = 'abcdefghjkmnpqrstuvwxyz';
  const numeros = '23456789';
  const simbolos = '!@#$%&*';
  const todos = maiusculas + minusculas + numeros + simbolos;
  let senha = [
    maiusculas[crypto.randomInt(0, maiusculas.length)],
    minusculas[crypto.randomInt(0, minusculas.length)],
    numeros[crypto.randomInt(0, numeros.length)],
    simbolos[crypto.randomInt(0, simbolos.length)]
  ];
  for (let i = 0; i < 8; i++) senha.push(todos[crypto.randomInt(0, todos.length)]);
  return senha.sort(() => Math.random() - 0.5).join('');
}

async function escanearChaveNaPagina(page) {
  let found = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const match = text.match(/sk_[a-zA-Z0-9+/=]{100,}/);
    return match ? match[0] : null;
  });
  if (found && !found.includes('sk_jpSFVb')) return found;

  for (const frame of page.frames()) {
    try {
      found = await frame.evaluate(() => {
        const text = document.body ? document.body.innerText : '';
        const match = text.match(/sk_[a-zA-Z0-9+/=]{100,}/);
        return match ? match[0] : null;
      });
      if (found && !found.includes('sk_jpSFVb')) return found;
    } catch(e) {}
  }
  return null;
}

/**
 * Fluxo de Remix idêntico ao Remix Automator
 * Só extrai a chave APÓS confirmar o remix e redirecionar para o NOVO projeto provisionado.
 */
async function executarRemixFiel(page, email, historicoConcluidos = null) {
  let chaveInterceptada = null;
  let cdpClient = null;

  try {
    cdpClient = await page.target().createCDPSession();
    await cdpClient.send('Network.enable');
    cdpClient.on('Network.requestWillBeSent', (e) => {
      const headers = e.request.headers || {};
      const auth = headers['Authorization'] || headers['authorization'] || '';
      if (auth.startsWith('Bearer sk_')) {
        const k = auth.replace(/^Bearer\s+/i, '').trim();
        if (!k.includes('sk_jpSFVb') && k.length > 50 && !chaveInterceptada) {
          chaveInterceptada = k;
          console.log(`\n[NETWORK] Chave sk_ capturada via header Authorization!`);
        }
      }
      if (e.request.postData) {
        const m = e.request.postData.match(/sk_[a-zA-Z0-9+/=]{100,}/);
        if (m && !m[0].includes('sk_jpSFVb') && !chaveInterceptada) {
          chaveInterceptada = m[0];
          console.log(`\n[NETWORK] Chave sk_ capturada via postData!`);
        }
      }
    });
  } catch(e) {}

  console.log(`\n------------------------------------------------------------`);
  console.log(`[REMIX] Navegando para o projeto template: ${TEMPLATE_URL}`);
  await page.goto(TEMPLATE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Clicar no botão principal de Remix para abrir o modal (idêntico ao content.js do automator)
  console.log(`[REMIX] Localizando botão principal 'Remix'...`);
  let modalAberto = false;
  for (let attempt = 1; attempt <= 30; attempt++) {
    modalAberto = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') ||
                    document.querySelector('form[data-testid="remix-dialog-content"]');
      if (modal) return true;

      const elements = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const mainBtn = elements.find(b => {
        if (b.closest('[role="dialog"], form[data-testid="remix-dialog-content"]')) return false;
        const rect = b.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        const label = b.querySelector('[data-button-label]')?.textContent?.trim().toLowerCase();
        if (label === 'remix' || label === 'remixar') return true;
        const text = (b.innerText || b.textContent || '').trim().toLowerCase();
        return text === 'remix' || text === 'remixar' || (text.includes('remix') && !text.includes('remixed'));
      });

      if (mainBtn) {
        const opts = { bubbles: true, cancelable: true, view: window, buttons: 1, detail: 1 };
        try {
          mainBtn.dispatchEvent(new PointerEvent('pointerdown', opts));
          mainBtn.dispatchEvent(new MouseEvent('mousedown', opts));
          mainBtn.dispatchEvent(new PointerEvent('pointerup', opts));
          mainBtn.dispatchEvent(new MouseEvent('mouseup', opts));
          mainBtn.dispatchEvent(new MouseEvent('click', opts));
          mainBtn.click();
        } catch(e) {}
        return false;
      }
      return false;
    });

    if (modalAberto) {
      console.log(`[REMIX] Modal de clonagem aberto com sucesso!`);
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // 2. Confirmar envio do modal via triggerClick + form.requestSubmit (sem risco de duplo-clique destrutivo)
  await new Promise(r => setTimeout(r, 1500));
  console.log(`[REMIX] Confirmando modal de remix...`);
  for (let mAttempt = 1; mAttempt <= 15; mAttempt++) {
    const res = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') ||
                    document.querySelector('form[data-testid="remix-dialog-content"]');
      if (!modal) return { submitted: true };

      const buttons = Array.from(modal.querySelectorAll('button, div[role="button"]'));
      let submitBtn = null;

      // Procura com data-button-label
      for (const b of buttons) {
        const label = b.querySelector('[data-button-label]')?.textContent?.trim().toLowerCase();
        if (label === 'remix' || label === 'remixar') { submitBtn = b; break; }
      }

      // Procura botão submit com texto remix
      if (!submitBtn) {
        for (const b of buttons) {
          const txt = (b.innerText || b.textContent || '').trim().toLowerCase();
          const aria = (b.getAttribute('aria-label') || '').toLowerCase();
          if (txt === 'cancel' || txt === 'cancelar' || aria.includes('close') || txt === '×' || txt === 'x') continue;
          if (b.type === 'submit' && (txt === 'remix' || txt.includes('remix'))) { submitBtn = b; break; }
        }
      }

      // Procura qualquer botão Remix no modal
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

    if (res.submitted) {
      console.log(`[REMIX] Modal processado e submetido!`);
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // 3. Aguardar o Lovable Cloud processar o código, deployar o sandbox e redirecionar para o NOVO projeto
  const templateMatch = TEMPLATE_URL.match(/projects\/([a-zA-Z0-9-]+)/i);
  const templateProjId = templateMatch ? templateMatch[1] : TEMPLATE_PROJECT_ID;

  console.log(`\n[REMIX] Aguardando Lovable clonar, processar o código e provisionar o NOVO projeto na nuvem...`);
  let newProjectId = null;
  const maxWaitSec = 180; // Até 3 minutos para a nuvem concluir o deploy completo sem cancelamento

  for (let sec = 1; sec <= maxWaitSec; sec++) {
    const curUrl = page.url();
    const curPath = await page.evaluate(() => window.location.pathname).catch(() => '');

    const m = curUrl.match(/projects\/([a-zA-Z0-9-]+)/i);
    const isNewProject = m && m[1] !== templateProjId;
    const hasRemixedFlag = curUrl.includes('remixed=true');

    // Verifica se os elementos do novo editor/sandbox já renderizaram
    const editorLoaded = await page.evaluate(() => {
      return !!(
        document.querySelector('textarea, [contenteditable="true"], iframe[title*="Preview"]') ||
        document.querySelector('[data-testid="chat-input"]') ||
        document.querySelector('[class*="chat-input"]') ||
        document.querySelector('.ProseMirror, .tiptap')
      );
    }).catch(() => false);

    if (isNewProject) {
      newProjectId = m[1];
      console.log(`\n[NOVO WORKSPACE] SUCESSO! Novo projeto provisionado e ativo: ${newProjectId}`);
      break;
    }

    if (hasRemixedFlag || editorLoaded) {
      const pm = curPath.match(/projects\/([a-zA-Z0-9-]+)/i);
      if (pm && pm[1] !== templateProjId) {
        newProjectId = pm[1];
        console.log(`\n[NOVO WORKSPACE] SUCESSO! Workspace do editor detectado: ${newProjectId}`);
        break;
      }
    }

    process.stdout.write(`\r[-] Provisionando projeto no Lovable Cloud: ${sec}s/${maxWaitSec}s... `);
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!newProjectId) {
    console.log(`\n[ERRO] O provisionamento do novo projeto expirou após ${maxWaitSec}s.`);
    return null;
  }

  // 4. Extração Ultra-Rápida da Chave API via Server Function / Rota /secrets
  chaveInterceptada = null; // Garante que não pega nenhuma chave residual do template

  console.log('\n[EXTRAÇÃO ULTRA-RÁPIDA] Novo projeto ativo! Capturando URL do preview...');

  // 4.1 Identifica a URL do preview REAL do container (filtrando trackers e doubleclick)
  let previewUrl = null;
  for (let p = 1; p <= 25; p++) {
    if (chaveInterceptada) break;

    // Tenta capturar direto dos frames ativos do page (mais rapido que esperar iframe)
    for (const f of page.frames()) {
      const fUrl = f.url() || '';
      if ((fUrl.includes('lovableproject.com') || fUrl.includes('lovable.app') || fUrl.includes('localhost')) && !fUrl.includes('about:blank')) {
        previewUrl = fUrl;
        break;
      }
    }

    if (!previewUrl) {
      previewUrl = await page.evaluate(() => {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        const valid = iframes.find(f => {
          const s = (f.src || '').toLowerCase();
          return (s.includes('lovableproject.com') || s.includes('lovable.app') || s.includes('localhost'))
              && !s.includes('doubleclick')
              && !s.includes('google')
              && !s.includes('about:blank');
        });
        return valid ? valid.src : null;
      }).catch(() => null);
    }

    if (previewUrl) {
      console.log("[PREVIEW ENCONTRADO] " + previewUrl);
      break;
    }

    // DISPARO INSTANTÂNEO: Se o frame do preview já renderizou, dispara revealSecret nele direto!
    for (const frame of page.frames()) {
      try {
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
        if (k && !k.includes('sk_jpSFVb')) {
          chaveInterceptada = k;
          console.log('\n[INSTANT-REMIX] Chave extraida instantaneamente via Server Function no frame!');
          break;
        }
      } catch(e) {}
    }
    if (chaveInterceptada) break;

    await new Promise(r => setTimeout(r, 600));
  }

  // 4.2 Método Primário: Disparo direto no endpoint /secrets do preview
  if (previewUrl) {
    try {
      const urlBase = new URL(previewUrl).origin;
      const secretsUrl = `${urlBase}/secrets`;
      console.log(`[EXTRAÇÃO] Acessando rota interna: ${secretsUrl}`);

      const abaSecrets = await page.browserContext().newPage();
      // Sem injeção sintética em abaSecrets
      await abaSecrets.goto(secretsUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1500));

      // Tentativa A: Chamada direta à Server Function do TanStack Start
      chaveInterceptada = await abaSecrets.evaluate(async () => {
        try {
          const res = await fetch('/_serverFn/revealSecret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { name: 'LOVABLE_API_KEY' } })
          });
          if (res.ok) {
            const json = await res.json();
            if (json && json.value && json.value.startsWith('sk_')) return json.value;
          }
        } catch(e) {}
        return null;
      });

      // Tentativa B: Clique direto no botão "Revelar" da página /secrets
      if (!chaveInterceptada) {
        console.log('[EXTRAÇÃO] Acionando botão Revelar na página /secrets...');
        await abaSecrets.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btnRev = btns.find(b => {
            const txt = (b.innerText || b.textContent || '').toLowerCase();
            return txt.includes('revelar') || txt.includes('reveal');
          });
          if (btnRev) btnRev.click();
        });

        await new Promise(r => setTimeout(r, 1500));
        chaveInterceptada = await escanearChaveNaPagina(abaSecrets);
      }

      try { await abaSecrets.close(); } catch(e) {}
    } catch(err) {
      console.log(`[AVISO] Método direto via /secrets: ${err.message}`);
    }
  }

  // 4.3 Fallback: Varredura contínua nos frames do editor caso a rota externa ainda não tenha respondido
  if (!chaveInterceptada) {
    console.log('[EXTRAÇÃO] Monitorando frames internos do editor Lovable...');
    for (let sec = 1; sec <= 45; sec++) {
      if (chaveInterceptada) break;

      for (const frame of page.frames()) {
        try {
          await frame.evaluate(async () => {
            // Tenta fetch no frame
            try {
              const res = await fetch('/_serverFn/revealSecret', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { name: 'LOVABLE_API_KEY' } })
              });
              if (res.ok) {
                const json = await res.json();
                if (json && json.value) document.body.setAttribute('data-extracted-key', json.value);
              }
            } catch(e) {}

            // Clica em qualquer botão de revelação visível
            const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
            const secretBtn = btns.find(b => {
              const txt = (b.innerText || b.textContent || '').trim().toLowerCase();
              return txt.includes('secret') || txt.includes('revelar') || txt.includes('key') || txt.includes('copiar');
            });
            if (secretBtn) secretBtn.click();
          });
        } catch (e) {}
      }

      await new Promise(r => setTimeout(r, 1000));
      const scan = await escanearChaveNaPagina(page);
      if (scan) {
        chaveInterceptada = scan;
        break;
      }
    }
  }

  try {
    if (cdpClient) await cdpClient.detach();
  } catch(e) {}

  if (chaveInterceptada) {
    console.log(`\n[CHAVE CAPTURADA] ${chaveInterceptada.slice(0, 35)}...`);
    salvarChaveNoPool(chaveInterceptada, email, historicoConcluidos);
    return chaveInterceptada;
  } else {
    console.log(`\n[AVISO] Novo projeto ${newProjectId} ativo, mas chave não apareceu em 90s.`);
    return null;
  }
}

async function processarCicloConta(tipoEmail, historicoConcluidos) {
  const senhaNova = gerarSenhaForte();

  console.log('\n' + '='.repeat(60));
  console.log(`[1/5] Gerando caixa de entrada (${tipoEmail.toUpperCase()}) no SmailPro...`);
  
  let emailData = null;
  for (let tent = 1; tent <= 10; tent++) {
    const gerado = await criarEmailReal(tipoEmail);
    const emLower = gerado.email.toLowerCase().trim();
    if (!historicoConcluidos.has(emLower)) {
      emailData = gerado;
      break;
    }
    console.log(`[-] E-mail ${gerado.email} já foi concluído anteriormente no histórico. Gerando outro (${tent}/10)...`);
    await new Promise(r => setTimeout(r, 1500));
  }

  if (!emailData) {
    emailData = await criarEmailReal(tipoEmail);
  }

  console.log(`[OK] E-mail reservado: ${emailData.email}`);
  console.log(`[SENHA GERADA] ${senhaNova}`);
  console.log('='.repeat(60));

  // Sem proxy
    const { browser, chromeProc } = await abrirChromeNativo();
  const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    const context = browser.defaultBrowserContext();
      // Hardware e TLS nativos autênticos do Chrome
    // Sem autenticação de proxy necessária

    try {
      const ipChecagem = await page.evaluate(async () => {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const d = await res.json();
          return d.ip;
        } catch(e) { return null; }
      });
      console.log(`[PROXY] IP Publico confirmado da sessao: ${ipChecagem || 'IP Direto'}`);
    } catch(e) {}

  // Fingerprint de hardware variado por conta (fingerprint.js) — ver nota no topo do arquivo.

  try {
    console.log('\n[2/5] Abrindo tela de cadastro do Lovable...');
    await page.goto('https://lovable.dev/signup', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));

    // Fecha banner de cookies se existir
    try {
      const botaoOk = await page.$('button::-p-text(OK)');
      if (botaoOk) await clicarHumano(page, botaoOk);
    } catch (e) {}

    // Digita e-mail com clique humano
    const seletorEmail = 'input#email, input[type="email"], input[name="email"]';
    try {
      await page.waitForSelector(seletorEmail, { timeout: 30000 });
    } catch (e) {
      throw new Error(`PROXY_CONNECTION_FAIL: formulario de signup nao carregou (${e.message})`);
    }
    console.log(`[2/5] Digitando o e-mail: ${emailData.email}...`);
    const campoEmail = await page.$(seletorEmail);
    await clicarHumano(page, campoEmail);
    await page.type(seletorEmail, emailData.email, { delay: crypto.randomInt(40, 110) });
    await new Promise(r => setTimeout(r, 1000));
    await clicarHumanoPorSeletor(page, 'button[type="submit"]');

    // Checa imediatamente se o Lovable identificou conta existente (URL mudou pra /login, botão Log in ou Welcome Back)
    await new Promise(r => setTimeout(r, 2500));
    const checagemEntrada = await page.evaluate(() => {
      const curUrl = window.location.href.toLowerCase();
      const txt = document.body ? document.body.innerText.toLowerCase() : '';
      const isLoginUrl = curUrl.includes('/login');
      const isWelcomeBack = txt.includes('welcome back') || txt.includes('sign in to your account');
      const submitBtn = document.querySelector('button[type="submit"]');
      const btnTxt = submitBtn ? (submitBtn.innerText || submitBtn.textContent || '').toLowerCase() : '';
      const isLoginButton = btnTxt === 'log in' || btnTxt === 'sign in';
      const hasForgot = !!Array.from(document.querySelectorAll('a, button')).find(el => {
        const t = (el.innerText || el.textContent || '').toLowerCase();
        return t.includes('forgot') || t.includes('redefinir') || t.includes('esqueci');
      });
      const unableToVerify = txt.includes('unable to verify your account') || txt.includes('unable to verify');

      return { existe: isLoginUrl || isWelcomeBack || isLoginButton || hasForgot, unableToVerify, txt: txt.slice(0, 200) };
    });

    // "Unable to verify your account" aparece logo após o Continue do e-mail, antes
    // até da tela de senha. Sem essa checagem o script ia pro waitForSelector do
    // input#password, estourava 15s de timeout sem explicação nenhuma e o ciclo
    // falhava sem log útil. Mesma família de falha de risco/IP das outras — entra
    // no retry também.
    if (checagemEntrada.unableToVerify) {
      throw new Error(`PROXY_CONNECTION_FAIL: "Unable to verify your account" logo apos o e-mail (provavel bloqueio de risco no IP atual). Texto: "${checagemEntrada.txt}"`);
    }

    let contaJaExiste = checagemEntrada.existe;

    if (!contaJaExiste) {
      // Aguarda campo de senha para conta nova
      console.log('[3/5] Analisando formulário do Lovable...');
      try {
        await page.waitForSelector('input#password', { timeout: 15000 });
      } catch (e) {
        let textoAtual = '';
        try { textoAtual = await page.evaluate(() => document.body?.innerText?.toLowerCase() || ''); } catch (e2) {}
        throw new Error(`PROXY_CONNECTION_FAIL: campo de senha nunca apareceu apos o e-mail (${e.message}). Texto: "${textoAtual.slice(0, 150)}"`);
      }
      console.log(`[3/5] Digitando a senha gerada: ${senhaNova}...`);
      await new Promise(r => setTimeout(r, 1000));
      const campoSenha = await page.$('input#password');
      await clicarHumano(page, campoSenha);
      await digitarHumanoAleatorio(page, senhaNova);
      // Eventos gerados de forma puramente organica via page.type

      // Aguarda o Cloudflare Turnstile validar de fato
      console.log('\n[-] Aguardando resolucao real do Cloudflare Turnstile...');
      let turnstilePronto = false;
      for (let s = 1; s <= 40; s++) {
        try {
          turnstilePronto = await page.evaluate(() => {
            const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]');
            const val = turnstileInput ? turnstileInput.value : '';
            const hasToken = val && val.length > 30;
            const btn = document.querySelector('button[type="submit"]');
            const btnAtivo = btn && !btn.disabled && !btn.hasAttribute('disabled');
            return hasToken && btnAtivo;
          });
        } catch (e) {
          // Frame sumiu no meio do loop: a pagina navegou sozinha (geralmente pra
          // uma tela de erro de rede do proprio Chrome, tipo "Unable to connect to
          // network" — a conexao caiu enquanto o widget do Turnstile tentava
          // carregar recursos de challenges.cloudflare.com). Sem proxy, isso usa a
          // rede real; antes esse erro derrubava o ciclo com "detached Frame" sem
          // classificar, agora vira falha de rede explicita pro retry pegar.
          let textoErro = '';
          try { textoErro = await page.evaluate(() => document.body?.innerText?.toLowerCase() || ''); } catch (e2) {}
          throw new Error(`PROXY_CONNECTION_FAIL: pagina navegou/caiu durante espera do Turnstile (${e.message}). Texto: "${textoErro.slice(0, 150)}"`);
        }

        if (turnstilePronto) {
          console.log(`[-] Cloudflare Turnstile validado com token ativo apos ${s}s!`);
          break;
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      // Antes disso o código seguia direto pro clique mesmo sem token — clicava sem
      // Turnstile válido, o backend rejeitava em silêncio (sem texto de erro) e o
      // ciclo só descobria 90s depois, esperando um e-mail que nunca ia chegar.
      // IP de proxy lento/flagado pelo Cloudflare é a causa mais provável; tratar
      // como falha explícita deixa o retry do main() trocar de IP igual faz pro Castle.
      if (!turnstilePronto) {
        throw new Error('TURNSTILE_TIMEOUT: Cloudflare Turnstile não validou em 40s (IP provavelmente lento/flagado pelo Cloudflare)');
      }

      // Simulacao de atencao humana: movimento suave de mouse e pausa organica
      console.log('[-] Simulando mouse humano antes do submit...');
      try {
        await new Promise(r => setTimeout(r, crypto.randomInt(800, 1500)));
        const okClique = await clicarHumanoPorSeletor(page, 'button[type="submit"]');
        if (!okClique) throw new Error('clique humano falhou');
        console.log('[+] Clique organico com curva humana executado no botao!');
      } catch(e) {
        console.log('[+] Acionando submit via Enter no teclado...');
        await page.focus('input#password');
        await new Promise(r => setTimeout(r, 500));
        await page.keyboard.press('Enter');
      }

      // Aguarda a resposta do servidor com timeout paciente (evita cliques repetidos que queimam o token)
      console.log('[-] Aguardando processamento da criacao de conta pelo Lovable...');
      let submetido = false;
      for (let w = 1; w <= 15; w++) {
        await new Promise(r => setTimeout(r, 1000));
        let aindaNaTelaSenha = false;
        try {
          aindaNaTelaSenha = await page.evaluate(() => !!document.querySelector('input#password'));
        } catch (navErr) {
          aindaNaTelaSenha = false;
        }

        if (!aindaNaTelaSenha) {
          submetido = true;
          console.log('[-] FORMULARIO PROCESSADO COM SUCESSO! A tela avancou.');
          break;
        }
      }

      // Checa se já existia ou mensagem de alerta
      let erroTexto = '';
      try {
        erroTexto = await page.evaluate(() => {
          const el = document.querySelector('[role="alert"], .text-destructive, .text-red-500, p[class*="text-destructive"], div[class*="text-destructive"]');
          return el ? (el.innerText || el.textContent || '') : '';
        });
      } catch (e) {}

      // Detecta o deny do Castle explicitamente (CastleDenyError no useCastleScoring.js
      // devolve esse texto). Sem isso o script tratava como "conta nova" e ficava 90s
      // esperando um e-mail de ativação que nunca chegaria, porque a conta nunca foi
      // criada de verdade no backend.
      let textoCompletoPagina = '';
      try { textoCompletoPagina = await page.evaluate(() => document.body ? document.body.innerText.toLowerCase() : ''); } catch (e) {}
      const foiNegadoPeloCastle = /suspicious activity|registration denied|login denied|contact support/i.test(erroTexto) ||
                                  /suspicious activity|registration denied|login denied/i.test(textoCompletoPagina);

      if (foiNegadoPeloCastle) {
        throw new Error(`CASTLE_DENY: conta recusada por atividade suspeita (IP/fingerprint/velocidade flagados). Texto: "${erroTexto || textoCompletoPagina.slice(0, 150)}"`);
      }

      // Proxy residencial caiu no meio do request de criação de conta — a conta nunca
      // foi criada no backend, mas sem essa checagem o script seguia achando que deu
      // certo e ficava 90s esperando um e-mail de ativação que nunca chegaria.
      const foiFalhaDeRede = /network error|please check your connection|failed to fetch/i.test(erroTexto) ||
                             /network error|please check your connection/i.test(textoCompletoPagina);

      if (foiFalhaDeRede) {
        throw new Error(`PROXY_CONNECTION_FAIL: erro de rede no submit (proxy caiu durante o request). Texto: "${erroTexto || textoCompletoPagina.slice(0, 150)}"`);
      }

      contaJaExiste = erroTexto.toLowerCase().includes('already') ||
                      erroTexto.toLowerCase().includes('exists') ||
                      erroTexto.toLowerCase().includes('registered') ||
                      erroTexto.toLowerCase().includes('sign in');
    }

    if (contaJaExiste) {
      console.log('\n' + '!'.repeat(60));
      console.log('⚡ CONTA JÁ EXISTENTE DETECTADA! INICIANDO APROPRIAÇÃO DE SENHA...');
      console.log('!'.repeat(60));

      await dispararResetSenha(emailData.email);
      const resetInfo = await aguardarLinkResetSmailPro(emailData, 90000);

      if (resetInfo) {
        console.log(`[RESET] Abrindo página oficial de redefinição de senha...`);
        await page.goto(resetInfo.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 2000));

        // Localiza campo de nova senha e confirmação se houver
        await page.waitForSelector('input[type="password"]', { timeout: 20000 });
        const passInputs = await page.$$('input[type="password"]');
        console.log(`[RESET] Preenchendo nova senha (${passInputs.length} campo(s))...`);

        for (const inp of passInputs) {
          await clicarHumano(page, inp);
          await inp.type(senhaNova, { delay: crypto.randomInt(40, 90) });
          await page.evaluate(el => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, inp);
          await new Promise(r => setTimeout(r, 800));
        }

        // Submete formulário de redefinição na página (SEM concorrência de oobCode)
        console.log(`[RESET] Confirmando redefinição da senha na página...`);
        const submeteuWeb = await clicarHumanoPorSeletor(page, 'button[type="submit"]') ||
                            await clicarHumanoPorTexto(page, ['save', 'salvar', 'reset password', 'redefinir', 'continue', 'confirm']);

        // Se o clique no navegador falhou, aí sim usa o REST como fallback (NUNCA os dois ao mesmo tempo)
        if (!submeteuWeb && resetInfo.oobCode) {
          console.log(`[RESET] Usando REST API como fallback para aplicar nova senha...`);
          await aplicarNovaSenhaViaRest(resetInfo.oobCode, senhaNova);
        }

        salvarConta(emailData.email, senhaNova);
        console.log(`\n🏆 SENHA REDEFINIDA COM SUCESSO! A conta agora é nossa.`);

        // Aguarda o Lovable redirecionar automaticamente para o /dashboard
        console.log(`[RESET] Aguardando Lovable redirecionar para o /dashboard...`);
        let autoLogado = false;
        for (let s = 1; s <= 25; s++) {
          const curUrl = page.url().toLowerCase();
          if (curUrl.includes('/dashboard') || curUrl.includes('/projects')) {
            autoLogado = true;
            console.log(`[RESET] Redirecionamento confirmado para: ${page.url()}`);
            break;
          }
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a'));
            const cBtn = btns.find(b => {
              const t = (b.innerText || b.textContent || '').toLowerCase();
              return t.includes('dashboard') || t.includes('continue') || t.includes('projects') || t.includes('entrar');
            });
            if (cBtn) cBtn.click();
          }).catch(() => {});
          await new Promise(r => setTimeout(r, 1000));
        }

        // Se por ventura não redirecionou sozinho, faz o login manual
        if (!autoLogado) {
          console.log('[RESET] Tela ainda na confirmação. Realizando login rápido em /login...');
          await page.goto('https://lovable.dev/login', { waitUntil: 'domcontentloaded' });
          const seletorLogin = 'input#email, input[type="email"], input[name="email"]';
          await page.waitForSelector(seletorLogin, { timeout: 15000 });
          await page.type(seletorLogin, emailData.email);
          await clicarHumanoPorSeletor(page, 'button[type="submit"]');
          await page.waitForSelector('input#password', { timeout: 15000 });
          await page.type('input#password', senhaNova);
          await new Promise(r => setTimeout(r, 2000));
          await clicarHumanoPorSeletor(page, 'button[type="submit"]');
          await new Promise(r => setTimeout(r, 5000));
        }

        // Sessão autenticada: executa o remix fiel do template e colhe a chave sk_
        await executarRemixFiel(page, emailData.email, historicoConcluidos);
      }

    } else {
      console.log('\n[4/5] Conta nova! Aguardando confirmação no SmailPro...');
      const linkAtivacao = await aguardarLinkLovableSmailPro(emailData, 90000);

      if (linkAtivacao) {
        console.log(`[OK] Link de ativação recebido: ${linkAtivacao}`);
        const novaAba = await context.newPage();
        // Sem injeção sintética em novaAba
          // Sem autenticação de proxy em novaAba
        // await aplicarFingerprint(novaAba, null);
        await novaAba.goto(linkAtivacao, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 5000));

        console.log('[5/5] Concluindo onboarding...');
        console.log('[-] Aguardando 6 segundos para humanizar...');
        await new Promise(r => setTimeout(r, 6000));
        await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);

        console.log('[-] Aguardando 6 segundos para humanizar...');
        await new Promise(r => setTimeout(r, 6000));
        await preencherNomeComConfirmacao(novaAba, 'Dev Max');

        console.log('[-] Aguardando 6 segundos para humanizar...');
        await new Promise(r => setTimeout(r, 6000));
        await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);

        console.log('[-] Aguardando 6 segundos para humanizar...');
        await new Promise(r => setTimeout(r, 6000));
        await aguardarEClicarPorTexto(novaAba, ['founder']);

        await new Promise(r => setTimeout(r, 3000));
        await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);

        console.log('[-] Aguardando 6 segundos para humanizar...');
        await new Promise(r => setTimeout(r, 6000));
        await aguardarEClicarPorTexto(novaAba, ['solo']);

        await new Promise(r => setTimeout(r, 3000));
        await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);
        await new Promise(r => setTimeout(r, 6000));

        salvarConta(emailData.email, senhaNova);
        console.log(`\n🏆 CONTA NOVA CRIADA E SALVA: ${emailData.email}`);

        // Executa o remix fiel do template
        await executarRemixFiel(novaAba, emailData.email, historicoConcluidos);
        try { await novaAba.close(); } catch(e) {}
      }
    }

  } finally {
    try { await page.close(); } catch(e) {}
    try { await context.close(); } catch(e) {}
    try { await browser.close(); } catch(e) {}
    try { chromeProc.kill(); } catch(e) {}
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const count = parseInt(argv[0] || '1', 10);
  const tipo = argv[1] || 'outlook';

  const historicoConcluidos = carregarHistoricoConcluidos();

  console.log('============================================================');
  console.log('   FABRICADOR & REMIX AUTOMÁTICO DE CONTAS LOVABLE (SMAILPRO)  ');
  console.log('============================================================');
  console.log(`Lote programado: ${count} conta(s) | Provedor: ${tipo.toUpperCase()}`);
  console.log(`Contas já concluídas no histórico: ${historicoConcluidos.size} conta(s)\n`);

  const MAX_TENTATIVAS_CASTLE_DENY = 3;

  for (let i = 1; i <= count; i++) {
    console.log(`\n>>> INICIANDO CICLO ${i} DE ${count} <<<`);

    for (let tentativa = 1; tentativa <= MAX_TENTATIVAS_CASTLE_DENY; tentativa++) {
      try {
        await processarCicloConta(tipo, historicoConcluidos);
        break; // sucesso, sai do retry deste ciclo
      } catch (err) {
        const ehFalhaDeIp = err.message.startsWith('CASTLE_DENY') || err.message.startsWith('TURNSTILE_TIMEOUT') || err.message.startsWith('PROXY_CONNECTION_FAIL');

        if (ehFalhaDeIp && tentativa < MAX_TENTATIVAS_CASTLE_DENY) {
          // Retry só pra CASTLE_DENY: a próxima chamada de processarCicloConta já
          // puxa um e-mail novo (criarEmailReal) e um proxy novo (obterProximaProxy
          // avança o índice a cada chamada) automaticamente, então o retry sozinho
          // já troca a identidade inteira da tentativa, não só o IP.
          console.log(`\n[RETRY] Tentativa ${tentativa}/${MAX_TENTATIVAS_CASTLE_DENY} falhou (${err.message.split(':')[0]}). Trocando de IP/e-mail e tentando de novo...`);
          const delayRetry = crypto.randomInt(10000, 20000);
          console.log(`[-] Aguardando ${Math.round(delayRetry / 1000)}s antes do retry...`);
          await new Promise(r => setTimeout(r, delayRetry));
          continue;
        }

        console.log(`[ERRO NO CICLO ${i}] ${err.message}`);
        break;
      }
    }
    if (i < count) {
      const delayLote = crypto.randomInt(20000, 45000);
      console.log(`\n[-] Intervalo humano entre contas: aguardando ${Math.round(delayLote / 1000)}s...`);
      await new Promise(r => setTimeout(r, delayLote));
    }
  }

  console.log('\n============================================================');
  console.log(' LOTE COMPLETO FINALIZADO! TODAS AS CHAVES FORAM ESTOCADAS.  ');
  console.log('============================================================\n');
}

main().catch(err => console.error('Erro geral:', err.message));
