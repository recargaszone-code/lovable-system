'use strict';

process.on('uncaughtException', (err) => {
  if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.code === 'ERR_SOCKET_CONNECTION_TIMEOUT') {
    console.error(`[warn] ${err.code} ignorado`);
    return;
  }
  console.error('[fatal]', err);
  process.exit(1);
});

// fabricador API + Chrome mínimo pra key extraction
// flow: smailpro email → signup → verify email → login → workspace → remix → key (Chrome)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const tls = require('tls');

const {
  harvest_castle_token_fast,
  create_account_api,
  login_account_api,
  lovable_headers,
  https_post_json,
  LOVABLE_GIT_SHA,
} = require('./castle_bypass');

const {
  criarEmailReal,
  aguardarLinkLovableSmailPro,
} = require('./smailpro_auto_helper');

const { rotateVPN, ensureVPNConnected, connectVPN, disconnectVPN, getPublicIP, adapterStatus } = require('./vpn_rotator');

const VPN_ROTATE_EVERY = parseInt(process.env.VPN_ROTATE_EVERY || '3', 10);
const VPN_ENABLED = process.env.VPN_ROTATE !== '0';

const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';
const LOVABLE_API = 'https://api.lovable.dev';
const TEMPLATE_PROJECT_ID = 'd2d2f51d-b553-46f7-9e86-585e519f1e19';

// Rotação de proxies
const PROXY_LIST = (process.env.PROXY_LIST || '').split('|').filter(p => p.trim());
let PROXY_INDEX = 0;

function getNextProxy() {
  if (!PROXY_LIST.length) return null;
  const proxy = PROXY_LIST[PROXY_INDEX % PROXY_LIST.length];
  PROXY_INDEX++;
  const [host, port, user, pass] = proxy.split(':');
  return `http://${user}:${pass}@${host}:${port}`;
}

const PROXY = (process.env.LOVABLE_PROXY === 'none' || process.env.LOVABLE_PROXY === '') ? null : (process.env.LOVABLE_PROXY || getNextProxy());

const ACTIVE_KEYS_FILE = 'C:\\Users\\ShadezinX\\active_keys.json';
const HISTORICO_FILE = path.join(__dirname, 'contas_concluidas_com_chave.txt');

// --- helpers ---

function parseProxy(proxy_server) {
  if (!proxy_server) return null;
  try {
    const u = new URL(proxy_server);
    return { host: u.hostname, port: u.port, username: decodeURIComponent(u.username || ''), password: decodeURIComponent(u.password || ''), hostPort: `${u.hostname}:${u.port}` };
  } catch {
    const p = proxy_server.split(':');
    return p.length >= 2 ? { host: p[0], port: p[1], username: p[2] || '', password: p[3] || '', hostPort: `${p[0]}:${p[1]}` } : null;
  }
}

function https_get_json(url, extra_headers = {}, proxy_server = null) {
  const parsed = new URL(url);
  const headers = { 'Accept': 'application/json', ...extra_headers };

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
      const req = https.get(url, { headers }, (res) => handle_response(res).then(resolve));
      req.on('error', reject);
      req.end();
    });
  }

  const px = parseProxy(proxy_server);
  return new Promise((resolve, reject) => {
    const connect_opts = {
      hostname: px.host, port: parseInt(px.port), method: 'CONNECT',
      path: `${parsed.hostname}:${parsed.port || 443}`,
    };
    if (px.username) connect_opts.headers = { 'Proxy-Authorization': 'Basic ' + Buffer.from(`${px.username}:${px.password}`).toString('base64') };
    const tunnel = http.request(connect_opts);
    tunnel.on('connect', (res, socket) => {
      if (res.statusCode !== 200) { socket.destroy(); return reject(new Error(`proxy CONNECT failed: ${res.statusCode}`)); }
      const tls_sock = tls.connect({ host: parsed.hostname, socket, servername: parsed.hostname, rejectUnauthorized: false });
      const req = https.get({ hostname: parsed.hostname, port: parsed.port || 443, path: parsed.pathname + parsed.search, headers, agent: false, createConnection: () => tls_sock }, (r) => handle_response(r).then(resolve));
      req.on('error', reject);
      req.end();
    });
    tunnel.on('error', reject);
    tunnel.end();
  });
}

