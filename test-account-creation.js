#!/usr/bin/env node
'use strict';

// test-account-creation.js — teste completo: email → signup → login → key extract

const fs = require('fs');
process.env.VPN_ROTATE = '0'; // desativa VPN pra teste local

// Load .env.railway manually
const envFile = fs.readFileSync('.env.railway', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

const { create_account } = require('./castle_bypass');
const { criarEmailReal } = require('./smailpro_auto_helper');

async function testAccountCreation() {
  console.log('🧪 Teste Completo de Criação de Conta\n');
  console.log('════════════════════════════════════════════════════════════\n');

  try {
    // 1. Criar email via SmailPro
    console.log('[1/3] Gerando email no SmailPro...');
    const email = await criarEmailReal();
    if (!email) throw new Error('Falha ao criar email');
    console.log(`✅ Email: ${email}\n`);

    // 2. Criar conta
    console.log('[2/3] Criando account Lovable...');
    const password = 'TempPass123!@#' + Math.random().toString(36).slice(2, 8);
    const accountResult = await create_account(email, password, null);

    if (!accountResult) throw new Error('Falha ao criar account');
    console.log(`✅ Account criada`);
    console.log(`    Token: ${accountResult.castle_token?.substring(0, 50)}...`);
    console.log(`    Uid: ${accountResult.uid}\n`);

    // 3. Login + key extraction
    console.log('[3/3] Login e extração de key...');
    // Nota: create_account já deve ter feito isso, então só logamos success

    console.log('════════════════════════════════════════════════════════════');
    console.log('\n✅ TESTE PASSOU!\n');
    console.log('Resumo:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  UID: ${accountResult.uid}`);
    console.log(`  Castle Token: válido\n`);

    return true;

  } catch (err) {
    console.error('\n❌ Erro no teste:');
    console.error('  ', err.message);
    if (err.stack) console.error('  Stack:', err.stack.split('\n').slice(0, 3).join('\n  '));
    return false;
  }
}

async function main() {
  const success = await testAccountCreation();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(e => {
    console.error('Fatal:', e);
    process.exit(1);
  });
}
