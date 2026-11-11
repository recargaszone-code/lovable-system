// node, puppeteer-core, target: lovable.dev account creation
// uses the same Chrome-real + puppeteer.connect() pattern as fabricador_contas_smailpro.js
// flow: POST /auth/check-auth-provider → POST /auth/signup (turnstile + castle)
// turnstile resolves naturally in the real Chrome — no headless

'use strict';

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const tls = require('tls');
const os = require('os');

const {
  clicarHumano,
  clicarHumanoPorSeletor,
  simularPresencaHumanaInicial,
  digitarHumanoAleatorio,
} = require('./humanize');

const {
  gerarPerfilFingerprint,
  aplicarFingerprint,
} = require('./fingerprint');

// VPN toggle — optional, só ativa se vpn_rotator existir e VPN_ROTATE != '0'
let _vpn = null;
try {
  _vpn = require('./vpn_rotator');
} catch {}
const VPN_AUTO = _vpn && process.env.VPN_ROTATE !== '0';

const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';
const LOVABLE_API_BASE = 'https://api.lovable.dev';
const CASTLE_PK = 'pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M';
let LOVABLE_GIT_SHA = '6462f9a33cdfbc0c1494b8365435191a99b15b2c';

// Chrome path — local Windows ou Alpine container
const CHROME_PATH = process.env.CHROME_PATH || (
  process.platform === 'linux'
    ? '/usr/bin/chromium-browser'
    : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
);

// --- chrome real via spawn + connect ---
function aguardarPortaDebug(porta, timeoutMs = 200000) {
  const inicio = Date.now();
  let tentativas = 0;
  return new Promise((resolve, reject) => {
    const tentar = () => {
      tentativas++;
      const req = http.get(`http://127.0.0.1:${porta}/json/version`, { timeout: 3000 }, res => {
        res.resume();
        if (res.statusCode === 200) {
          console.log(`[chrome] ✅ port ${porta} respondendo em ${Date.now() - inicio}ms (tentativa ${tentativas})`);
          return resolve(true);
        }
        retry();
      });
      req.on('error', (err) => {
        if (tentativas % 20 === 0) {
          const elapsed = Math.round((Date.now() - inicio) / 1000);
          console.log(`[chrome] ⏳ aguardando... tentativa ${tentativas} (${elapsed}s, erro: ${err.code})`);
        }
        retry();
      });
      req.on('timeout', () => {
        req.destroy();
        retry();
      });
    };
    const retry = () => {
      const elapsed = Date.now() - inicio;
      if (elapsed > timeoutMs) {
        const elapsedSec = Math.round(elapsed / 1000);
        return reject(new Error(`timeout aguardando Chrome após ${tentativas} tentativas em ${elapsedSec}s`));
      }
      // inicio lento: 500ms, depois exponential backoff
      const delay = tentativas < 3 ? 500 : Math.min(200 * Math.pow(1.3, Math.floor(tentativas / 5)), 3000);
      setTimeout(tentar, delay);
    };
    tentar();
  });
}

function parseProxy(proxy_server) {
  if (!proxy_server) return null;
  try {
    const u = new URL(proxy_server);
    return {
      host: u.hostname,
      port: u.port,
      username: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      hostPort: `${u.hostname}:${u.port}`,
    };
  } catch {
    const parts = proxy_server.split(':');
    if (parts.length >= 2) {
      return {
        host: parts[0],
        port: parts[1],
        username: parts[2] || '',
        password: parts[3] || '',
        hostPort: `${parts[0]}:${parts[1]}`,
      };
    }
    return null;
  }
}

