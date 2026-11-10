/**
 * Capturador de Sessão SmailPro (Conta Paga)
 * Abre o Chrome, aguarda você logar e extrai cookies + localStorage automaticamente.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');
const http = require('http');

const OUTPUT_FILE = 'C:\\Users\\ShadezinX\\Desktop\\smailpro_session.json';

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

async function main() {
  console.log('============================================================');
  console.log('       CAPTURADOR DE SESSÃO SMAILPRO (CONTA PAGA)           ');
  console.log('============================================================\n');

  const porta = crypto.randomInt(9222, 9999);
  const pastaPerfil = path.join(os.tmpdir(), `smailpro_capture_${Date.now()}`);

  console.log('[CHROME] Abrindo navegador para você fazer login no SmailPro...');

  const chromeProc = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    [
      `--user-data-dir=${pastaPerfil}`,
      `--remote-debugging-port=${porta}`,
      '--no-first-run',
      '--no-default-browser-check',
      'https://smailpro.com/login'
    ],
    { detached: true, stdio: 'ignore' }
  );
  chromeProc.unref();

  await aguardarPortaDebug(porta);

  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${porta}`,
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  console.log('\n[LOGIN] Navegue e faça login na sua conta paga do SmailPro.');
  console.log('[LOGIN] Aguardando você concluir o login...');

  // Monitora até detectar que o usuário está logado
  let sessionData = null;
  const timeoutMs = 180000; // 3 minutos
  const inicio = Date.now();

  while (Date.now() - inicio < timeoutMs) {
    await new Promise(r => setTimeout(r, 2000));

    try {
      const urlAtual = page.url();

      const dados = await page.evaluate(() => {
        const cookies = document.cookie;
        const local = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          local[k] = localStorage.getItem(k);
        }
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        return { cookies, local, csrf, url: window.location.href };
      });

      // Checa cookies ou tokens de sessão
      const cdpSession = await page.target().createCDPSession();
      const { cookies: cdpCookies } = await cdpSession.send('Network.getAllCookies');

      const temSessao = cdpCookies.some(c => c.name.includes('session') || c.name.includes('remember') || c.name.includes('token')) ||
                        dados.local['X-Session-Token'] ||
                        (dados.url.includes('temporary-email') && !dados.url.includes('login'));

      if (temSessao && !urlAtual.includes('/login')) {
        sessionData = {
          capturedAt: new Date().toISOString(),
          url: dados.url,
          csrfToken: dados.csrf,
          cookiesRaw: dados.cookies,
          allCookies: cdpCookies,
          localStorage: dados.local,
          sessionToken: dados.local['X-Session-Token'] || null
        };
        break;
      }
    } catch (e) {}
  }

  if (sessionData) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sessionData, null, 2), 'utf8');
    console.log('\n' + '='.repeat(60));
    console.log('[SUCESSO] SESSÃO CAPTURADA COM SUCESSO!');
    console.log(`[ARQUIVO] Salvo em: ${OUTPUT_FILE}`);
    console.log(`[COOKIES] ${sessionData.allCookies.length} cookies capturados.`);
    console.log('='.repeat(60));
  } else {
    console.log('\n[AVISO] Tempo limite de 3 minutos esgotado sem detectar login.');
  }

  try { await browser.close(); } catch(e) {}
  try { chromeProc.kill(); } catch(e) {}
  process.exit(0);
}

main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
