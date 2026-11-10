'use strict';
const crypto = require('crypto');
const https = require('https');
const { create_account_api, login_account_api, abrirChromeNativo, lovable_headers, https_post_json, harvest_castle_token_fast } = require('./castle_bypass');
const { criarEmailReal, verificarMensagens, obterCorpoMensagem, renovarSessaoSmailPro } = require('./smailpro_auto_helper');
const fs = require('fs');

const PROXY = 'http://5d82e372e1633ea6:1tDfBUnLa0CxApzZ@res.proxy-seller.com:10000';
const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';
const LOVABLE_API_BASE = 'https://api.lovable.dev';
const TEMPLATE_PROJECT_ID = 'd2d2f51d-b553-46f7-9e86-585e519f1e19';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function aguardarEmailVerificacao(emailData, timeoutMs = 120000) {
  const inicio = Date.now();
  console.log(`[VERIFY] aguardando email de verificação em ${emailData.email}...`);
  while (Date.now() - inicio < timeoutMs) {
    try {
      const msgs = await verificarMensagens(emailData);
      if (msgs && msgs.length > 0) {
        for (const msg of msgs) {
          const texto = (msg.body || '') + ' ' + (msg.textSubject || '') + ' ' + (msg.subject || '');
          if (texto.toLowerCase().includes('verify') || texto.toLowerCase().includes('confirm') || texto.includes('oobCode') || texto.includes('mode=verifyEmail')) {
            const body = await obterCorpoMensagem(emailData.email, msg.mid, emailData.domain);
            const fullText = body || texto;
            const matchLink = fullText.match(/https?:\/\/[^\s"'<>]+(?:mode=verifyEmail|verify|action)[^\s"'<>]+/i) ||
                              fullText.match(/https?:\/\/[^\s"'<>]+oobCode=[^\s"'<>]+/i) ||
                              fullText.match(/https?:\/\/auth\.lovable\.dev\/[^\s"'<>]+/i) ||
                              fullText.match(/https?:\/\/lovable\.dev\/[^\s"'<>]+verify[^\s"'<>]*/i);
            if (matchLink) {
              const urlLimpa = matchLink[0].replace(/&amp;/g, '&');
              console.log(`[VERIFY] link capturado: ${urlLimpa.slice(0, 80)}...`);
              const matchCode = urlLimpa.match(/[?&]oobCode=([^&]+)/);
              return { url: urlLimpa, oobCode: matchCode ? matchCode[1] : null };
            }
          }
        }
      }
    } catch (e) {}
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 4000));
  }
  console.log('\n[VERIFY] timeout.');
  return null;
}

async function verificarEmailViaFirebase(oobCode) {
  console.log(`[VERIFY] aplicando oobCode via Firebase...`);
  const res = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
    { oobCode },
    { 'Content-Type': 'application/json' },
    null
  );
  console.log(`[VERIFY] accounts:update status: ${res.status}`);
  return res;
}

(async () => {
  const hits = [];
  const t0 = Date.now();

  // 1. gerar email smailpro
  console.log('=== 1. SMAILPRO EMAIL ===');
  const emailData = await criarEmailReal('outlook');
  console.log(`email: ${emailData.email}`);
  const password = 'Lov_' + crypto.randomBytes(6).toString('base64url') + '!1';
  console.log(`password: ${password}`);

  // 2. signup via API
  console.log('\n=== 2. SIGNUP ===');
  const signup = await create_account_api(emailData.email, password, PROXY);
  if (!signup.success) { console.log('signup failed:', signup.error); process.exit(1); }
  console.log(`signup OK em ${((Date.now() - t0)/1000).toFixed(1)}s`);

  // 3. login pra obter idToken (email ainda não verificado)
  console.log('\n=== 3. LOGIN (pre-verify) ===');
  const login1 = await login_account_api(emailData.email, password, PROXY);
  if (!login1.success) { console.log('login1 failed:', login1.error); process.exit(1); }
  console.log(`login1 OK, idToken: ${login1.idToken.slice(0, 30)}...`);

  // 4. enviar email de verificação via Firebase
  console.log('\n=== 4. SEND VERIFICATION EMAIL ===');
  const sendVerify = await https_post_json(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
    { requestType: 'VERIFY_EMAIL', idToken: login1.idToken },
    { 'Content-Type': 'application/json' },
    null
  );
  console.log(`sendOobCode status: ${sendVerify.status}`);
  console.log(`body:`, JSON.stringify(sendVerify.body).slice(0, 200));

  // 5. aguardar email no smailpro
  console.log('\n=== 5. AGUARDANDO EMAIL VERIFICAÇÃO ===');
  const verifyInfo = await aguardarEmailVerificacao(emailData, 120000);
  if (!verifyInfo) { console.log('ERRO: email de verificação nunca chegou'); process.exit(1); }
  console.log(`oobCode: ${verifyInfo.oobCode?.slice(0, 30)}...`);

  // 6. aplicar verificação
  console.log('\n=== 6. VERIFICAR EMAIL ===');
  if (verifyInfo.oobCode) {
    const verifyRes = await verificarEmailViaFirebase(verifyInfo.oobCode);
    console.log('verify body:', JSON.stringify(verifyRes.body).slice(0, 300));
  } else {
    console.log('sem oobCode, tentando GET na URL...');
    const getRes = await httpsGet(verifyInfo.url);
    console.log(`GET status: ${getRes.status}`);
    if (getRes.headers.location) console.log(`redirect: ${getRes.headers.location}`);
  }

  // 7. re-login com email verificado
  console.log('\n=== 7. RE-LOGIN (post-verify) ===');
  const login2 = await login_account_api(emailData.email, password, PROXY);
  if (!login2.success) { console.log('login2 failed:', login2.error); process.exit(1); }
  console.log(`login2 OK, emailVerified should be true now`);

  // 8. testar se API aceita agora
  console.log('\n=== 8. TEST API ACCESS ===');
  const headers = {
    ...lovable_headers('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'),
    'Authorization': `Bearer ${login2.idToken}`
  };

  // test: user profile
  const profile = await https_post_json(`${LOVABLE_API_BASE}/user/profile`, null, { ...headers }, PROXY);
  console.log(`GET /user/profile: ${profile.status}`);
  console.log(`body:`, JSON.stringify(profile.body).slice(0, 500));

  // test: projects list
  const projects = await https_post_json(`${LOVABLE_API_BASE}/projects`, null, { ...headers }, PROXY);
  console.log(`GET /projects: ${projects.status}`);
  console.log(`body:`, JSON.stringify(projects.body).slice(0, 500));

  // 9. tentar onboarding via API
  console.log('\n=== 9. ONBOARDING API TESTS ===');

  // try POST /user/onboarding
  const onb1 = await https_post_json(`${LOVABLE_API_BASE}/user/onboarding`,
    { name: 'Dev Max', role: 'founder', team_size: 'solo' }, headers, PROXY);
  console.log(`POST /user/onboarding: ${onb1.status} → ${JSON.stringify(onb1.body).slice(0, 300)}`);

  // try PATCH /user/profile
  const onb2 = await https_post_json(`${LOVABLE_API_BASE}/user/profile`,
    { display_name: 'Dev Max', role: 'founder', team_size: 'solo' }, headers, PROXY);
  console.log(`POST /user/profile: ${onb2.status} → ${JSON.stringify(onb2.body).slice(0, 300)}`);

  // try PUT /user/profile
  const onb3 = await https_post_json(`${LOVABLE_API_BASE}/user`,
    { display_name: 'Dev Max', role: 'founder', team_size: 'solo' }, headers, PROXY);
  console.log(`POST /user: ${onb3.status} → ${JSON.stringify(onb3.body).slice(0, 300)}`);

  // 10. tentar remix via API
  console.log('\n=== 10. REMIX API TESTS ===');
  const remix1 = await https_post_json(`${LOVABLE_API_BASE}/projects/${TEMPLATE_PROJECT_ID}/remix`,
    {}, headers, PROXY);
  console.log(`POST /projects/{id}/remix: ${remix1.status} → ${JSON.stringify(remix1.body).slice(0, 500)}`);

  const remix2 = await https_post_json(`${LOVABLE_API_BASE}/projects/remix`,
    { project_id: TEMPLATE_PROJECT_ID }, headers, PROXY);
  console.log(`POST /projects/remix: ${remix2.status} → ${JSON.stringify(remix2.body).slice(0, 500)}`);

  const remix3 = await https_post_json(`${LOVABLE_API_BASE}/projects/fork`,
    { source_project_id: TEMPLATE_PROJECT_ID }, headers, PROXY);
  console.log(`POST /projects/fork: ${remix3.status} → ${JSON.stringify(remix3.body).slice(0, 500)}`);

  // 11. salvar resultados
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n=== TOTAL: ${elapsed}s ===`);

  const results = {
    email: emailData.email, password, elapsed,
    signup: signup.success,
    login1: login1.success,
    verify: verifyInfo?.oobCode ? 'oobCode' : 'url',
    login2: login2.success,
    profile: { status: profile.status, body: profile.body },
    projects: { status: projects.status, body: projects.body },
    onboarding: {
      '/user/onboarding': { status: onb1.status, body: onb1.body },
      '/user/profile': { status: onb2.status, body: onb2.body },
      '/user': { status: onb3.status, body: onb3.body }
    },
    remix: {
      '/projects/{id}/remix': { status: remix1.status, body: remix1.body },
      '/projects/remix': { status: remix2.status, body: remix2.body },
      '/projects/fork': { status: remix3.status, body: remix3.body }
    }
  };

  fs.writeFileSync('B:\\Lovable - Copy\\recon_full_flow.json', JSON.stringify(results, null, 2));
  console.log('salvo em recon_full_flow.json');

})().catch(e => { console.error('[FATAL]', e.message); process.exit(1); });