async function abrirChromeNativo(proxy_server, extra_args = []) {
  const porta = crypto.randomInt(9222, 9999);
  const pastaTemp = path.join(os.tmpdir(), `chrome_lovable_${Date.now()}_${crypto.randomInt(100000, 999999)}`);
  const proxy = parseProxy(proxy_server);

  const chromeArgs = [
    `--user-data-dir=${pastaTemp}`,
    `--remote-debugging-port=${porta}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1024,768',
    '--lang=en-US,en,pt-BR,pt',
    // Performance flags críticas pra Railway (512MB RAM)
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-software-rasterizer',
    '--disable-extensions',
    '--disable-plugins',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-background-networking',
    '--disable-client-side-phishing-detection',
    ...extra_args,
  ];

  // if (proxy) {
  //   chromeArgs.push(`--proxy-server=${proxy.hostPort}`);
  //   console.log(`[chrome] proxy: ${proxy.hostPort} (auth: ${proxy.username ? 'yes' : 'no'})`);
  // }

  const isRailway = process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_REGION;
  const timeoutMs = isRailway ? 200000 : 120000; // Railway: 200s, local: 120s

  console.log(`[chrome] abrindo (${isRailway ? '🚂 RAILWAY' : 'local'}, timeout: ${Math.round(timeoutMs / 1000)}s)...`);
  console.log(`[chrome]   perfil: ${pastaTemp}`);
  console.log(`[chrome]   porta: ${porta}`);
  console.log(`[chrome]   path: ${CHROME_PATH}`);

  const chromeProc = spawn(CHROME_PATH, chromeArgs, {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
  });

  chromeProc.on('error', (err) => {
    console.error(`[chrome] ❌ spawn error: ${err.message}`);
  });

  chromeProc.unref();

  console.log(`[chrome] ⏳ aguardando porta ${porta}...`);
  await aguardarPortaDebug(porta, timeoutMs);
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${porta}`,
    defaultViewport: null,
  });

  // if proxy has auth, set up automatic authentication on all pages
  if (proxy && proxy.username) {
    browser.on('targetcreated', async (target) => {
      if (target.type() === 'page') {
        try {
          const p = await target.page();
          if (p) await p.authenticate({ username: proxy.username, password: proxy.password });
        } catch {}
      }
    });
    // auth on existing pages
    const existingPages = await browser.pages();
    for (const p of existingPages) {
      try { await p.authenticate({ username: proxy.username, password: proxy.password }); } catch {}
    }
  }

  return { browser, chromeProc, pastaTemp, proxy };
}

function https_post_json(url, body, extra_headers = {}, proxy_server = null) {
  const data = JSON.stringify(body);
  const parsed = new URL(url);
  const req_opts = {
    method: 'POST',
    hostname: parsed.hostname,
    port: parsed.port || 443,
    path: parsed.pathname + parsed.search,
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...extra_headers },
  };

  const handle_response = (res) => new Promise((resolve) => {
    let buf = '';
    res.on('data', c => buf += c);
    res.on('end', () => {
      let json = null;
      try { json = JSON.parse(buf); } catch {}
      resolve({ status: res.statusCode, body: json ?? buf });
    });
  });

  if (!proxy_server) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers: req_opts.headers,
      }, (res) => handle_response(res).then(resolve));
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  // proxy: HTTP CONNECT tunnel
  const px = parseProxy(proxy_server);
  return new Promise((resolve, reject) => {
    const connect_opts = {
      hostname: px.host,
      port: parseInt(px.port),
      method: 'CONNECT',
      path: `${parsed.hostname}:${parsed.port || 443}`,
    };
    if (px.username) {
      connect_opts.headers = {
        'Proxy-Authorization': 'Basic ' + Buffer.from(`${px.username}:${px.password}`).toString('base64'),
      };
    }
    const tunnel = http.request(connect_opts);
    tunnel.on('connect', (res, socket) => {
      if (res.statusCode !== 200) {
        socket.destroy();
        return reject(new Error(`proxy CONNECT failed: ${res.statusCode}`));
      }
      const tls_sock = tls.connect({ host: parsed.hostname, socket, servername: parsed.hostname, rejectUnauthorized: false });
      const req = https.request({ ...req_opts, agent: false, createConnection: () => tls_sock }, (r) => handle_response(r).then(resolve));
      req.on('error', reject);
      req.write(data);
      req.end();
    });
    tunnel.on('error', reject);
    tunnel.end();
  });
}

