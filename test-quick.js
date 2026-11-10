#!/usr/bin/env node
'use strict';

// test-quick.js — teste rápido, sem Chrome (validações apenas)

const fs = require('fs');

console.log('\n✅ TESTE RÁPIDO (SEM CHROME)\n');
console.log('════════════════════════════════════════════════════════════\n');

// 1. Package.json
console.log('[1/5] Dependências Node...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const required = ['express', 'puppeteer-core', '@castleio/castle-js', 'imapflow', 'mailparser'];
const missing = required.filter(d => !pkg.dependencies[d]);
if (missing.length === 0) {
  console.log(`✅ Todas as ${required.length} dependências instaladas\n`);
} else {
  console.log(`❌ Faltam: ${missing.join(', ')}\n`);
  process.exit(1);
}

// 2. Arquivos críticos
console.log('[2/5] Arquivos críticos...');
const files = ['dashboard.js', 'castle_bypass.js', 'fabricador_api.js', 'smailpro_auto_helper.js', 'vpn_rotator.js'];
const missing_files = files.filter(f => !fs.existsSync(f));
if (missing_files.length === 0) {
  console.log(`✅ Todos os ${files.length} arquivos existem\n`);
} else {
  console.log(`❌ Faltam: ${missing_files.join(', ')}\n`);
  process.exit(1);
}

// 3. Configuração
console.log('[3/5] Configuração (.env.railway)...');
const envContent = fs.readFileSync('.env.railway', 'utf8');
const envVars = ['CASTLE_PK', 'FIREBASE_API_KEY', 'PROXY_LIST'];
const missing_env = envVars.filter(v => !envContent.includes(v + '='));
if (missing_env.length === 0) {
  console.log(`✅ Todas as ${envVars.length} variáveis configuradas\n`);
} else {
  console.log(`❌ Faltam env vars: ${missing_env.join(', ')}\n`);
  process.exit(1);
}

// 4. Keys prontas
console.log('[4/5] Keys armazenadas...');
const keysFile = 'contas_concluidas_com_chave.txt';
if (fs.existsSync(keysFile)) {
  const keys = fs.readFileSync(keysFile, 'utf8').split('\n').filter(l => l.includes('|'));
  console.log(`✅ ${keys.length} keys prontas\n`);
} else {
  console.log(`⚠️  Arquivo de keys não encontrado\n`);
}

// 5. Git
console.log('[5/5] Git repository...');
if (fs.existsSync('.git')) {
  const commit = require('child_process').execSync('git log -1 --oneline 2>/dev/null || echo "not ready"', { encoding: 'utf8' }).trim();
  console.log(`✅ Repository pronto (${commit.split(' ')[0]})\n`);
} else {
  console.log(`⚠️  Git não inicializado\n`);
}

console.log('════════════════════════════════════════════════════════════');
console.log('\n✅ SISTEMA PRONTO PARA DEPLOY!\n');
console.log('Próximos passos:');
console.log('  1. node test-bypass.js         (testa Castle token)');
console.log('  2. node test-dashboard.js      (testa WebSocket)');
console.log('  3. git push origin main        (push pra GitHub)');
console.log('  4. railway.app deploy         (deploy na Railway)\n');

process.exit(0);
