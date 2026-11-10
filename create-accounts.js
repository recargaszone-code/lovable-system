#!/usr/bin/env node
'use strict';

// create-accounts.js — gera N contas Lovable com chaves

const fs = require('fs');
const path = require('path');

// Load env
const envFile = fs.readFileSync('.env.railway', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

process.env.VPN_ROTATE = '0'; // desativa VPN pra teste local

const { create_account } = require('./castle_bypass');
const { criarEmailReal } = require('./smailpro_auto_helper');

const OUTPUT_FILE = path.join(__dirname, 'contas_criadas.txt');

let count = parseInt(process.argv[2]) || 1; // padrão: 1 conta
if (count > 10) count = 10; // máx 10 por sessão

async function createAccount() {
  try {
    console.log(`\n[${new Date().toLocaleTimeString()}] Gerando email...`);
    const email = await criarEmailReal();
    if (!email) throw new Error('Falha SmailPro');

    const pwd = 'Pwd' + Math.random().toString(36).slice(2, 8) + '!@';
    console.log(`✅ Email: ${email}`);
    console.log(`   Criando account...`);

    const acc = await create_account(email, pwd, null);
    if (!acc || !acc.uid) throw new Error('Account falhou');

    // Salvar
    const line = `${email}|${pwd}|${acc.uid}|${new Date().toISOString()}`;
    fs.appendFileSync(OUTPUT_FILE, line + '\n');

    console.log(`✅ Account criada! UID: ${acc.uid}`);
    return { email, pwd, uid: acc.uid };

  } catch (err) {
    console.error(`❌ Erro: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`\n🚀 Criando ${count} conta(s)...\n`);

  let success = 0;
  for (let i = 0; i < count; i++) {
    console.log(`\n[${i + 1}/${count}]`);
    const result = await createAccount();
    if (result) success++;

    // Delay entre contas
    if (i < count - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`✅ ${success}/${count} contas criadas com sucesso!`);
  console.log(`📁 Dados salvos em: ${OUTPUT_FILE}\n`);

  process.exit(success === count ? 0 : 1);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
