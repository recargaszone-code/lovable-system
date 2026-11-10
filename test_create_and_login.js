'use strict';
const crypto = require('crypto');
const { create_and_login } = require('./castle_bypass');

const rand = crypto.randomBytes(4).toString('hex');
const EMAIL = `testcl_${rand}@gmail.com`;
const PASSWORD = 'T3st!Lov_' + crypto.randomBytes(4).toString('base64url');
const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';

(async () => {
  console.log(`email: ${EMAIL}`);
  console.log(`password: ${PASSWORD}`);

  const r = await create_and_login(EMAIL, PASSWORD, PROXY);

  console.log('\n=== FINAL RESULT ===');
  console.log('success:', r.success);
  console.log('phase:', r.phase);
  console.log('uid:', r.uid);
  console.log('idToken:', r.idToken ? r.idToken.slice(0, 60) + '...' : null);
  console.log('refreshToken:', r.refreshToken ? r.refreshToken.slice(0, 40) + '...' : null);
  console.log('error:', r.error);
  console.log('total time:', r.time + 's');
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
