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

  const castle_events = [];

  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u.includes('castle-event')) {
      const pd = req.postData();
      console.log(`[REQ] castle-event POST body: ${pd}`);
      castle_events.push({ phase: 'request', url: u, method: req.method(), postData: pd, ts: Date.now() });
    }
    req.continue();
  });
  page.on('response', async res => {
    const u = res.url();
    if (u.includes('castle-event')) {
      let body = '';
      try { body = await res.text(); } catch {}
      console.log(`[RES] castle-event ${res.status()} body: ${body}`);
      castle_events.push({ phase: 'response', url: u, status: res.status(), body, ts: Date.now() });
    }
  });

  console.log('[recon] navegando pra lovable.dev/login...');
  await page.goto('https://lovable.dev/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.waitForSelector('#email', { timeout: 15000 });
  await page.type('#email', EMAIL, { delay: 20 });
  await new Promise(r => setTimeout(r, 500));
  await page.click('button[type="submit"]');
  console.log('[recon] clicou Continue');

  await page.waitForSelector('#password', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.type('#password', PASSWORD, { delay: 20 });
  await new Promise(r => setTimeout(r, 500));

  const buttons = await page.$$('button[type="submit"]');
  if (buttons.length > 0) await buttons[buttons.length - 1].click();
  console.log('[recon] clicou Sign In');

  await new Promise(r => setTimeout(r, 15000));

  fs.writeFileSync('B:\\Lovable - Copy\\recon_castle_events.json', JSON.stringify(castle_events, null, 2));
  console.log(`[recon] ${castle_events.length} castle-event hits`);

  await browser.close();
  try { chromeProc.kill(); } catch {}
  setTimeout(() => { try { fs.rmSync(pastaTemp, { recursive: true, force: true }); } catch {} }, 3000);
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
