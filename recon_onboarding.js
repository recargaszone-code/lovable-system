'use strict';
const crypto = require('crypto');
const { create_account_api, login_account_api, abrirChromeNativo, lovable_headers, https_post_json } = require('./castle_bypass');
const fs = require('fs');

const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';
const rand = crypto.randomBytes(4).toString('hex');
const EMAIL = `recon_ob_${rand}@gmail.com`;
const PASSWORD = 'T3st!Lov_' + crypto.randomBytes(4).toString('base64url');

(async () => {
  console.log(`email: ${EMAIL}`);
  console.log(`password: ${PASSWORD}\n`);

  // 1. create account
  console.log('--- SIGNUP ---');
  const signup = await create_account_api(EMAIL, PASSWORD, PROXY);
  if (!signup.success) { console.log('signup failed:', signup.error); process.exit(1); }
  console.log('signup OK\n');

  // 2. login
  console.log('--- LOGIN ---');
  const login = await login_account_api(EMAIL, PASSWORD, PROXY);
  if (!login.success) { console.log('login failed:', login.error); process.exit(1); }
  console.log(`login OK, idToken: ${login.idToken.slice(0, 40)}...\n`);

  // 3. open browser with proxy, inject auth cookie, capture onboarding traffic
  const { browser, chromeProc, pastaTemp } = await abrirChromeNativo(PROXY);
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  const hits = [];

  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u.includes('api.lovable.dev') || u.includes('identitytoolkit') || u.includes('securetoken')) {
      hits.push({
        phase: 'request',
        url: u,
        method: req.method(),
        postData: req.postData()?.slice(0, 3000),
        headers: req.headers(),
        ts: Date.now()
      });
    }
    req.continue();
  });
  page.on('response', async res => {
    const u = res.url();
    if (u.includes('api.lovable.dev') || u.includes('identitytoolkit')) {
      let body = '';
      try { body = (await res.text()).slice(0, 3000); } catch {}
      hits.push({ phase: 'response', url: u, status: res.status(), body, ts: Date.now() });
    }
  });

  // navigate to login, do manual login so we get a real session
  console.log('[recon] navegando pra lovable.dev/login...');
  await page.goto('https://lovable.dev/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.waitForSelector('#email', { timeout: 15000 });
  await page.type('#email', EMAIL, { delay: 15 });
  await new Promise(r => setTimeout(r, 300));
  await page.click('button[type="submit"]');

  await page.waitForSelector('#password', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 500));
  await page.type('#password', PASSWORD, { delay: 15 });
  await new Promise(r => setTimeout(r, 300));

  const buttons = await page.$$('button[type="submit"]');
  if (buttons.length > 0) await buttons[buttons.length - 1].click();
  console.log('[recon] login submetido, esperando onboarding...');

  // wait for onboarding page
  await new Promise(r => setTimeout(r, 8000));
  console.log(`[recon] url: ${page.url()}`);

  // take screenshot
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_onboarding_1.png', fullPage: true });
  console.log('[recon] screenshot 1 salvo');

  // try clicking through onboarding
  const clickText = async (texts) => {
    for (const t of texts) {
      const clicked = await page.evaluate((txt) => {
        const els = Array.from(document.querySelectorAll('button, a, div[role="button"], label'));
        const el = els.find(e => (e.innerText || e.textContent || '').toLowerCase().includes(txt.toLowerCase()));
        if (el) { el.click(); return true; }
        return false;
      }, t);
      if (clicked) { console.log(`[recon] clicou: "${t}"`); return true; }
    }
    return false;
  };

  // step 1: next/continue
  await new Promise(r => setTimeout(r, 2000));
  await clickText(['next', 'continue', 'get started']);
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_onboarding_2.png', fullPage: true });

  // step 2: fill name
  const nameInput = await page.$('input[name="name"], input[name="displayName"], input[placeholder*="name"], input[type="text"]');
  if (nameInput) {
    await nameInput.click();
    await nameInput.type('Dev Max', { delay: 20 });
    console.log('[recon] nome digitado');
  }
  await new Promise(r => setTimeout(r, 1000));
  await clickText(['next', 'continue']);
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_onboarding_3.png', fullPage: true });

  // step 3: role (founder)
  await clickText(['founder']);
  await new Promise(r => setTimeout(r, 1000));
  await clickText(['next', 'continue']);
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_onboarding_4.png', fullPage: true });

  // step 4: team size (solo)
  await clickText(['solo', 'just me', '1']);
  await new Promise(r => setTimeout(r, 1000));
  await clickText(['next', 'continue', 'finish', 'done', 'get started']);
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: 'B:\\Lovable - Copy\\recon_onboarding_5.png', fullPage: true });

  // extra: click any remaining
  await clickText(['next', 'continue', 'finish', 'done', 'get started', 'skip']);
  await new Promise(r => setTimeout(r, 5000));

  console.log(`[recon] url final: ${page.url()}`);
  console.log(`[recon] ${hits.length} API hits capturados`);

  // save
  fs.writeFileSync('B:\\Lovable - Copy\\recon_onboarding.json', JSON.stringify({ email: EMAIL, password: PASSWORD, hits, final_url: page.url() }, null, 2));
  console.log('[recon] salvo em recon_onboarding.json');

  await browser.close();
  try { chromeProc.kill(); } catch {}
  setTimeout(() => { try { fs.rmSync(pastaTemp, { recursive: true, force: true }); } catch {} }, 3000);
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
