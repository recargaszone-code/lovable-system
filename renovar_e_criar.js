// Node. Tenta renovar o id_token da conta via refresh_token (campo 3) e, se falhar, usa o
// campo 2 cru (caso já seja um id_token ainda válido). Depois reaproveita o Chrome real +
// IndexedDB injection pra logar e criar o projeto. Nunca imprime o token completo no console.
const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer-core');
const crypto = require('crypto');
const os = require('os');
const { spawn } = require('child_process');
const http = require('http');

const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';
const TOKENS_TXT = path.join(__dirname, 'tokens_capturados.txt');
const LOG_PATH = path.join(__dirname, `trafego_criar_projeto_${Date.now()}.jsonl`);

function decodeJwtField(token, field) {
  const payloadB64 = token.split('.')[1];
  return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'))[field];
}

function renovarViaRefresh(refreshToken) {
  return new Promise(resolve => {
    const postData = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(refreshToken);
    const req = https.request(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) } },
      res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json.id_token) resolve({ ok: true, idToken: json.id_token, expiresIn: json.expires_in });
            else resolve({ ok: false, error: json.error?.message || 'sem id_token na resposta' });
          } catch (e) { resolve({ ok: false, error: 'parse: ' + e.message }); }
        });
      }
    );
    req.on('error', e => resolve({ ok: false, error: e.message }));
    req.write(postData);
    req.end();
  });
}

function aguardarPortaDebug(porta, timeoutMs = 45000) {
  const inicio = Date.now();
  return new Promise((resolve, reject) => {
    const tentar = () => {
      const r = http.get(`http://127.0.0.1:${porta}/json/version`, res => { res.resume(); if (res.statusCode === 200) return resolve(true); retry(); });
      r.on('error', retry);
      r.setTimeout(1000, () => { r.destroy(); retry(); });
    };
    const retry = () => { if (Date.now() - inicio > timeoutMs) return reject(new Error('timeout porta debug')); setTimeout(tentar, 500); };
    tentar();
  });
}