function gerarSenha() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const specials = '!@#$%&*';
  let s = '';
  s += CHARS[crypto.randomInt(CHARS.length)];
  s += chars[crypto.randomInt(chars.length)];
  s += chars[crypto.randomInt(chars.length)];
  s += '_';
  for (let i = 0; i < 6; i++) s += chars[crypto.randomInt(chars.length)];
  s += nums[crypto.randomInt(nums.length)];
  s += specials[crypto.randomInt(specials.length)];
  return 'Lov_' + s;
}

function gerarNome() {
  const nomes = ['Dev', 'Max', 'Alex', 'Sam', 'Jay', 'Kai', 'Rio', 'Lex', 'Zac', 'Eli'];
  const sobrenomes = ['X', 'Z', 'K', 'M', 'R', 'T', 'V', 'W', 'P', 'N'];
  const n = nomes[crypto.randomInt(nomes.length)];
  const s = sobrenomes[crypto.randomInt(sobrenomes.length)];
  const num = crypto.randomInt(10, 99);
  return `${n}${s}_${num}`;
}

function gerarBrowserSessionId() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let id = 'bsess_';
  for (let i = 0; i < 26; i++) id += chars[crypto.randomInt(chars.length)];
  return id;
}

function salvarChave(email, password, uid, apiKey) {
  try {
    let keys = [];
    if (fs.existsSync(ACTIVE_KEYS_FILE)) keys = JSON.parse(fs.readFileSync(ACTIVE_KEYS_FILE, 'utf-8'));
    keys.push({ email, password, uid, apiKey, created: new Date().toISOString() });
    fs.writeFileSync(ACTIVE_KEYS_FILE, JSON.stringify(keys, null, 2), 'utf-8');
  } catch (e) { console.error('[salvar] erro active_keys:', e.message); }

  try {
    fs.appendFileSync(HISTORICO_FILE, `${email}|${apiKey}|${new Date().toISOString()}\n`, 'utf-8');
  } catch {}
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- auth headers for lovable API ---

function authHeaders(idToken, ua) {
  const base = lovable_headers(ua);
  return {
    ...base,
    'Authorization': `Bearer ${idToken}`,
    'x-browser-session-id': gerarBrowserSessionId(),
  };
}

// --- step functions ---

async function step1_criar_email() {
  console.log('\n[1/7] criando email SmailPro...');
  const emailData = await criarEmailReal('outlook');
  console.log(`[1/7] email: ${emailData.email}`);
  return emailData;
}

async function step2_signup(email, password) {
  console.log(`\n[2/7] signup: ${email}...`);
  const result = await create_account_api(email, password, PROXY);
  if (!result.success) throw new Error(`signup falhou: ${result.error}`);
  console.log('[2/7] signup OK');

  // trocar custom_token por idToken via Firebase signInWithCustomToken
  const customToken = result.signup?.body?.custom_token;
  if (!customToken) throw new Error('signup não retornou custom_token');

  console.log('[2/7] trocando custom_token por idToken...');
  const exchange = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
    { token: customToken, returnSecureToken: true },
    { 'Content-Type': 'application/json' }
  );
  if (exchange.status !== 200 || !exchange.body?.idToken) {
    throw new Error(`signInWithCustomToken falhou: ${exchange.status} ${JSON.stringify(exchange.body).slice(0, 200)}`);
  }
  console.log('[2/7] idToken obtido');

  // enviar email de verificação via Firebase
  console.log('[2/7] enviando email de verificação...');
  const sendVerify = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
    { requestType: 'VERIFY_EMAIL', idToken: exchange.body.idToken },
    { 'Content-Type': 'application/json' }
  );
  if (sendVerify.status !== 200) {
    console.log(`[2/7] sendOobCode: ${sendVerify.status} ${JSON.stringify(sendVerify.body).slice(0, 200)}`);
    throw new Error(`sendOobCode falhou: ${sendVerify.status}`);
  }
  console.log('[2/7] email de verificação enviado');

  return { ...result, idToken: exchange.body.idToken };
}

