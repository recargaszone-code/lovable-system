'use strict';
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const port = 9558;
  const tmp = path.join(os.tmpdir(), 'chrome_sk_' + Date.now());
  const p = spawn(CHROME, [
    '--user-data-dir=' + tmp,
    '--remote-debugging-port=' + port,
    '--no-first-run',
    '--no-default-browser-check',
  ], { detached: true, stdio: 'ignore' });
  p.unref();

  await new Promise(r => setTimeout(r, 4000));
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:' + port, defaultViewport: null });
  const page = (await browser.pages())[0];

  // intercept via CDP scriptParsed to find dynamically loaded chunks
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  // capture response body of TurnstileWidget chunk
  const chunks = {};
  client.on('Network.responseReceived', async (e) => {
    const url = e.response.url;
    if (url.includes('Turnstile') || url.includes('turnstile') || url.includes('signup') || url.includes('LoginSignup')) {
      try {
        const body = await client.send('Network.getResponseBody', { requestId: e.requestId });
        chunks[url.split('/').pop().slice(0, 50)] = body.body;
      } catch {}
    }
  });

  await page.goto('https://lovable.dev/signup', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const rand = crypto.randomBytes(4).toString('hex');
  await page.type('#email', `sk2_${rand}@gmail.com`, { delay: 30 });
  await new Promise(r => setTimeout(r, 500));
  await page.click('button[type="submit"]');
  try { await page.waitForSelector('input#password', { timeout: 15000 }); } catch {}
  await new Promise(r => setTimeout(r, 5000));

  // search captured chunks for sitekey
  for (const [name, body] of Object.entries(chunks)) {
    if (!body) continue;
    console.log(`\n=== ${name} (${body.length} chars) ===`);

    // find all string literals that could be a turnstile sitekey
    // Turnstile sitekeys start with 0x and are ~40 chars
    const hexKeys = body.match(/["']0x[0-9a-fA-F]{20,}["']/g);
    if (hexKeys) {
      console.log('HEX KEYS:', hexKeys);
    }

    // find context around siteKey/sitekey assignments
    const regex = /site[Kk]ey/g;
    let m;
    while ((m = regex.exec(body)) !== null) {
      const start = Math.max(0, m.index - 100);
      const end = Math.min(body.length, m.index + 100);
      console.log('CONTEXT:', body.slice(start, end));
    }
  }

  // also try to grab it from runtime
  const runtimeKey = await page.evaluate(() => {
    // check if turnstile object has been called
    if (window.turnstile && window.turnstile._widgets) {
      return JSON.stringify(window.turnstile._widgets);
    }
    // check for global config
    if (window.__TURNSTILE_CONFIG__) return JSON.stringify(window.__TURNSTILE_CONFIG__);

    // brute force: search all object properties on window for sitekey
    for (const key of Object.keys(window)) {
      try {
        const val = window[key];
        if (val && typeof val === 'object' && val.siteKey) return val.siteKey;
        if (val && typeof val === 'object' && val.sitekey) return val.sitekey;
      } catch {}
    }
    return null;
  });
  console.log('\n=== runtime sitekey ===', runtimeKey);

  await browser.close();
  try { p.kill(); } catch {}
  setTimeout(() => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} }, 2000);
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