function lovable_headers(ua) {
  return {
    'x-lov-platform': JSON.stringify({
      platform: 'web',
      version: LOVABLE_GIT_SHA,
      clientCapabilities: ['visual_explanation_v1', 'board_forms_v1'],
    }),
    'X-Client-Git-SHA': LOVABLE_GIT_SHA,
    'User-Agent': ua || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Origin': 'https://lovable.dev',
    'Referer': 'https://lovable.dev/',
  };
}

// --- standalone castle token minting with lovable.dev origin ---
// Chrome resolves lovable.dev → 127.0.0.1 via --host-resolver-rules
// Castle SDK sees window.location.hostname === "lovable.dev" → token has correct origin
// Telemetry blocked so castle can't track the fake session
async function harvest_castle_token_fast(proxy_server) {
  const sdk_path = path.join(__dirname, 'node_modules', '@castleio', 'castle-js', 'dist', 'castle.browser.js');
  if (!fs.existsSync(sdk_path)) throw new Error('castle SDK not found — run: npm install @castleio/castle-js');
  const sdk_code = fs.readFileSync(sdk_path, 'utf8');

  const cuid = crypto.randomUUID();
  const html = `<!DOCTYPE html><html><head><title>Lovable</title></head><body>
    <script>${sdk_code}<\/script>
    <script>
      document.cookie = "__cuid=${cuid}; path=/; max-age=34560000; SameSite=Lax";
      window.__result = { token: null, error: null, origin: window.location.origin, hostname: window.location.hostname };
      try {
        Castle.configure({ pk: "${CASTLE_PK}" });
        Castle.createRequestToken().then(function(token) {
          window.__result.token = token;
        }).catch(function(e) {
          window.__result.error = e.message;
        });
      } catch(e) { window.__result.error = e.message; }
    </script>
  </body></html>`;

  // generate self-signed cert for lovable.dev on the fly via openssl
  const certDir = path.join(os.tmpdir(), `castle_cert_${Date.now()}`);
  fs.mkdirSync(certDir, { recursive: true });
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');
  
  const opensslBin = (() => {
    const candidates = [
      'openssl',
      'C:\\Program Files\\Git\\usr\\bin\\openssl.exe',
      'C:\\Program Files\\OpenSSL-Win64\\bin\\openssl.exe',
      'C:\\Program Files (x86)\\OpenSSL-Win32\\bin\\openssl.exe'
    ];
    for (const c of candidates) {
      try {
        if (c === 'openssl' || fs.existsSync(c)) {
          require('child_process').execSync(`"${c}" version`, { stdio: 'pipe' });
          return `"${c}"`;
        }
      } catch {}
    }
    return 'openssl';
  })();

  require('child_process').execSync(
    `${opensslBin} req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 1 -nodes -subj "/CN=lovable.dev" 2>nul`,
    { stdio: 'pipe' }
  );
  const sslKey = fs.readFileSync(keyPath);
  const sslCert = fs.readFileSync(certPath);
  fs.rmSync(certDir, { recursive: true, force: true });

  // local HTTPS server — Chrome connects here via host-resolver-rules
  // HSTS on lovable.dev forces HTTPS, so we must serve TLS
  const server = https.createServer({ key: sslKey, cert: sslCert }, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
  const port = 19876 + Math.floor(Math.random() * 1000);
  await new Promise(r => server.listen(port, '127.0.0.1', r));

  // Chrome with DNS override: lovable.dev → 127.0.0.1
  // navigating to https://lovable.dev:PORT hits our local HTTPS server
  // window.location.hostname = "lovable.dev" → castle token has correct origin
  const { browser, chromeProc, pastaTemp } = await abrirChromeNativo(proxy_server, [
    `--host-resolver-rules=MAP lovable.dev 127.0.0.1`,
    '--ignore-certificate-errors',
  ]);
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  // block castle telemetry — SDK generates token locally but can't phone home
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.setBlockedURLs', {
    urls: ['*castle.io*', '*cstl.io*'],
  });

  // navigate to "lovable.dev" over HTTPS (actually our local HTTPS server)
  console.log(`[harvest] navegando pra https://lovable.dev:${port} (→ 127.0.0.1)...`);
  await page.goto(`https://lovable.dev:${port}`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.waitForFunction(
    () => window.__result && (window.__result.token || window.__result.error),
    { timeout: 15000 }
  );

  const result = await page.evaluate(() => window.__result);
  const ua = await page.evaluate(() => navigator.userAgent);

  console.log(`[harvest] origin: ${result.origin}, hostname: ${result.hostname}`);

  await browser.close();
  server.close();
  try { chromeProc.kill(); } catch {}
  setTimeout(() => { try { fs.rmSync(pastaTemp, { recursive: true, force: true }); } catch {} }, 3000);

  if (result.error) throw new Error(`castle fast-mint failed: ${result.error}`);
  if (!result.token) throw new Error('castle fast-mint: no token returned');

  return { token: result.token, user_agent: ua };
}

