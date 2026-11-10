'use strict';
const { create_account_hybrid } = require('./castle_bypass');
const crypto = require('crypto');

const rand = crypto.randomBytes(4).toString('hex');
const email = `testlov_${rand}@gmail.com`;
const password = 'T3st!Lov_' + crypto.randomBytes(6).toString('base64url');

(async () => {
  console.log('=== HYBRID FLOW TEST ===');
  console.log('email:', email);
  console.log('password:', password);
  console.log();

  const t0 = Date.now();
  const result = await create_account_hybrid(email, password, null, {
    headless: false, // visible for debugging turnstile
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log('\n=== RESULT ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('time:', elapsed + 's');
})().catch(e => {
  console.error('[ERROR]', e.message);
  process.exit(1);
});
