#!/usr/bin/env node
'use strict';

// test-proxy-usage.js — valida se proxy tá sendo usado nas requisições

const https = require('https');
const http = require('http');
const tls = require('tls');

const PROXY_LIST = [
  'http://vxikkfjt:0gmdhnvcgzx3@45.38.107.97:6014',
  'http://vxikkfjt:0gmdhnvcgzx3@64.137.96.74:6641',
  'http://vxikkfjt:0gmdhnvcgzx3@198.23.243.226:6361',
  'http://vxikkfjt:0gmdhnvcgzx3@38.154.185.97:6370',
];

let PROXY_INDEX = 0;

function getNextProxy() {
  const proxy = PROXY_LIST[PROXY_INDEX % PROXY_LIST.length];
  PROXY_INDEX++;
  return proxy;
}

function parseProxy(proxyUrl) {
  try {
    const url = new URL(proxyUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port),
      username: url.username,
      password: url.password,
    };
  } catch {
    return null;
  }
}

async function testProxyRequest(proxy) {
  return new Promise((resolve, reject) => {
    const parsed = parseProxy(proxy);
    if (!parsed) {
      reject(new Error(`Proxy inválido: ${proxy}`));
      return;
    }

    console.log(`\n🌐 Testando proxy: ${proxy.substring(0, 40)}...`);
    console.log(`   Host: ${parsed.host}:${parsed.port}`);
    console.log(`   Auth: ${parsed.username}:***`);

    const req = http.request(
      {
        method: 'CONNECT',
        hostname: parsed.host,
        port: parsed.port,
        path: 'api.lovable.dev:443',
        headers: {
          'Proxy-Authorization': 'Basic ' +
            Buffer.from(`${parsed.username}:${parsed.password}`).toString('base64')
        },
        timeout: 10000,
      },
      () => {} // callback não usado pra CONNECT
    );

    req.on('connect', (res, socket) => {
      if (res.statusCode === 200) {
        console.log(`   ✅ Conectado via proxy (status: ${res.statusCode})`);
        socket.destroy();
        resolve(true);
      } else {
        console.log(`   ❌ Proxy retornou status: ${res.statusCode}`);
        socket.destroy();
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log(`   ❌ Erro: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`   ⏱️  Timeout (10s)`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  console.log('\n🧪 Testando Proxy Rotation\n');
  console.log('════════════════════════════════════════════════════════════\n');

  // Teste 4 proxies
  let success = 0;
  for (let i = 0; i < 4; i++) {
    const proxy = getNextProxy();
    const result = await testProxyRequest(proxy);
    if (result) success++;

    // Delay entre testes
    if (i < 3) await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n════════════════════════════════════════════════════════════\n');
  console.log(`📊 Resultado: ${success}/4 proxies funcionando\n`);

  if (success === 0) {
    console.log('❌ NENHUM proxy conectou');
    console.log('   Possíveis causas:');
    console.log('   - Proxies expirados');
    console.log('   - IP bloqueado');
    console.log('   - Credenciais erradas\n');
  } else if (success < 2) {
    console.log(`⚠️  Apenas ${success} proxy(ies) funcionando`);
    console.log('   Recomendação: validar lista de proxies\n');
  } else {
    console.log('✅ Proxies FUNCIONANDO!');
    console.log('   Sistema pronto pra criar contas\n');
  }

  process.exit(success > 0 ? 0 : 1);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
