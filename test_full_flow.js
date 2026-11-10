'use strict';
const { create_account } = require('./castle_bypass');
const crypto = require('crypto');

const rand = crypto.randomBytes(4).toString('hex');
const email = `testlov_${rand}@gmail.com`;
const password = 'T3st!Lov_' + crypto.randomBytes(6).toString('base64url');

// proxy-seller format: host;port;user;pass
const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';

(async () => {
  console.log('=== FULL FLOW TEST (Chrome real + proxy) ===');
  console.log('email:', email);
  console.log('password:', password);
  console.log('proxy:', PROXY.replace(/:[^:@]+@/, ':***@'));
  console.log();

  const t0 = Date.now();
  const result = await create_account(email, password, PROXY);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log('\n=== RESULT ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('time:', elapsed + 's');
})().catch(e => {
  console.error('[ERROR]', e.message);
  process.exit(1);
});
