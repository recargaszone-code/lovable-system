'use strict';
const { create_account_api } = require('./castle_bypass');
const crypto = require('crypto');

const rand = crypto.randomBytes(4).toString('hex');
const email = `apitest_${rand}@gmail.com`;
const password = 'T3st!Lov_' + crypto.randomBytes(6).toString('base64url');

const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';

(async () => {
  console.log('=== API-ONLY FLOW TEST ===');
  console.log('email:', email);
  console.log('password:', password);
  console.log('proxy:', PROXY.replace(/:[^:@]+@/, ':***@'));
  console.log();

  const t0 = Date.now();
  const result = await create_account_api(email, password, PROXY);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log('\n=== RESULT ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('time:', elapsed + 's');
})().catch(e => {
  console.error('[ERROR]', e.message);
  process.exit(1);
});
