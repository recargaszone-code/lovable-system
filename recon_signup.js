'use strict';

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const crypto = require('crypto');

function find_chrome_path() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  ];
  const found = candidates.find(p => p && fs.existsSync(p));
  if (!found) throw new Error('No local Chrome found.');
  return found;
}

const rand = crypto.randomBytes(4).toString('hex');
const TEST_EMAIL = `recon_${rand}@gmail.com`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: find_chrome_path(),
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  const hits = [];
  const bodies = {};

  client.on('Network.requestWillBeSent', (e) => {
    const url = e.request.url;
    if (url.includes('identitytoolkit') || url.includes('castle') || url.includes('lovable.dev/auth') ||
        url.includes('securetoken') || url.includes('recaptcha') || url.includes('firebase')) {
      hits.push({
        phase: 'request',
        url,
        method: e.request.method,
        headers: e.request.headers,
        postData: e.request.postData,
        requestId: e.requestId,
        ts: Date.now(),
      });
      console.log(`[REQ] ${e.request.method} ${url.substring(0, 120)}`);
      if (e.request.postData) {
        try {
          const parsed = JSON.parse(e.request.postData);
          console.log('  body:', JSON.stringify(parsed).substring(0, 300));
        } catch {
          console.log('  body:', e.request.postData.substring(0, 200));
        }
      }
    }
  });

  client.on('Network.responseReceived', async (e) => {
    const url = e.response.url;
    if (url.includes('identitytoolkit') || url.includes('castle') || url.includes('lovable.dev/auth') ||
        url.includes('securetoken') || url.includes('recaptcha') || url.includes('firebase')) {
      hits.push({
        phase: 'response',
        url,
        status: e.response.status,
        headers: e.response.headers,
        requestId: e.requestId,
        ts: Date.now(),
      });
      console.log(`[RES] ${e.response.status} ${url.substring(0, 120)}`);

      try {
        const body = await client.send('Network.getResponseBody', { requestId: e.requestId });
        bodies[e.requestId] = body.body ? body.body.substring(0, 2000) : null;
        if (body.body) console.log('  body:', body.body.substring(0, 300));
      } catch {}
    }
  });

  console.log(`[*] email de teste: ${TEST_EMAIL}`);
  console.log('[*] navegando pra /signup...');
  await page.goto('https://lovable.dev/signup', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  // preenche email
  console.log('[*] preenchendo email...');
  await page.type('#email', TEST_EMAIL, { delay: 50 });
  await new Promise(r => setTimeout(r, 500));

  // clica submit
  console.log('[*] submetendo...');
  await page.click('[data-testid="auth-submit-button"]');

  // espera a resposta
  console.log('[*] esperando resposta...');
  await new Promise(r => setTimeout(r, 8000));

  // check se apareceu campo de senha ou outra coisa
  const page_state = await page.evaluate(() => {
    const password = document.querySelector('input[type="password"]');
    const otp = document.querySelector('input[type="text"][inputmode="numeric"]');
    const error = document.querySelector('[role="alert"]');
    const body_text = document.body.innerText.substring(0, 1000);
    return {
      has_password_field: !!password,
      has_otp_field: !!otp,
      error_text: error ? error.textContent : null,
      url: window.location.href,
      body_snippet: body_text,
    };
  });
  console.log('\n[page state]', JSON.stringify(page_state, null, 2));

  // se tem campo de senha, preenche e submete
  if (page_state.has_password_field) {
    console.log('[*] campo de senha encontrado, preenchendo...');
    await page.type('input[type="password"]', 'T3stR3con!456', { delay: 50 });
    await new Promise(r => setTimeout(r, 500));

    // limpa hits antigos pra capturar só o signup
    const before_count = hits.length;

    await page.click('[data-testid="auth-submit-button"]');
    console.log('[*] submetido, esperando...');
    await new Promise(r => setTimeout(r, 10000));

    const page_state2 = await page.evaluate(() => ({
      url: window.location.href,
      body_snippet: document.body.innerText.substring(0, 500),
    }));
    console.log('[page state 2]', JSON.stringify(page_state2, null, 2));
  }

  // salva tudo
  const output = { email: TEST_EMAIL, hits, bodies, page_state };
  fs.writeFileSync('B:\\Lovable - Copy\\recon_network.json', JSON.stringify(output, null, 2));
  console.log(`\n[*] ${hits.length} requests capturados → recon_network.json`);

  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
