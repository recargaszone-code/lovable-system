#!/usr/bin/env node
'use strict';

// test-bypass.js — valida castle token mint + proxy rotation

const path = require('path');
const fs = require('fs');

// Load .env.railway manually
const envFile = fs.readFileSync('.env.railway', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

const {
  harvest_castle_token_fast,
  create_account_api,
  login_account_api,
} = require('./castle_bypass');

async function testCastleBypass() {
  console.log('🧪 Testando Castle Token Bypass...\n');

  try {
    // 1. Testar mint sem proxy (local)
    console.log('[1/3] Mintando token local (sem proxy)...');
    const tokenResult = await harvest_castle_token_fast(null);
    console.log(`✅ Token gerado: ${tokenResult.token.substring(0, 50)}...`);
    console.log(`    User-Agent: ${tokenResult.user_agent.substring(0, 60)}...\n`);

    // 2. Testar proxy parsing
    console.log('[2/3] Validando proxy list...');
    const proxyList = (process.env.PROXY_LIST || '').split('|').filter(p => p.trim());
    if (proxyList.length === 0) {
      console.log('⚠️  PROXY_LIST vazio — usando local (sem proxy)');
    } else {
      console.log(`✅ ${proxyList.length} proxies carregados:`);
      proxyList.slice(0, 3).forEach((p, i) => {
        const [host, port] = p.split(':');
        console.log(`   [${i + 1}] ${host}:${port}`);
      });
      if (proxyList.length > 3) console.log(`   ... e ${proxyList.length - 3} mais`);
    }
    console.log();

    // 3. Testar API base
    console.log('[3/3] Validando credenciais da API...');
    const castlePK = process.env.CASTLE_PK;
    const firebaseKey = process.env.FIREBASE_API_KEY;

    if (!castlePK) {
      console.log('❌ CASTLE_PK não definido');
      return false;
    }
    if (!firebaseKey) {
      console.log('❌ FIREBASE_API_KEY não definido');
      return false;
    }

    console.log(`✅ CASTLE_PK: ${castlePK.substring(0, 30)}...`);
    console.log(`✅ FIREBASE_API_KEY: ${firebaseKey.substring(0, 30)}...\n`);

    console.log('═'.repeat(60));
    console.log('✅ TUDO PRONTO PARA TESTE DE CONTA!\n');
    return true;

  } catch (err) {
    console.error('❌ Erro:', err.message);
    return false;
  }
}

async function main() {
  const success = await testCastleBypass();
  process.exit(success ? 0 : 1);
}

main();
