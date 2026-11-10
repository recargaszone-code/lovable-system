'use strict';

const https = require('https');
const { criarEmailReal, verificarMensagens, obterCorpoMensagem, renovarSessaoSmailPro } = require('./smailpro_auto_helper');

const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';

function requestHttpsJson(hostname, path, method, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const postData = bodyObj ? JSON.stringify(bodyObj) : null;
    const reqHeaders = { ...headers };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = https.request({
      hostname,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

/**
 * Dispara e-mail de redefinição de senha via Firebase Auth REST API (sem captcha)
 */
async function dispararResetSenha(email) {
  console.log(`[RESET] Disparando solicitacao de reset de senha para ${email}...`);
  const res = await requestHttpsJson(
    'identitytoolkit.googleapis.com',
    `/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
    'POST',
    {},
    { requestType: 'PASSWORD_RESET', email }
  );

  if (res.statusCode === 200) {
    console.log(`[RESET] E-mail de redefinicao disparado com sucesso pelo Firebase!`);
    return true;
  } else {
    console.log(`[RESET] Falha ao disparar reset:`, res.data || res.raw);
    return false;
  }
}

/**
 * Escuta o SmailPro até o e-mail de Reset de Senha do Lovable chegar
 * Extrai o oobCode ou o link completo
 */
async function aguardarLinkResetSmailPro(emailData, timeoutMs = 90000) {
  const inicio = Date.now();
  console.log(`[SMAILPRO] Aguardando e-mail de redefinicao em ${emailData.email}...`);

  while (Date.now() - inicio < timeoutMs) {
    try {
      const mensagens = await verificarMensagens(emailData);
      if (mensagens && mensagens.length > 0) {
        for (const msg of mensagens) {
          const texto = (msg.body || '') + ' ' + (msg.textSubject || '') + ' ' + (msg.subject || '');
          if (texto.toLowerCase().includes('reset') || texto.toLowerCase().includes('password') || texto.includes('oobCode') || texto.includes('mode=resetPassword')) {
            const matchLink = texto.match(/https?:\/\/[^\s"'<>]+(?:mode=resetPassword|action|reset)[^\s"'<>]+/i) ||
                              texto.match(/https?:\/\/[^\s"'<>]+oobCode=[^\s"'<>]+/i) ||
                              texto.match(/https?:\/\/lovable\.dev\/[^\s"'<>]+/i);
            if (matchLink) {
              const urlLimpa = matchLink[0].replace(/&amp;/g, '&');
              console.log(`\n[SMAILPRO] Link de reset capturado: ${urlLimpa}`);

              // Extrai o oobCode se existir
              const matchCode = urlLimpa.match(/[?&]oobCode=([^&]+)/);
              const oobCode = matchCode ? matchCode[1] : null;

              return { url: urlLimpa, oobCode };
            }
          }
        }
      }
    } catch (e) {}
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log('\n[SMAILPRO] Timeout aguardando e-mail de reset.');
  return null;
}

/**
 * Redefine a senha diretamente via Firebase REST API usando o oobCode
 * Retorna true e a nova senha aplicada
 */
async function aplicarNovaSenhaViaRest(oobCode, novaSenha) {
  console.log(`[RESET] Aplicando nova senha via REST API usando oobCode...`);
  const res = await requestHttpsJson(
    'identitytoolkit.googleapis.com',
    `/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`,
    'POST',
    {},
    { oobCode, newPassword: novaSenha }
  );

  if (res.statusCode === 200) {
    console.log(`[RESET] Senha redefinida com SUCESSO! A conta agora e nossa.`);
    return true;
  } else {
    console.log(`[RESET] Erro ao aplicar nova senha via REST:`, res.data || res.raw);
    return false;
  }
}

module.exports = {
  dispararResetSenha,
  aguardarLinkResetSmailPro,
  aplicarNovaSenhaViaRest,
  criarEmailReal,
  verificarMensagens,
  renovarSessaoSmailPro
};
