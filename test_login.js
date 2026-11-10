'use strict';
const { login_account_api } = require('./castle_bypass');

const EMAIL = 'gillespietracy100190@outlook.com';
const PASSWORD = 'max123ZICO@';
const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';

(async () => {
  console.log('=== LOGIN TEST (API-only) ===');
  console.log(`email: ${EMAIL}`);
  const t0 = Date.now();

  const r = await login_account_api(EMAIL, PASSWORD, PROXY);

  console.log('\n=== RESULT ===');
  console.log('success:', r.success);
  console.log('uid:', r.uid);
  console.log('idToken:', r.idToken?.slice(0, 60) + '...');
  console.log('refreshToken:', r.refreshToken?.slice(0, 40) + '...');
  console.log('castle_event:', r.castle_event?.status);
  console.log('error:', r.error);
  console.log(`time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