async function abrirChromeNormal() {
  const porta = crypto.randomInt(9222, 9999);
  const pastaTempChrome = path.join(os.tmpdir(), `chrome_temp_${Date.now()}_${crypto.randomInt(100000, 999999)}`);
  const chromeArgs = [`--user-data-dir=${pastaTempChrome}`, `--remote-debugging-port=${porta}`, '--no-first-run', '--no-default-browser-check', '--no-sandbox', '--disable-extensions', '--disable-default-apps', '--start-maximized'];
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', chromeArgs, { detached: true, stdio: 'ignore' });
  chromeProc.unref();
  await aguardarPortaDebug(porta);
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${porta}`, defaultViewport: null });
  return { browser };
}

async function main() {
  const linhaIdx = parseInt(process.argv[2] ?? '0', 10);
  const prompt = process.argv[3] || 'landing page simples';

  const linhas = fs.readFileSync(TOKENS_TXT, 'utf-8').split(/\r?\n/).filter(Boolean);
  const [email, campo2, campo3] = linhas[linhaIdx].split('|');
  console.log(`[+] conta alvo: ${email}`);

  let idTokenFinal = null;

  console.log('[+] tentando renovar via campo 3 como refresh_token...');
  let r = await renovarViaRefresh(campo3);
  if (r.ok) {
    console.log(`[+] renovado com sucesso (expira em ${r.expiresIn}s)`);
    idTokenFinal = r.idToken;
  } else {
    console.log(`[!] falhou: ${r.error}`);
    console.log('[+] tentando renovar via campo 2 como refresh_token...');
    r = await renovarViaRefresh(campo2);
    if (r.ok) {
      console.log(`[+] renovado com sucesso (expira em ${r.expiresIn}s)`);
      idTokenFinal = r.idToken;
    } else {
      console.log(`[!] falhou tambem: ${r.error}`);
    }
  }

  if (!idTokenFinal) {
    // ultimo recurso: usa o campo que ainda nao tiver expirado como id_token direto
    for (const cand of [campo3, campo2]) {
      try {
        const exp = decodeJwtField(cand, 'exp');
        if (exp * 1000 > Date.now()) { idTokenFinal = cand; console.log('[+] usando id_token ainda valido encontrado no arquivo'); break; }
      } catch (e) {}
    }
  }

  if (!idTokenFinal) {
    console.log('[x] nenhum token utilizavel (refresh falhou e ambos os id_tokens salvos estao expirados).');
    console.log('    preciso rodar gerar_tokens_jwt.js com um refresh_token/senha valido, ou recapturar sessao no navegador.');
    return;
  }

  const uid = decodeJwtField(idTokenFinal, 'user_id') || decodeJwtField(idTokenFinal, 'sub');
  const exp = decodeJwtField(idTokenFinal, 'exp');

  const { browser } = await abrirChromeNormal();
  const page = (await browser.pages())[0] || await browser.newPage();
  const logStream = fs.createWriteStream(LOG_PATH, { flags: 'a' });
  page.on('request', req => {
    const url = req.url();
    if (/googleapis\.com|lovable|gptengineer/i.test(url)) logStream.write(JSON.stringify({ dir: 'req', ts: Date.now(), method: req.method(), url, headers: req.headers() }) + '\n');
  });
  page.on('response', async res => {
    const url = res.url();
    if (/googleapis\.com|lovable|gptengineer/i.test(url)) {
      let body = null; try { body = (await res.text()).slice(0, 5000); } catch (e) {}
      logStream.write(JSON.stringify({ dir: 'res', ts: Date.now(), status: res.status(), url, body }) + '\n');
    }
  });

  console.log('[+] abrindo lovable.dev (deslogado) so pra ter o DOM/IndexedDB prontos...');
  await page.goto('https://lovable.dev/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r2 => setTimeout(r2, 2000));

  const nowMs = Date.now();
  const authValue = {
    uid, email, emailVerified: true, isAnonymous: false,
    providerData: [{ uid: email, email, providerId: 'password' }],
    stsTokenManager: { accessToken: idTokenFinal, refreshToken: campo3 || campo2, expirationTime: exp ? exp * 1000 : nowMs + 3600000 },
    createdAt: String(nowMs), lastLoginAt: String(nowMs), apiKey: FIREBASE_API_KEY, appName: '[DEFAULT]',
  };
  const fbaseKey = `firebase:authUser:${FIREBASE_API_KEY}:[DEFAULT]`;

  console.log('[+] gravando sessao no IndexedDB...');
  await page.evaluate(async ({ fbaseKey, authValue }) => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.open('firebaseLocalStorageDb');
      req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains('firebaseLocalStorage')) db.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' }); };
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

  console.log('[+] sessao gravada, recarregando autenticado...');
  await page.goto('https://lovable.dev/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r2 => setTimeout(r2, 4000));
  console.log(`[+] url atual: ${page.url()}`);

  let campo = await page.$('textarea');
  if (!campo) campo = await page.$('[contenteditable="true"]');
  if (!campo) {
    console.log('[x] nao achei campo de prompt - sessao pode nao ter sido aceita.');
    console.log(`    log em: ${LOG_PATH}`);
    return;
  }

  await campo.click();
  await page.keyboard.type(prompt, { delay: crypto.randomInt(30, 70) });
  await new Promise(r2 => setTimeout(r2, 500));
  await page.keyboard.press('Enter');
  console.log(`[+] prompt enviado: "${prompt}"`);
  await new Promise(r2 => setTimeout(r2, 10000));
  console.log(`[+] url apos envio: ${page.url()}`);
  console.log(`[+] log de trafego: ${LOG_PATH}`);
  console.log('[+] Chrome fica aberto pra conferencia.');
}

main().catch(e => { console.error('[ERRO]', e.message); process.exitCode = 1; });
