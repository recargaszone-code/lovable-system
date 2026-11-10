'use strict';

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const path = require('path');

function find_chrome() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const p of paths) {
    try { if (fs.existsSync(p)) return p; } catch {}
  }
  throw new Error('chrome not found');
}

const CASTLE_PK = 'pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M';
const SDK_PATH = path.join(__dirname, 'node_modules', '@castleio', 'castle-js', 'dist', 'castle.browser.js');

(async () => {
  console.log('=== CASTLE TOKEN MINT ===\n');

  const sdk_code = fs.readFileSync(SDK_PATH, 'utf8');
  console.log('[+] castle SDK loaded (' + (sdk_code.length / 1024).toFixed(0) + 'KB)');

  const cuid = crypto.randomUUID();

  const html = `<!DOCTYPE html><html><head></head><body>
  <script>${sdk_code}<\/script>
  <script>
    document.cookie = "__cuid=${cuid}; path=/; max-age=34560000; SameSite=Lax";
    window.__r = { status: 'init' };

    try {
      // Castle v2 npm SDK exposes window.Castle object
      Castle.configure({ pk: "${CASTLE_PK}" });
      window.__r.status = 'configured';

      // createRequestToken returns a Thenable in v2
      var result = Castle.createRequestToken();
      if (result && typeof result.then === 'function') {
        result.then(function(token) {
          window.__r.token = token;
          window.__r.status = 'done';
        }).catch(function(e) {
          window.__r.error = e.message;
          window.__r.status = 'error';
        });
      } else if (typeof result === 'string') {
        window.__r.token = result;
        window.__r.status = 'done';
      }

      // also try callback style
      try {
        Castle.createRequestToken(function(token) {
          if (token && !window.__r.token) {
            window.__r.token = token;
            window.__r.status = 'done';
          }
        });
      } catch(e2) {}

    } catch(e) {
      window.__r.error = e.message;
      window.__r.status = 'error';
    }

    setTimeout(function() {
      if (window.__r.status !== 'done' && window.__r.status !== 'error') {
        window.__r.status = 'timeout';
      }
    }, 10000);
  </script>
  </body></html>`;

  const port = 19900 + Math.floor(Math.random() * 100);
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
  await new Promise(r => server.listen(port, '127.0.0.1', r));

  const browser = await puppeteer.launch({
    executablePath: find_chrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  // block castle telemetry but allow the token to be generated
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('.castle.io') || url.includes('cstl.io')) {
      console.log('[blocked-telemetry]', url.substring(0, 80));
      req.respond({ status: 200, contentType: 'application/json', body: '{}' });
    } else {
      req.continue();
    }
  });

  page.on('pageerror', e => console.log('[page-err]', e.message.substring(0, 200)));

  console.log('[*] loading page on port', port);
  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle2', timeout: 15000 });

  // poll for result
  let result;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 500));
    result = await page.evaluate(() => window.__r);
    process.stdout.write(result.status[0]);
    if (result.status === 'done' || result.status === 'error' || result.status === 'timeout') break;
  }
  console.log();

  await browser.close();
  server.close();

  console.log('\n[result]', JSON.stringify(result, null, 2));

  if (result.token) {
    console.log('\n=== TOKEN MINTED ===');
    console.log('length:', result.token.length);
    console.log('cuid:', cuid);
    console.log('preview:', result.token.substring(0, 100) + '...');
  } else {
    console.log('\n=== FAILED ===');
  }
})().catch(e => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});
