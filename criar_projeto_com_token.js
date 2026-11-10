// Node, puppeteer-core + Chrome real instalado (reaproveita o mesmo launcher CDP de assistente_lovable.js).
// Loga numa conta já existente usando o token salvo em tokens_capturados.txt (sem passar pelo
// signup/login form) e cria um projeto novo com um prompt.
//
// Achado importante lendo assistente_lovable.js: o Lovable persiste a sessão do Firebase Auth
// em IndexedDB (banco "firebaseLocalStorageDb"), não em localStorage como em outros apps Firebase.
// Por isso a injeção de sessão tem que escrever direto nesse IndexedDB, não no localStorage.
//
// uso: node criar_projeto_com_token.js <linha_do_token> "<prompt>"
//   ex: node criar_projeto_com_token.js 0 "landing page para uma cafeteria"

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const { spawn } = require('child_process');
const http = require('http');

const TOKENS_TXT = path.join(__dirname, 'tokens_capturados.txt');
const LOG_PATH = path.join(__dirname, `trafego_criar_projeto_${Date.now()}.jsonl`);

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
      if (Date.now() - inicio > timeoutMs) return reject(new Error('Timeout aguardando porta de debug do Chrome'));
      setTimeout(tentar, 500);
    };
    tentar();
  });
}

async function abrirChromeNormal() {
  const porta = crypto.randomInt(9222, 9999);
  const pastaTempChrome = path.join(os.tmpdir(), `chrome_temp_${Date.now()}_${crypto.randomInt(100000, 999999)}`);

  const chromeArgs = [
    `--user-data-dir=${pastaTempChrome}`,
    `--remote-debugging-port=${porta}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--no-sandbox',
    '--disable-extensions',
    '--disable-default-apps',
    '--start-maximized',
  ];

  console.log(`[CHROME] Abrindo Chrome normal (perfil: ${pastaTempChrome}, porta debug: ${porta})...`);
  const chromeProc = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    chromeArgs,
    { detached: true, stdio: 'ignore' }
  );
  chromeProc.unref();

  await aguardarPortaDebug(porta);
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${porta}`, defaultViewport: null });
  return { browser, pastaTempChrome, chromeProc };
}

function decodeJwtField(token, field) {
  const payloadB64 = token.split('.')[1];
  const json = Buffer.from(payloadB64, 'base64url').toString('utf-8');
  return JSON.parse(json)[field];
}

function carregarLinhaToken(idx) {
  const linhas = fs.readFileSync(TOKENS_TXT, 'utf-8').split(/\r?\n/).filter(Boolean);
  const [email, tokenA, tokenB] = linhas[idx].split('|');
  return { email, tokenA, tokenB };
}

function melhorTokenValido(tokenA, tokenB) {
  // ambos os campos no arquivo atual são JWTs (id_tokens capturados em momentos diferentes);
  // usamos o que tiver "exp" mais distante no futuro / mais recente
  const candidatos = [tokenA, tokenB].filter(Boolean).map(t => {
    try {
      return { token: t, exp: decodeJwtField(t, 'exp') || 0 };
    } catch (e) {
      return { token: t, exp: 0 };
    }
  });
  candidatos.sort((a, b) => b.exp - a.exp);
  return candidatos[0];
}

