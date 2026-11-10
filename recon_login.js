'use strict';
const { abrirChromeNativo } = require('./castle_bypass');
const fs = require('fs');

const EMAIL = 'gillespietracy100190@outlook.com';
const PASSWORD = 'max123ZICO@';
const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';

(async () => {
  const { browser, chromeProc, pastaTemp } = await abrirChromeNativo(PROXY);
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  const hits = [];
  const bodies = {};

  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u.includes('api.lovable.dev') || u.includes('identitytoolkit') || u.includes('securetoken')) {
      hits.push({ phase: 'request', url: u, method: req.method(), postData: req.postData()?.slice(0, 2000), ts: Date.now() });
    }
    req.continue();
  });
  page.on('response', async res => {
    const u = res.url();
    if (u.includes('api.lovable.dev') || u.includes('identitytoolkit') || u.includes('securetoken')) {
      const id = hits.length.toString();
      hits.push({ phase: 'response', url: u, status: res.status(), ts: Date.now(), id });
      try { bodies[id] = await res.text(); } catch {}
    }
  });

  console.log('[recon] navegando pra lovable.dev/login...');
  await page.goto('https://lovable.dev/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // type email
  await page.waitForSelector('#email', { timeout: 15000 });
  await page.type('#email', EMAIL, { delay: 20 });
  console.log('[recon] email digitado');
  await new Promise(r => setTimeout(r, 500));
  await page.click('button[type="submit"]');
  console.log('[recon] clicou Continue');

  // wait for password field
  await page.waitForSelector('#password', { timeout: 15000 });
  console.log('[recon] form de senha apareceu');
  await new Promise(r => setTimeout(r, 1000));
  await page.type('#password', PASSWORD, { delay: 20 });
  console.log('[recon] senha digitada');
  await new Promise(r => setTimeout(r, 500));

  // click login
  const buttons = await page.$$('button[type="submit"]');
  if (buttons.length > 0) {
    await buttons[buttons.length - 1].click();
    console.log('[recon] clicou login');
  }

  // wait for redirects and API calls
  console.log('[recon] aguardando 15s pra capturar todo tráfego...');
  await new Promise(r => setTimeout(r, 15000));

  const result = { email: EMAIL, hits, bodies, final_url: page.url() };
  fs.writeFileSync('B:\\Lovable - Copy\\recon_login.json', JSON.stringify(result, null, 2));
  console.log(`[recon] ${hits.length} hits capturados → recon_login.json`);
  console.log('[recon] url final:', page.url());

  await browser.close();
  try { chromeProc.kill(); } catch {}
  setTimeout(() => { try { fs.rmSync(pastaTemp, { recursive: true, force: true }); } catch {} }, 3000);
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