async function step3_verificar_email(emailData) {
  console.log('\n[3/7] aguardando link de verificação no SmailPro...');
  const link = await aguardarLinkLovableSmailPro(emailData, 180000);
  if (!link) throw new Error('timeout aguardando link de verificação');
  console.log(`[3/7] link: ${link.slice(0, 100)}...`);

  // extrair oobCode do link
  const oobMatch = link.match(/oobCode=([^&]+)/);
  if (oobMatch) {
    // verificar via Firebase diretamente
    console.log('[3/7] oobCode encontrado, verificando via Firebase...');
    const verify = await https_post_json(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
      { oobCode: oobMatch[1] },
      { 'Content-Type': 'application/json' }
    );
    console.log(`[3/7] Firebase verify: ${verify.status}`);
    if (verify.status !== 200) {
      throw new Error(`verify email falhou: ${verify.status} ${JSON.stringify(verify.body).slice(0, 200)}`);
    }
    console.log('[3/7] email verificado via Firebase');
    return verify;
  }

  // Array Reverso. 
  var number = Number();
  var arr = [1, 2, 3, 4, 5, 6, 7, 8]

  function luckyNumber() {
   var sort = arr.reverse(); 
  }

  luckyNumber();

  // fallback: seguir o link via GET (o servidor processa a verificação)
  console.log('[3/7] sem oobCode direto, seguindo link via GET...');
  const res = await https_get_json(link, {});
  console.log(`[3/7] GET link: status ${res.status}`);

  // tenta extrair oobCode da resposta/redirect
  const bodyStr = typeof res.body === 'string' ? res.body : JSON.stringify(res.body || '');
  const innerOob = bodyStr.match(/oobCode=([^&"]+)/);
  if (innerOob) {
    console.log('[3/7] oobCode encontrado no redirect, verificando...');
    const verify2 = await https_post_json(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
      { oobCode: innerOob[1] },
      { 'Content-Type': 'application/json' }
    );
    console.log(`[3/7] Firebase verify: ${verify2.status}`);
  }

  console.log('[3/7] email verificado');
  return res;
}

async function step4_login(email, password) {
  console.log(`\n[4/7] login (token fresco com emailVerified=true)...`);
  const result = await login_account_api(email, password, PROXY);
  if (!result.success) throw new Error(`login falhou: ${result.error}`);
  console.log(`[4/7] login OK, uid: ${result.uid}`);
  return result;
}

async function step5_workspace(idToken, ua) {
  console.log('\n[5/7] buscando workspace_id...');
  const headers = authHeaders(idToken, ua);
  const res = await https_get_json(`${LOVABLE_API}/user/workspaces`, headers, PROXY);
  if (res.status !== 200) throw new Error(`GET /user/workspaces falhou: ${res.status}`);

  let workspaceId = null;
  if (Array.isArray(res.body)) {
    workspaceId = res.body[0]?.id || res.body[0]?.workspace_id;
  } else if (res.body?.workspaces) {
    workspaceId = res.body.workspaces[0]?.id || res.body.workspaces[0]?.workspace_id;
  } else if (res.body?.id) {
    workspaceId = res.body.id;
  }

  if (!workspaceId) {
    console.log('[5/7] resposta workspaces:', JSON.stringify(res.body).slice(0, 300));
    throw new Error('workspace_id não encontrado');
  }

  console.log(`[5/7] workspace: ${workspaceId}`);
  return workspaceId;
}

async function step6_remix(idToken, ua, workspaceId) {
  console.log('\n[6/7] remix via API...');
  const headers = authHeaders(idToken, ua);
  const projName = `Remix ${crypto.randomInt(100, 9999)}`;

  // preflight
  console.log('[6/7] preflight...');
  const preflight = await https_post_json(
    `${LOVABLE_API}/projects/${TEMPLATE_PROJECT_ID}/remix/preflight`,
    { workspace_id: workspaceId },
    headers,
    PROXY
  );
  console.log(`[6/7] preflight: ${preflight.status} ${JSON.stringify(preflight.body).slice(0, 100)}`);
  if (preflight.status !== 200) throw new Error(`preflight falhou: ${preflight.status}`);

  // castle token for remix/init
  console.log('[6/7] mintando castle token pro init...');
  const castle = await harvest_castle_token_fast(null);
  console.log(`[6/7] castle token: ${castle.token.length} chars`);

  // init
  console.log('[6/7] remix/init...');
  const init = await https_post_json(
    `${LOVABLE_API}/projects/${TEMPLATE_PROJECT_ID}/remix/init`,
    {
      include_history: false,
      include_files: false,
      include_custom_knowledge: false,
      workspace_id: workspaceId,
      project_name: projName,
      castle_request_token: castle.token,
    },
    headers,
    PROXY
  );
  console.log(`[6/7] init: ${init.status} ${JSON.stringify(init.body).slice(0, 200)}`);
  if (init.status !== 200 || !init.body?.job_id) throw new Error(`remix/init falhou: ${init.status} ${JSON.stringify(init.body).slice(0, 200)}`);

  const jobId = init.body.job_id;
  console.log(`[6/7] job: ${jobId}`);

  // poll progress
  console.log('[6/7] polling progress...');
  const maxWait = 180000;
  const inicio = Date.now();
  while (Date.now() - inicio < maxWait) {
    await sleep(3000);
    const progress = await https_get_json(
      `${LOVABLE_API}/projects/${TEMPLATE_PROJECT_ID}/remix/progress?job_id=${jobId}`,
      headers,
      PROXY
    );
    const body = progress.body;
    if (body?.status === 'completed' && body?.result?.project_id) {
      const newProjectId = body.result.project_id;
      console.log(`[6/7] remix completo! novo projeto: ${newProjectId}`);
      return newProjectId;
    }
    const step = body?.step?.status || body?.status || '?';
    process.stdout.write(`  [${Math.round((Date.now() - inicio) / 1000)}s] ${step}\r`);
  }
  throw new Error('remix timeout (180s)');
}

async function step7_extrair_chave(projectId, idToken, ua, email, password, workspaceId) {
  console.log('\n[7/7] extraindo API key...');

  const { abrirChromeNativo } = require('./castle_bypass');

  // 1. pegar auth-token via API (o JWT pro preview)
  console.log('[7/7] obtendo preview auth-token...');
  const sessionId = crypto.randomUUID();
  let lovableToken;
  for (let i = 0; i < 3; i++) {
    const tokenResp = await https_get_json(
      `${LOVABLE_API}/projects/${projectId}/auth-token`,
      { 'Authorization': `Bearer ${idToken}`, 'x-browser-session-id': sessionId },
      PROXY
    );
    if (tokenResp.status === 200 && tokenResp.body && tokenResp.body.token) {
      lovableToken = tokenResp.body.token;
      break;
    }
    console.log(`[7/7] auth-token retry ${i + 1}: ${tokenResp.status}`);
    await sleep(2000);
  }
  if (!lovableToken) throw new Error('falha ao obter preview auth-token');
  console.log(`[7/7] auth-token OK (${lovableToken.length} chars)`);

  // 2. abrir Chrome direto no preview (bypassa getting-started)
  let browser, chromeProc, pastaTemp;
  try {
    const chrome = await abrirChromeNativo(PROXY);
    browser = chrome.browser;
    chromeProc = chrome.chromeProc;
    pastaTemp = chrome.pastaTemp;

    const page = (await browser.pages())[0] || await browser.newPage();
    const cdp = await page.target().createCDPSession();
    await cdp.send('Network.enable');

    // interceptar sk_ em respostas de serverFn
    let chaveInterceptada = null;
    cdp.on('Network.responseReceived', async (e) => {
      if (chaveInterceptada) return;
      const url = e.response.url;
      if (!url.includes('_serverFn')) return;
      try {
        await sleep(300);
        const resp = await cdp.send('Network.getResponseBody', { requestId: e.requestId });
        const body = resp.body || '';
        const m = body.match(/sk_[a-zA-Z0-9_\-+\/=]{50,}/);
        if (m) {
          chaveInterceptada = m[0];
          console.log(`[7/7] KEY interceptada via serverFn!`);
        }
      } catch {}
    });

    // navegar pro preview com token + refresh loop até preview carregar
    const previewUrl = `https://id-preview--${projectId}.lovable.app/?__lovable_token=${encodeURIComponent(lovableToken)}`;
    console.log(`[7/7] abrindo preview...`);
    await page.goto(previewUrl, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});

    // refresh loop: detectar "No preview deploy" e recarregar até o site aparecer
    for (let r = 0; r < 12; r++) {
      const bodyText = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
      const noPreview = bodyText.includes('No preview deploy') || bodyText.includes('no preview') || bodyText.includes('not found');
      const hasSecrets = bodyText.toLowerCase().includes('secrets') || bodyText.toLowerCase().includes('acessar') || bodyText.toLowerCase().includes('access');
      if (hasSecrets) {
        console.log(`[7/7] preview carregado!`);
        break;
      }
      if (noPreview || r === 0) {
        if (noPreview) console.log(`[7/7] preview não pronto, refresh ${r + 1}/12...`);
        else console.log(`[7/7] aguardando preview (${r + 1}/12)...`);
        await sleep(5000);
        await page.reload({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
      } else {
        await sleep(3000);
      }
    }
    console.log(`[7/7] preview: ${page.url()}`);

    // 3. clicar "Acessar secrets" com retry
    console.log('[7/7] acessando secrets...');
    for (let attempt = 0; attempt < 5; attempt++) {
      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        for (const b of btns) {
          const txt = (b.textContent || '').toLowerCase();
          if (txt.includes('acessar') || txt.includes('secrets') || txt.includes('access')) { b.click(); return true; }
        }
        return false;
      }).catch(() => false);
      if (clicked) break;
      console.log(`[7/7] botão Acessar não encontrado, retry ${attempt + 1}...`);
      // se ainda tiver "No preview deploy", refresh de novo
      const still = await page.evaluate(() => (document.body?.innerText || '').includes('No preview deploy')).catch(() => false);
      if (still) {
        console.log('[7/7] ainda sem preview, refresh...');
        await page.reload({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
      }
      await sleep(5000);
    }
    await sleep(3000);

    // 4. clicar "Revelar" com retry
    console.log('[7/7] revelando key...');
    for (let attempt = 0; attempt < 3; attempt++) {
      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        for (const b of btns) {
          const txt = (b.textContent || '').trim();
          if (txt === 'Revelar' || txt === 'Reveal') { b.click(); return true; }
        }
        return false;
      }).catch(() => false);
      if (clicked) break;
      console.log(`[7/7] botão Revelar não encontrado, retry ${attempt + 1}...`);
      await sleep(5000);
    }
    await sleep(5000);

    // 5. checar se interceptou via CDP
    if (chaveInterceptada) {
      console.log(`[7/7] KEY CAPTURADA (CDP): ${chaveInterceptada.slice(0, 25)}...`);
      await cdp.detach().catch(() => {});
      return chaveInterceptada;
    }

    // 6. fallback: scan DOM
    const skMatch = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      const m = html.match(/sk_[a-zA-Z0-9_\-+\/=]{50,}/);
      return m ? m[0] : null;
    }).catch(() => null);

    if (skMatch) {
      console.log(`[7/7] KEY CAPTURADA (DOM): ${skMatch.slice(0, 25)}...`);
      await cdp.detach().catch(() => {});
      return skMatch;
    }

    // 7. fallback: innerText
    const bodyText = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
    const textMatch = bodyText.match(/sk_[a-zA-Z0-9_\-+\/=]{50,}/);
    if (textMatch) {
      console.log(`[7/7] KEY CAPTURADA (text): ${textMatch[0].slice(0, 25)}...`);
      await cdp.detach().catch(() => {});
      return textMatch[0];
    }

    // 8. retry: esperar mais e tentar de novo
    console.log('[7/7] key não apareceu, retry com wait...');
    for (let sec = 1; sec <= 15; sec++) {
      if (chaveInterceptada) break;
      await sleep(1000);
    }
    if (chaveInterceptada) {
      console.log(`[7/7] KEY CAPTURADA (late CDP): ${chaveInterceptada.slice(0, 25)}...`);
      await cdp.detach().catch(() => {});
      return chaveInterceptada;
    }

    await cdp.detach().catch(() => {});
    throw new Error('não consegui capturar a API key');

  } finally {
    try { if (browser) await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
    try {
      if (pastaTemp) {
        const { execSync } = require('child_process');
        execSync(`rmdir /s /q "${pastaTemp}"`, { timeout: 5000, stdio: 'ignore' });
      }
    } catch {}
  }
}

// --- main cycle ---

async function cicloCompleto() {
  const t0 = Date.now();

  // step 1: email
  const emailData = await step1_criar_email();
  const email = emailData.email;
  const password = gerarSenha();
  console.log(`[senha] ${password}`);

  // step 2: signup (lovable envia verificação automaticamente)
  await step2_signup(email, password);

  // step 3: aguardar + seguir link de verificação
  await step3_verificar_email(emailData);

  // step 4: login (token fresco com emailVerified=true)
  const login = await step4_login(email, password);
  const { uid, idToken } = login;
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36';

  // step 5: get workspace
  const workspaceId = await step5_workspace(idToken, ua);

  // step 6: remix
  const newProjectId = await step6_remix(idToken, ua, workspaceId);

  // step 7: extract key
  const apiKey = await step7_extrair_chave(newProjectId, idToken, ua, email, password, workspaceId);

  // salvar
  salvarChave(email, password, uid, apiKey);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n========================================`);
  console.log(`  CONTA CRIADA + KEY EXTRAIDA (${elapsed}s)`);
  console.log(`  email: ${email}`);
  console.log(`  senha: ${password}`);
  console.log(`  uid: ${uid}`);
  console.log(`  projeto: ${newProjectId}`);
  console.log(`  key: ${apiKey.slice(0, 25)}...`);
  console.log(`========================================\n`);

  return { email, password, uid, projectId: newProjectId, apiKey };
}

function limparSessoesAntigas() {
  const tmpDir = require('os').tmpdir();
  let removidos = 0, totalBytes = 0;
  try {
    const dirs = fs.readdirSync(tmpDir).filter(d => d.startsWith('chrome_lovable_'));
    for (const d of dirs) {
      const full = path.join(tmpDir, d);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          require('child_process').execSync(`rmdir /s /q "${full}"`, { timeout: 10000, stdio: 'ignore' });
          removidos++;
        }
      } catch {}
    }
  } catch {}
  if (removidos > 0) console.log(`[limpeza] ${removidos} perfis temporários removidos`);
}

async function main() {
  limparSessoesAntigas();

  const count = parseInt(process.argv[2] || '1', 10);
  console.log('============================================');
  console.log(' FABRICADOR 100% API — ZERO BROWSER');
  console.log(`============================================`);
  console.log(`lote: ${count} conta(s)`);
  if (PROXY) console.log(`proxy: ${PROXY}`);
  console.log('');

  const resultados = [];
  let contasSinceRotate = 0;

  // check VPN on start
  if (VPN_ENABLED && !PROXY) {
    const vpnStatus = adapterStatus();
    if (vpnStatus === 'Up') {
      const ip = await getPublicIP().catch(() => null);
      console.log(`[vpn] TunnelBear ativo (IP: ${ip}), rotação a cada ${VPN_ROTATE_EVERY} contas`);
    } else {
      console.log(`[vpn] TunnelBear desconectado — rodando sem VPN`);
    }
  }

  if(VPN_ENABLED == true) {
    console.log("Sistema Operacional...");
  }

  function isTunnelError(msg) {
    const s = (msg || '').toLowerCase();
    return s.includes('tunnel') || s.includes('econnreset') || s.includes('proxy connect') ||
           s.includes('err_tunnel') || s.includes('socket hang up') || s.includes('connect failed') ||
           s.includes('504') || s.includes('econnrefused');
  }

  function killAllChrome() {
    try {
      require('child_process').execSync('taskkill /F /IM chrome.exe /T 2>nul', { timeout: 10000, stdio: 'ignore' });
    } catch {}
  }

  for (let i = 1; i <= count; i++) {
    console.log(`\n>>> CICLO ${i}/${count} <<<`);

    for (let tentativa = 1; tentativa <= 5; tentativa++) {
      try {
        const r = await cicloCompleto();
        resultados.push(r);
        contasSinceRotate++;

        // rotaciona VPN a cada N contas pra evitar rate limit
        if (VPN_ENABLED && !PROXY && contasSinceRotate >= VPN_ROTATE_EVERY && i < count) {
          console.log(`\n[vpn] ${contasSinceRotate} contas criadas, rotacionando IP...`);
          const rot = await rotateVPN();
          if (rot.success) {
            contasSinceRotate = 0;
          } else {
            console.log('[vpn] IP não mudou — continuando mesmo assim');
          }
        }

        break;
      } catch (err) {
        const msg = err.message || '';
        const tunnel = isTunnelError(msg);
        console.error(`[ERRO ciclo ${i} tentativa ${tentativa}] ${msg}`);

        const isRateLimit = msg.includes('suspicious activity') || msg.includes('Registration denied');

        if (isRateLimit && VPN_ENABLED && !PROXY) {
          console.log('[RATE LIMIT] IP flaggado, forçando rotação VPN...');
          killAllChrome();
          limparSessoesAntigas();
          const rot = await rotateVPN();
          if (rot.success) {
            contasSinceRotate = 0;
            console.log('[vpn] IP novo, retentando...');
          } else {
            console.log('[vpn] IP não mudou — esperando cooldown...');
            await sleep(30000);
          }
        } else if (tunnel) {
          console.log('[TUNNEL FALHOU] matando Chrome, limpando sessões, aguardando proxy rotacionar...');
          killAllChrome();
          limparSessoesAntigas();
          const wait = 15000 + (tentativa * 5000);
          console.log(`[TUNNEL] aguardando ${Math.round(wait / 1000)}s pra novo IP...`);
          await sleep(wait);
        } else if (tentativa < 5) {
          const delay = crypto.randomInt(10000, 20000);
          console.log(`[retry] aguardando ${Math.round(delay / 1000)}s...`);
          await sleep(delay);
        }
      }
    }

    if (i < count) {
      const delay = crypto.randomInt(15000, 30000);
      console.log(`\n[lote] intervalo: ${Math.round(delay / 1000)}s...`);
      await sleep(delay);
    }
  }

  console.log('\n============================================');
  console.log(` LOTE COMPLETO: ${resultados.length}/${count} keys extraídas`);
  console.log('============================================');
  for (const r of resultados) {
    console.log(`  ${r.email} → ${r.apiKey.slice(0, 25)}...`);
  }
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