async function main() {
  const linhaIdx = parseInt(process.argv[2] ?? '0', 10);
  const prompt = process.argv[3] || 'landing page simples';

  const { email, tokenA, tokenB } = carregarLinhaToken(linhaIdx);
  const melhor = melhorTokenValido(tokenA, tokenB);
  const idToken = melhor.token;
  const uid = decodeJwtField(idToken, 'user_id') || decodeJwtField(idToken, 'sub');
  const expSeconds = melhor.exp;
  const expirado = expSeconds > 0 && expSeconds * 1000 < Date.now();

  console.log(`[+] conta alvo: ${email} (uid=${uid})`);
  console.log(`[+] token escolhido expira em: ${new Date(expSeconds * 1000).toISOString()} ${expirado ? '(JA EXPIRADO - pode falhar)' : '(ainda valido)'}`);

  const { browser, chromeProc } = await abrirChromeNormal();
  const page = (await browser.pages())[0] || await browser.newPage();

  const logStream = fs.createWriteStream(LOG_PATH, { flags: 'a' });
  let apiKeyCapturada = null;

  page.on('request', req => {
    const url = req.url();
    if (/googleapis\.com|lovable|gptengineer/i.test(url)) {
      logStream.write(JSON.stringify({ dir: 'req', ts: Date.now(), method: req.method(), url, headers: req.headers(), postData: req.postData() }) + '\n');
      const headers = req.headers();
      if (/identitytoolkit\.googleapis\.com|firebaseinstallations\.googleapis\.com/.test(url)) {
        const keyFromHeader = headers['x-goog-api-key'];
        const keyFromQuery = (url.split('key=')[1] || '').split('&')[0];
        apiKeyCapturada = apiKeyCapturada || keyFromHeader || keyFromQuery || null;
      }
    }
  });
  page.on('response', async res => {
    const url = res.url();
    if (/googleapis\.com|lovable|gptengineer/i.test(url)) {
      let body = null;
      try { body = (await res.text()).slice(0, 5000); } catch (e) {}
      logStream.write(JSON.stringify({ dir: 'res', ts: Date.now(), status: res.status(), url, body }) + '\n');
    }
  });

  console.log('[+] abrindo lovable.dev para farejar a firebase api key...');
  await page.goto('https://lovable.dev/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  if (!apiKeyCapturada) {
    console.log('[!] nenhuma request com api key vista ainda, navegando pra /login pra forcar o SDK a inicializar...');
    await page.goto('https://lovable.dev/login', { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));
  }

  if (!apiKeyCapturada) {
    console.log('[x] nao consegui farejar a api key automaticamente.');
    console.log(`    abre o devtools nessa janela do Chrome, filtra Network por "googleapis", e me passa o header x-goog-api-key ou o ?key= de qualquer request.`);
    console.log(`    log parcial salvo em: ${LOG_PATH}`);
    return;
  }
  console.log(`[+] api key capturada: ${apiKeyCapturada}`);

  const nowMs = Date.now();
  const authValue = {
    uid,
    email,
    emailVerified: true,
    isAnonymous: false,
    providerData: [{ uid: email, email, providerId: 'password' }],
    stsTokenManager: {
      accessToken: idToken,
      refreshToken: idToken, // sem refresh_token real disponivel neste arquivo; serve so pra passar a checagem inicial do SDK
      expirationTime: expSeconds ? expSeconds * 1000 : nowMs + 60 * 60 * 1000,
    },
    createdAt: String(nowMs),
    lastLoginAt: String(nowMs),
    apiKey: apiKeyCapturada,
    appName: '[DEFAULT]',
  };

  const fbaseKey = `firebase:authUser:${apiKeyCapturada}:[DEFAULT]`;

  console.log('[+] gravando sessao no IndexedDB (firebaseLocalStorageDb)...');
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

  console.log('[+] sessao gravada, recarregando autenticado...');
  await page.goto('https://lovable.dev/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  console.log(`[+] url atual: ${page.url()}`);

  console.log('[+] procurando campo de prompt...');
  let campo = await page.$('textarea');
  if (!campo) campo = await page.$('[contenteditable="true"]');
  if (!campo) {
    console.log('[x] nao achei textarea/contenteditable. a sessao pode nao ter pegado (ainda na tela de login?).');
    console.log(`    log salvo em: ${LOG_PATH}`);
    return;
  }

  await campo.click();
  await page.keyboard.type(prompt, { delay: crypto.randomInt(30, 70) });
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.press('Enter');

  console.log(`[+] prompt enviado: "${prompt}"`);
  await new Promise(r => setTimeout(r, 10000));
  console.log(`[+] url apos envio (projeto criado?): ${page.url()}`);
  console.log(`[+] log de trafego completo em: ${LOG_PATH}`);
  console.log('[+] deixando o Chrome aberto pra voce conferir. feche a janela manualmente quando terminar.');
}

main().catch(e => {
  console.error('[ERRO]', e);
  process.exitCode = 1;
});