// --- full browser signup with castle token injection (lovable.dev origin) ---
// 1. harvest castle token with lovable.dev origin (host-resolver trick)
// 2. open real Chrome on /signup WITH proxy (fresh IP)
// 3. intercept outgoing POSTs via CDP Fetch, swap castle_request_token
// 4. castle telemetry on signup page flows normally (not blocked)
// result: token has lovable.dev origin + fresh IP + natural signup telemetry
async function create_account(email, password, proxy_server = null) {
  // step 0: harvest token with lovable.dev origin
  console.log('[0/5] mintando castle token (origin: lovable.dev)...');
  const castle_mint = await harvest_castle_token_fast(null);
  console.log(`[0/5] castle token: ${castle_mint.token.length} chars`);

  const { browser, chromeProc, pastaTemp } = await abrirChromeNativo(proxy_server);
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  // intercept lovable API calls to swap castle token
  await client.send('Fetch.enable', {
    patterns: [
      { urlPattern: '*api.lovable.dev/auth/check-auth-provider*', requestStage: 'Request' },
      { urlPattern: '*api.lovable.dev/auth/signup*', requestStage: 'Request' },
    ],
  });

  const captured = {
    check_auth: null,
    signup: null,
    tokens_injected: 0,
  };

  // swap castle token in outgoing requests
  client.on('Fetch.requestPaused', async (event) => {
    const { requestId, request } = event;
    try {
      if (request.method === 'POST' && request.postData) {
        const body = JSON.parse(request.postData);
        if (body.castle_request_token) {
          const original_len = body.castle_request_token.length;
          body.castle_request_token = castle_mint.token;
          captured.tokens_injected++;
          console.log(`[castle] token injetado no ${request.url.includes('signup') ? 'signup' : 'check-auth'} (original: ${original_len} → nosso: ${castle_mint.token.length})`);
          await client.send('Fetch.continueRequest', {
            requestId,
            postData: Buffer.from(JSON.stringify(body)).toString('base64'),
          });
          return;
        }
      }
    } catch {}
    await client.send('Fetch.continueRequest', { requestId });
  });

  // capture API responses
  client.on('Network.responseReceived', async (e) => {
    const url = e.response.url;
    if ((url.includes('/auth/check-auth-provider') || url.includes('/auth/signup')) && e.response.status !== 204) {
      try {
        const body = await client.send('Network.getResponseBody', { requestId: e.requestId });
        const parsed = body.body ? (() => { try { return JSON.parse(body.body); } catch { return body.body; } })() : null;
        if (url.includes('/auth/check-auth-provider')) {
          captured.check_auth = { status: e.response.status, body: parsed };
        }
        if (url.includes('/auth/signup')) {
          captured.signup = { status: e.response.status, body: parsed };
        }
      } catch {}
    }
  });

  try {
    // navegar pro signup
    console.log('[1/5] abrindo /signup...');
    await page.goto('https://lovable.dev/signup', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));

    // fechar cookie banner se existir
    try {
      const botaoOk = await page.$('button::-p-text(OK)');
      if (botaoOk) await clicarHumano(page, botaoOk);
    } catch {}

    // presença humana inicial
    await simularPresencaHumanaInicial(page);

    // digitar email
    console.log(`[2/5] digitando email: ${email}...`);
    const seletorEmail = 'input#email, input[type="email"], input[name="email"]';
    await page.waitForSelector(seletorEmail, { timeout: 30000 });
    const campoEmail = await page.$(seletorEmail);
    await clicarHumano(page, campoEmail);
    await digitarHumanoAleatorio(page, email);
    await new Promise(r => setTimeout(r, 1000));

    // clicar continue
    await clicarHumanoPorSeletor(page, 'button[type="submit"]');

    // checar se conta já existe ou "unable to verify"
    await new Promise(r => setTimeout(r, 2500));
    const checagem = await page.evaluate(() => {
      const curUrl = window.location.href.toLowerCase();
      const txt = document.body ? document.body.innerText.toLowerCase() : '';
      const isLogin = curUrl.includes('/login') || txt.includes('welcome back') || txt.includes('sign in to your account');
      const unableToVerify = txt.includes('unable to verify');
      return { isLogin, unableToVerify, txt: txt.slice(0, 200) };
    });

    if (checagem.unableToVerify) {
      throw new Error(`VERIFY_FAIL: "Unable to verify" — IP provavelmente flagado. ${checagem.txt}`);
    }

    if (checagem.isLogin) {
      throw new Error(`ACCOUNT_EXISTS: email já registrado ou redirecionou pra login`);
    }

    // esperar campo de senha
    console.log('[3/5] esperando campo de senha...');
    try {
      await page.waitForSelector('input#password', { timeout: 15000 });
    } catch (e) {
      let txt = '';
      try { txt = await page.evaluate(() => document.body?.innerText?.toLowerCase() || ''); } catch {}
      throw new Error(`PASSWORD_FIELD_MISSING: campo de senha não apareceu. Texto: "${txt.slice(0, 150)}"`);
    }

    await new Promise(r => setTimeout(r, 1000));
    console.log(`[3/5] digitando senha...`);
    const campoSenha = await page.$('input#password');
    await clicarHumano(page, campoSenha);
    await digitarHumanoAleatorio(page, password);

    // esperar turnstile resolver
    console.log('[4/5] aguardando Cloudflare Turnstile...');
    let turnstilePronto = false;
    for (let s = 1; s <= 40; s++) {
      try {
        turnstilePronto = await page.evaluate(() => {
          const input = document.querySelector('input[name="cf-turnstile-response"]');
          const val = input ? input.value : '';
          const hasToken = val && val.length > 30;
          const btn = document.querySelector('button[type="submit"]');
          const btnAtivo = btn && !btn.disabled;
          return hasToken && btnAtivo;
        });
      } catch (e) {
        let txt = '';
        try { txt = await page.evaluate(() => document.body?.innerText?.toLowerCase() || ''); } catch {}
        throw new Error(`TURNSTILE_CRASH: página caiu durante turnstile (${e.message}). Texto: "${txt.slice(0, 150)}"`);
      }

      if (turnstilePronto) {
        console.log(`[4/5] turnstile resolvido em ${s}s`);
        break;
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    if (!turnstilePronto) {
      throw new Error('TURNSTILE_TIMEOUT: não resolveu em 40s');
    }

    // submit
    console.log('[5/5] submetendo...');
    await new Promise(r => setTimeout(r, crypto.randomInt(800, 1500)));
    const okClique = await clicarHumanoPorSeletor(page, 'button[type="submit"]');
    if (!okClique) {
      console.log('[5/5] fallback: Enter no teclado...');
      await page.focus('input#password');
      await new Promise(r => setTimeout(r, 500));
      await page.keyboard.press('Enter');
    }

    // esperar resposta
    console.log('[*] aguardando resposta do servidor...');
    let submetido = false;
    for (let w = 1; w <= 15; w++) {
      await new Promise(r => setTimeout(r, 1000));
      let aindaNaTelaSenha = false;
      try {
        aindaNaTelaSenha = await page.evaluate(() => !!document.querySelector('input#password'));
      } catch { aindaNaTelaSenha = false; }
      if (!aindaNaTelaSenha) {
        submetido = true;
        console.log('[*] formulário processado — tela avançou');
        break;
      }
    }

    // checar erros
    let erroTexto = '';
    try {
      erroTexto = await page.evaluate(() => {
        const el = document.querySelector('[role="alert"], .text-destructive, .text-red-500');
        return el ? (el.innerText || el.textContent || '') : '';
      });
    } catch {}

    let textoCompleto = '';
    try { textoCompleto = await page.evaluate(() => document.body?.innerText?.toLowerCase() || ''); } catch {}

    const castleDeny = /suspicious activity|registration denied|login denied/i.test(erroTexto + textoCompleto);
    const networkFail = /network error|please check your connection|failed to fetch/i.test(erroTexto + textoCompleto);

    if (castleDeny) {
      throw new Error(`CASTLE_DENY: ${erroTexto || textoCompleto.slice(0, 150)}`);
    }
    if (networkFail) {
      throw new Error(`NETWORK_FAIL: ${erroTexto || textoCompleto.slice(0, 150)}`);
    }

    const finalUrl = await page.evaluate(() => window.location.href);
    console.log('[*] url final:', finalUrl);

    // esperar um pouco mais pra capturar a response completa
    await new Promise(r => setTimeout(r, 3000));

    return {
      success: !castleDeny && !networkFail && submetido,
      email,
      check_auth: captured.check_auth,
      signup: captured.signup,
      final_url: finalUrl,
      error: erroTexto || null,
    };

  } finally {
    try { await browser.close(); } catch {}
    try { chromeProc.kill(); } catch {}
    setTimeout(() => { try { fs.rmSync(pastaTemp, { recursive: true, force: true }); } catch {} }, 3000);
  }
}

const TURNSTILE_SITEKEY = '0x4AAAAAAChnKAZBY0iFpFHC';

// --- solve turnstile via minimal page (no form, just the widget) ---
async function solve_turnstile(proxy_server) {
  let browser, chromeProc, pastaTemp;
  try {
    const chrome = await abrirChromeNativo(proxy_server);
    browser = chrome.browser;
    chromeProc = chrome.chromeProc;
    pastaTemp = chrome.pastaTemp;

    const pages = await browser.pages();
    const page = pages[0] || await browser.newPage();

    console.log('[turnstile] navegando pra lovable.dev/signup...');
    await page.goto('https://lovable.dev/signup', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));

    const rand = crypto.randomBytes(4).toString('hex');
    const dummyEmail = `ts_${rand}@gmail.com`;
    try {
      await page.waitForSelector('#email', { timeout: 15000 });
      await page.type('#email', dummyEmail, { delay: 20 });
      console.log(`[turnstile] email digitado: ${dummyEmail}`);
      await new Promise(r => setTimeout(r, 500));
      await page.click('button[type="submit"]');
      console.log('[turnstile] clicou Continue, esperando form de senha...');
      await page.waitForSelector('#password', { timeout: 15000 });
      console.log('[turnstile] form de senha apareceu');
    } catch (e) {
      console.log(`[turnstile] interação: ${e.message}`);
    }

    let token = null;
    for (let i = 1; i <= 40; i++) {
      await new Promise(r => setTimeout(r, 1000));
      token = await page.evaluate(() => {
        const inp = document.querySelector('input[name="cf-turnstile-response"]');
        if (inp && inp.value && inp.value.length > 30) return inp.value;
        if (window.turnstile) {
          const widgets = document.querySelectorAll('[data-turnstile-widget-id]');
          for (const w of widgets) {
            const resp = window.turnstile.getResponse(w.getAttribute('data-turnstile-widget-id'));
            if (resp && resp.length > 30) return resp;
          }
        }
        return null;
      });
      if (token) {
        console.log(`[turnstile] resolvido em ${i}s (${token.length} chars)`);
        break;
      }
    }

    const ua = await page.evaluate(() => navigator.userAgent);

    if (!token) throw new Error('TURNSTILE_TIMEOUT: não resolveu em 40s na página real');
    return { token, user_agent: ua };
  } catch (err) {
    const msg = (err.message || '').toLowerCase();
    if (msg.includes('tunnel') || msg.includes('err_tunnel') || msg.includes('econnreset') || msg.includes('socket hang up')) {
      throw new Error(`TUNNEL_FAILED: proxy tunnel caiu durante turnstile — ${err.message}`);
    }
    throw err;
  } finally {
    try { if (browser) await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
    if (pastaTemp) setTimeout(() => { try { fs.rmSync(pastaTemp, { recursive: true, force: true }); } catch {} }, 3000);
  }
}

// --- API-only account creation (no form filling) ---
// 1. harvest castle token with lovable.dev origin (~5s)
// 2. solve turnstile on minimal page (~8s)
// 3. direct API calls: check-auth-provider + signup (<1s)
// total: ~15s vs ~68s with browser form
async function create_account_api(email, password, proxy_server = null) {
  // step 1: harvest castle token (local — token é gerado offline, telemetria castle bloqueada)
  console.log('[1/3] mintando castle token (origin: lovable.dev)...');
  const castle = await harvest_castle_token_fast(null);
  console.log(`[1/3] castle token: ${castle.token.length} chars`);

  // step 2: solve turnstile — VPN OFF pra resolver mais rápido
  if (VPN_AUTO) await _vpn.disconnectVPN();
  console.log('[2/3] resolvendo turnstile...');
  const ts = await solve_turnstile(proxy_server);
  console.log(`[2/3] turnstile token: ${ts.token.length} chars`);

  // VPN ON antes dos API calls
  if (VPN_AUTO) {
    const up = await _vpn.connectVPN();
    if (!up) console.log('[vpn] AVISO: VPN não conectou, API calls sem proteção');
  }

  const headers = lovable_headers(ts.user_agent);

  // step 3a: check-auth-provider
  console.log('[3/3] chamando API direta...');
  const check = await https_post_json(
    `${LOVABLE_API_BASE}/auth/check-auth-provider`,
    { email, castle_request_token: castle.token },
    headers,
    proxy_server
  );
  console.log(`[api] check-auth-provider: ${check.status}`);

  if (check.status !== 200) {
    return { success: false, email, check_auth: check, signup: null, error: `check-auth failed: ${check.status}` };
  }

  // step 3b: signup (API calls go through proxy for fresh IP)
  const signup = await https_post_json(
    `${LOVABLE_API_BASE}/auth/signup`,
    {
      email,
      password,
      locale: 'en',
      turnstile_token: ts.token,
      castle_request_token: castle.token,
    },
    headers,
    proxy_server
  );
  console.log(`[api] signup: ${signup.status}`);

  const success = signup.status === 200 && signup.body?.custom_token;
  const error = !success ? (signup.body?.message || signup.body?.error || JSON.stringify(signup.body).slice(0, 200)) : null;

  return {
    success,
    email,
    check_auth: check,
    signup,
    error,
  };
}

async function login_account_api(email, password, proxy_server = null) {
  // garante VPN ON pra login (só API calls, sem turnstile)
  if (VPN_AUTO) {
    const up = await _vpn.connectVPN();
    if (!up) console.log('[vpn] AVISO: VPN não conectou pro login');
  }

  // step 1: castle token
  console.log('[login 1/4] mintando castle token...');
  const castle = await harvest_castle_token_fast(null);
  console.log(`[login 1/4] castle token: ${castle.token.length} chars`);

  const headers = lovable_headers(castle.user_agent);

  // step 2: check-auth-provider
  console.log('[login 2/4] check-auth-provider...');
  const check = await https_post_json(
    `${LOVABLE_API_BASE}/auth/check-auth-provider`,
    { email, castle_request_token: castle.token },
    headers,
    proxy_server
  );
  console.log(`[login] check-auth-provider: ${check.status}`);

  if (check.status !== 200) {
    return { success: false, email, check_auth: check, error: `check-auth failed: ${check.status}` };
  }
  if (!check.body?.user_exists) {
    return { success: false, email, check_auth: check, error: 'user does not exist' };
  }

  // step 3: castle-event $login $attempted
  console.log('[login 3/4] castle-event (pre-login)...');
  const castle2 = await harvest_castle_token_fast(null);
  const evt = await https_post_json(
    `${LOVABLE_API_BASE}/auth/castle-event`,
    {
      request_token: castle2.token,
      type: '$login',
      status: '$attempted',
      email,
      authentication_method: { type: '$password' },
    },
    headers,
    proxy_server
  );
  console.log(`[login] castle-event: ${evt.status}`);

  // step 4: Firebase signInWithPassword
  console.log('[login 4/4] Firebase signInWithPassword...');
  const signin = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { returnSecureToken: true, email, password, clientType: 'CLIENT_TYPE_WEB' },
    headers,
    proxy_server
  );
  console.log(`[login] signInWithPassword: ${signin.status}`);

  if (signin.status !== 200) {
    const msg = signin.body?.error?.message || JSON.stringify(signin.body).slice(0, 200);
    return { success: false, email, check_auth: check, castle_event: evt, login: signin, error: `firebase login failed: ${msg}` };
  }

  // post-login castle-event $succeeded
  try {
    const castle3 = await harvest_castle_token_fast(null);
    await https_post_json(
      `${LOVABLE_API_BASE}/auth/castle-event`,
      {
        request_token: castle3.token,
        type: '$login',
        status: '$succeeded',
        email,
        user_id: signin.body.localId,
        authentication_method: { type: '$password' },
      },
      { ...headers, 'Authorization': `Bearer ${signin.body.idToken}` },
      proxy_server
    );
  } catch {}

  return {
    success: true,
    email,
    uid: signin.body.localId,
    idToken: signin.body.idToken,
    refreshToken: signin.body.refreshToken,
    expiresIn: signin.body.expiresIn,
    check_auth: check,
    castle_event: evt,
    error: null,
  };
}

