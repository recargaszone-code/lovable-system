'use strict';

const https = require('https');

let SMAILPRO_COOKIE = 'XSRF-TOKEN=eyJpdiI6InZVQWlqY3ZlamF4Q0RocS9XZWF1bEE9PSIsInZhbHVlIjoicTZRR3pudXlUSG5MQTI5VVZmNXpPMFRPTUtYZ3NFVWZibU9oRzNFTmFneklYall3eXhaVTh0cEl0TjVmSkJPZUhINDJFeGxnWERvbTZUbEtXQmxSMXdybUVyTXFvL0h3TlpPUWNlNURZcDRzcDFNZlRjK2UzR25FQ1poV2Z3RFAiLCJtYWMiOiI3Y2RjOGMwYTUwNDFjZDVhMjgyM2Q4ZWRhZTc2Mzg1ZmY4N2NjYzEzY2UyYWExZWVlYjc2YTJhOTFiOWI4YzBkIiwidGFnIjoiIn0%3D; sonjj_session=eyJpdiI6IjZyQXJEOU5QT3RIdWRLSURtTVhacUE9PSIsInZhbHVlIjoicjdaVDVDaDFsMjNkdGRGZ2J2TVdkU2tZQWRiVFNsM3Z1M1JxNUkrYnRkbGtIMTFoeTJKYVNYUTh6WUc5MlpjRDRhd3IwSVN3WjRuZktsbjRXYUNwVXJqZE5XUmRyMEZkbGFTL1ludE1iS1NmMWYvUE9BWFdxcUQ3K1MxRDVBd3YiLCJtYWMiOiJjNzExZTgzNTg3YTFlNGIxZGU4ZGUxMTlmNWNjZmIwNzhkNjQyMjAzNjBkNWIyMDgwNTBjMjBjMDcyMGZmY2RmIiwidGFnIjoiIn0%3D';

const SONJJ_AUTH_COOKIES = {
  sonjj_session: 'eyJpdiI6InRIVmpzY3JuSEl5OXZxb1J4WEVkMnc9PSIsInZhbHVlIjoiSG9CTEJHU2R3RDc0aDZvRFpvMi9acWtOQmtDbFJFS01TOVFhRE5UUXQwNDV2YzFvMkNLczIrMXFSakt3YUdhMkh2YWdha1crak55clMwODlwNnRLRVpkeWh5Q25ZcjB1MXJ0M0dzaHlYQ1Y3WTFHQnROMjljamFZZFQzd2lYMzAiLCJtYWMiOiJjZmU2MzM0MzVkY2E4NzIxOTAwYWVlZjBiMDZkOTE4Yjc2ZmM0NzU0NzY3NTVjZjliMDM1NjYyNDkxODgzMDQ2IiwidGFnIjoiIn0%3D',
  xsrf: 'eyJpdiI6Ikozbm42bzlzWld2bkc3VGM2WnBMSmc9PSIsInZhbHVlIjoidjlBNTBlOE1XSEdIaTI4UW5HZzZqZndJZWpMNHpBYTNEMXZLNUtTU01Tc2RCVlJ4ZXdyNytZVHlzSnV5cDZMTERzRmo2dk5RM3dOYmtsUFZQY3pYc2dRN1I3Z3dDN1JUdGFQeWVwbi9YbTBYNmFoNmsyb09DL001ZG05bG9vdk8iLCJtYWMiOiJmYjNiMGYyYjg4MTY4ZDBhNzUyODA4N2I1NmQxOGY3MjAzZWE1MzdlOGVjNTFhMTRlZTI4YWNjMzAzNjliMWNjIiwidGFnIjoiIn0%3D',
  remember: 'eyJpdiI6IkpELytIdHJyQVhJcDVnNlZPMEdOWkE9PSIsInZhbHVlIjoiOXY0cnArMDFET1h0M3RHN1JTcmQwVmttSDI3MGt5ajd6MXREdVdQeXN3c1Y2L1BUMjdyYWtWczZQdG05SmN1dmxFS1BqTXNoVUpnUFcrOVdlazYxS3NYUUM2SjVBTzkrQ2JkTnhxeXhFV1FzQlFkNWxjSkxlL3YrdnhnOERRdDRLd1VrQWdMZUpOdzAwU0YrL0pObm01cVdhK2xrN0lUaGNBU2EwU3ZHcFlZYlVEbEplMm5vNEJ4RGJnbWp0M3haaUpNZ29mTHdWQ3NkYVoyclA2dnM0ekJxTWJkMUhIcWdEcE9CeFgrMWZGRT0iLCJtYWMiOiI3OWE2OGJjNDVjMzA1ZmU4MTZlYWNjMzU2N2U4NzVjYzA1NzI3ZWI3MTBhZTc2YjYyOTYxNzkyMDljNmUzYmJjIiwidGFnIjoiIn0%3D'
};

