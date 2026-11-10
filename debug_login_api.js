'use strict';
const { harvest_castle_token_fast, lovable_headers, https_post_json } = require('./castle_bypass');

const EMAIL = 'gillespietracy100190@outlook.com';
const PASSWORD = 'max123ZICO@';
const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';
const LOVABLE_API_BASE = 'https://api.lovable.dev';
const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';

(async () => {
  console.log('=== DEBUG LOGIN API ===\n');

  // 1. castle token
  console.log('[1] mintando castle token...');
  const castle = await harvest_castle_token_fast(null);
  console.log(`token: ${castle.token.length} chars`);
  console.log(`token prefix: ${castle.token.slice(0, 30)}`);

  const headers = lovable_headers(castle.user_agent);
  console.log('\nheaders:', JSON.stringify(headers, null, 2));

  // 2. check-auth-provider
  console.log('\n[2] check-auth-provider...');
  const check = await https_post_json(
    `${LOVABLE_API_BASE}/auth/check-auth-provider`,
    { email: EMAIL, castle_request_token: castle.token },
    headers,
    PROXY
  );
  console.log(`status: ${check.status}`);
  console.log('body:', JSON.stringify(check.body));

  // 3. castle-event — log FULL response
  console.log('\n[3] castle-event (same token)...');
  const evt1 = await https_post_json(
    `${LOVABLE_API_BASE}/auth/castle-event`,
    { request_token: castle.token },
    headers,
    PROXY
  );
  console.log(`status: ${evt1.status}`);
  console.log('body:', JSON.stringify(evt1.body));
  console.log('raw body type:', typeof evt1.body);

  // 3b. castle-event with event_type field
  console.log('\n[3b] castle-event with event field...');
  const castle2 = await harvest_castle_token_fast(null);
  const evt2 = await https_post_json(
    `${LOVABLE_API_BASE}/auth/castle-event`,
    { request_token: castle2.token, event: '$login' },
    headers,
    PROXY
  );
  console.log(`status: ${evt2.status}`);
  console.log('body:', JSON.stringify(evt2.body));

  // 3c. castle-event with castle_request_token field name
  console.log('\n[3c] castle-event with castle_request_token field...');
  const castle3 = await harvest_castle_token_fast(null);
  const evt3 = await https_post_json(
    `${LOVABLE_API_BASE}/auth/castle-event`,
    { castle_request_token: castle3.token },
    headers,
    PROXY
  );
  console.log(`status: ${evt3.status}`);
  console.log('body:', JSON.stringify(evt3.body));

  // 4. signIn anyway (expect fail but log full error)
  console.log('\n[4] signInWithPassword...');
  const signin = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { returnSecureToken: true, email: EMAIL, password: PASSWORD, clientType: 'CLIENT_TYPE_WEB' },
    headers,
    PROXY
  );
  console.log(`status: ${signin.status}`);
  console.log('body:', JSON.stringify(signin.body).slice(0, 500));

  // 5. try signIn WITHOUT proxy (direct to google)
  console.log('\n[5] signInWithPassword (NO proxy)...');
  const castle4 = await harvest_castle_token_fast(null);
  const headers2 = lovable_headers(castle4.user_agent);
  // fresh check-auth without proxy
  await https_post_json(
    `${LOVABLE_API_BASE}/auth/check-auth-provider`,
    { email: EMAIL, castle_request_token: castle4.token },
    headers2,
    PROXY
  );
  const signin2 = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { returnSecureToken: true, email: EMAIL, password: PASSWORD, clientType: 'CLIENT_TYPE_WEB' },
    headers2,
    null  // no proxy
  );
  console.log(`status: ${signin2.status}`);
  console.log('body:', JSON.stringify(signin2.body).slice(0, 500));

})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