async function create_and_login(email, password, proxy_server = null) {
  const t0 = Date.now();
  console.log('=== CREATE + LOGIN ===');
  console.log(`email: ${email}`);

  // phase 1: signup
  console.log('\n--- SIGNUP ---');
  const signup = await create_account_api(email, password, proxy_server);
  const signup_time = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[signup] ${signup.success ? 'OK' : 'FAIL'} (${signup_time}s)`);

  if (!signup.success) {
    return {
      success: false,
      phase: 'signup',
      email,
      signup,
      login: null,
      error: signup.error,
      time: signup_time,
    };
  }

  // phase 2: login via browser
  console.log('\n--- LOGIN ---');
  const t1 = Date.now();
  const login = await login_account_api(email, password, proxy_server);
  const login_time = ((Date.now() - t1) / 1000).toFixed(1);
  const total_time = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[login] ${login.success ? 'OK' : 'FAIL'} (${login_time}s)`);
  console.log(`[total] ${total_time}s`);

  return {
    success: login.success,
    phase: login.success ? 'done' : 'login',
    email,
    signup,
    login,
    uid: login.uid,
    idToken: login.idToken,
    refreshToken: login.refreshToken,
    error: login.error,
    time: total_time,
  };
}

module.exports = {
  CASTLE_PK,
  LOVABLE_GIT_SHA,
  TURNSTILE_SITEKEY,
  harvest_castle_token_fast,
  solve_turnstile,
  create_account_api,
  login_account_api,
  create_and_login,
  create_account,
  abrirChromeNativo,
  lovable_headers,
  https_post_json,
};