function requestPromise(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function renovarSessaoSmailPro() {
  try {
    const cookieHeader = `sonjj_session=${SONJJ_AUTH_COOKIES.sonjj_session}; XSRF-TOKEN=${SONJJ_AUTH_COOKIES.xsrf}; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=${SONJJ_AUTH_COOKIES.remember}`;
    const ssoRes = await requestPromise({
      hostname: 'my.sonjj.com',
      path: '/app/sso-token',
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': 'SkFQ4dKwvIdOLmPsyP1l4lYwu484aePwEzo1Fmoo'
      }
    }, '{}');

    if (ssoRes.statusCode === 200) {
      const parsed = JSON.parse(ssoRes.data);
      const ssoToken = parsed.items?.token;
      if (ssoToken) {
        const authRes = await requestPromise({
          hostname: 'smailpro.com',
          path: '/setAuth?data=' + encodeURIComponent(ssoToken),
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'
          }
        });
        const setCookies = authRes.headers['set-cookie'];
        if (setCookies && Array.isArray(setCookies)) {
          const xsrf = setCookies.find(c => c.startsWith('XSRF-TOKEN='))?.split(';')[0];
          const session = setCookies.find(c => c.startsWith('sonjj_session='))?.split(';')[0];
          if (xsrf && session) {
            SMAILPRO_COOKIE = `${xsrf}; ${session}`;
            return true;
          }
        }
      }
    }
  } catch (err) {
    console.error('[SMAILPRO] Erro ao renovar SSO:', err.message);
  }
  return false;
}

async function criarEmailReal(tipo = 'outlook') {
  const domain = tipo === 'gmail' ? 'gmail.com' : 'outlook.com';
  const urlPath = `/app/create?username=random&type=real&domain=${domain}&server=1`;

  let res = await requestPromise({
    hostname: 'smailpro.com',
    path: urlPath,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
      'Cookie': SMAILPRO_COOKIE,
      'Accept': 'application/json',
      'Referer': 'https://smailpro.com/temporary-email'
    }
  });

  if (res.statusCode === 401 || res.statusCode === 403) {
    await renovarSessaoSmailPro();
    res = await requestPromise({
      hostname: 'smailpro.com',
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
        'Cookie': SMAILPRO_COOKIE,
        'Accept': 'application/json',
        'Referer': 'https://smailpro.com/temporary-email'
      }
    });
  }

  if (res.statusCode === 200) {
    const data = JSON.parse(res.data);
    if (data.address && data.key) {
      return {
        email: data.address,
        timestamp: data.timestamp,
        key: data.key,
        domain
      };
    }
  }

  throw new Error(`Falha ao criar e-mail SmailPro: ${res.statusCode} - ${res.data}`);
}

