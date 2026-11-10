const puppeteer = require('puppeteer-core');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const sessionToken = 'c2663f9668c4ee92aaa2d104f3c89c6d9066d8d6ca6f22a41d06df87709b3f6c';

function aguardarPortaDebug(porta, timeoutMs = 20000) {
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

async function run() {
  const porta = 9444;
  const pasta = path.join(os.tmpdir(), 'chrome_smailpro_test_' + Date.now());
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--user-data-dir=${pasta}`,
    `--remote-debugging-port=${porta}`,
    '--no-first-run',
    '--no-default-browser-check'
  ], { detached: true, stdio: 'ignore' });
  chromeProc.unref();

  await aguardarPortaDebug(porta);
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${porta}` });
  const page = (await browser.pages())[0] || await browser.newPage();

  console.log('[1] Acessando smailpro.com/temporary-email...');
  await page.goto('https://smailpro.com/temporary-email', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('[2] Injetando sessionToken no localStorage...');
  await page.evaluate((tok) => {
    localStorage.setItem('sessionToken', tok);
    localStorage.setItem('X-Session-Token', tok);
    localStorage.setItem('query', JSON.stringify({
      username: 'random',
      type: 'real',
      domain: 'outlook.com',
      server: '1'
    }));
  }, sessionToken);

  console.log('[3] Recarregando a pagina...');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));

  // Aguarda resolver qualquer captcha/turnstile que apareça
  console.log('[4] Verificando estado do Alpine...');
  const res = await page.evaluate(async () => {
    try {
      const el = document.querySelector('[x-data*="create"]');
      if (!el || !el._x_dataStack) return { error: 'Alpine nao carregado' };
      const comp = el._x_dataStack[0];

      // Dispara a geracao
      comp.selectEmailType('microsoft');
      comp.query.type = 'real';
      comp.query.domain = 'outlook.com';
      await comp.generate();

      // Aguarda 3 segundos
      await new Promise(r => setTimeout(r, 3000));
      const all = await comp.emailManager.getAllEmails();
      return { success: true, allEmails: all };
    } catch (e) {
      return { error: e.message };
    }
  });

  console.log('[5] Resposta do teste:', JSON.stringify(res, null, 2));

  await browser.close();
  try { chromeProc.kill(); } catch (e) {}
}

run().catch(err => console.error('FALHA:', err.message));