async function obterCorpoMensagem(email, mid, domain) {
  try {
    const urlPayload = `/app/message?email=${encodeURIComponent(email)}&mid=${encodeURIComponent(mid)}`;
    const resPayload = await requestPromise({
      hostname: 'smailpro.com',
      path: urlPayload,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
        'Cookie': SMAILPRO_COOKIE,
        'Accept': 'application/json',
        'Referer': 'https://smailpro.com/temporary-email'
      }
    });

    if (resPayload.statusCode === 200 && resPayload.data) {
      const jwtPayload = resPayload.data.trim();
      const endpoint = domain === 'gmail.com' ? '/v1/temp_gmail/message' : '/v1/temp_outlook/message';
      const resMsg = await requestPromise({
        hostname: 'api.sonjj.com',
        path: `${endpoint}?payload=${encodeURIComponent(jwtPayload)}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
          'Origin': 'https://smailpro.com',
          'Referer': 'https://smailpro.com/'
        }
      });

      if (resMsg.statusCode === 200) {
        const data = JSON.parse(resMsg.data);
        return data.body || '';
      }
    }
  } catch(e) {}
  return '';
}

async function verificarMensagens(emailData) {
  const bodyPayload = JSON.stringify([{
    address: emailData.email,
    timestamp: emailData.timestamp,
    key: emailData.key
  }]);

  const resPayload = await requestPromise({
    hostname: 'smailpro.com',
    path: '/app/inbox',
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
      'Cookie': SMAILPRO_COOKIE,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://smailpro.com/temporary-email'
    }
  }, bodyPayload);

  if (resPayload.statusCode === 401 || resPayload.statusCode === 403) {
    console.log(`\n[SMAILPRO] Sessao expirada no polling (status ${resPayload.statusCode}), renovando...`);
    await renovarSessaoSmailPro();
    return [];
  }

  if (resPayload.statusCode !== 200) {
    console.log(`\n[SMAILPRO] /app/inbox retornou status ${resPayload.statusCode}: ${resPayload.data.slice(0, 200)}`);
    return [];
  }
  const parsedPayload = JSON.parse(resPayload.data);
  const jwtPayload = parsedPayload[0]?.payload;
  if (!jwtPayload) {
    console.log(`\n[SMAILPRO] /app/inbox sem payload JWT na resposta: ${resPayload.data.slice(0, 200)}`);
    return [];
  }

  if (parsedPayload[0]?.key) emailData.key = parsedPayload[0].key;

  const endpoint = emailData.domain === 'gmail.com' ? '/v1/temp_gmail/inbox' : '/v1/temp_outlook/inbox';
  const resSonjj = await requestPromise({
    hostname: 'api.sonjj.com',
    path: `${endpoint}?payload=${encodeURIComponent(jwtPayload)}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
      'Origin': 'https://smailpro.com',
      'Referer': 'https://smailpro.com/'
    }
  });

  if (resSonjj.statusCode === 200) {
    try {
      const data = JSON.parse(resSonjj.data);
      const msgs = data.messages || [];

      for (const m of msgs) {
        if (m.mid && !m.body) {
          m.body = await obterCorpoMensagem(emailData.email, m.mid, emailData.domain);
        }
      }
      return msgs;
    } catch(e) {
      return [];
    }
  }

  // Falha de token OAuth específica no cluster de Outlook da Sonjj/SmailPro
  if (resSonjj.statusCode === 400 && resSonjj.data.includes('unauthorized_client')) {
    // Tenta renovar a sessao principal para forcar refresh de token
    if (!emailData._renovouOAuth) {
      emailData._renovouOAuth = true;
      await renovarSessaoSmailPro();
    }
  }

  // Log resumido apenas quando não for polling transitório normal
  if (!resSonjj.data.includes('Outlook token refresh failed')) {
    console.log(`\n[SMAILPRO] api.sonjj.com inbox retornou status ${resSonjj.statusCode}: ${resSonjj.data.slice(0, 160)}`);
  }
  return [];
}

async function aguardarLinkLovableSmailPro(emailData, timeoutMs = 90000) {
  const inicio = Date.now();
  console.log(`[SMAILPRO] Aguardando e-mail de ativacao em ${emailData.email}...`);

  while (Date.now() - inicio < timeoutMs) {
    try {
      const mensagens = await verificarMensagens(emailData);
      if (mensagens && mensagens.length > 0) {
        for (const msg of mensagens) {
          const texto = (msg.body || '') + ' ' + (msg.textSubject || '') + ' ' + (msg.subject || '');
          const matchLink = texto.match(/https?:\/\/[^\s"'<>]+(?:verify|confirm)[^\s"'<>]+/i) ||
                            texto.match(/https?:\/\/lovable\.dev\/[^\s"'<>]+/i);
          if (matchLink) {
            console.log(`\n[SMAILPRO] Link capturado com sucesso: ${matchLink[0]}`);
            return matchLink[0].replace(/&amp;/g, '&');
          }
        }
      }
    } catch (e) {
      console.log(`\n[SMAILPRO] Erro no polling: ${e.message}`);
    }
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log('\n[SMAILPRO] Timeout aguardando ativacao.');
  return null;
}

module.exports = {
  criarEmailReal,
  verificarMensagens,
  obterCorpoMensagem,
  aguardarLinkLovableSmailPro,
  renovarSessaoSmailPro
};
