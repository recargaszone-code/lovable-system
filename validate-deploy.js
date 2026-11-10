#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Validando setup do Deploy...\n');

let erros = [];
let avisos = [];

// 1. Checkar package.json
if (!fs.existsSync('package.json')) {
  erros.push('❌ package.json não encontrado');
} else {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json existe');
  if (!pkg.dependencies || !pkg.dependencies.express) {
    avisos.push('⚠️  Express não está em dependencies');
  }
}

// 2. Checkar Dockerfile
if (!fs.existsSync('Dockerfile')) {
  erros.push('❌ Dockerfile não encontrado');
} else {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  console.log('✅ Dockerfile existe');
  if (!dockerfile.includes('node:20-alpine')) {
    avisos.push('⚠️  Dockerfile não usa node:20-alpine');
  }
  if (!dockerfile.includes('chromium')) {
    avisos.push('⚠️  Dockerfile não instala chromium');
  }
}

// 3. Checkar railway.json
if (!fs.existsSync('railway.json')) {
  erros.push('❌ railway.json não encontrado');
} else {
  const railway = JSON.parse(fs.readFileSync('railway.json', 'utf8'));
  console.log('✅ railway.json existe');
  if (railway.build.builder !== 'DOCKERFILE') {
    avisos.push('⚠️  railway.json builder não é DOCKERFILE');
  }
}

// 4. Checkar arquivo de proxies/keys
if (!fs.existsSync('contas_concluidas_com_chave.txt')) {
  avisos.push('⚠️  contas_concluidas_com_chave.txt não encontrado');
} else {
  const keys = fs.readFileSync('contas_concluidas_com_chave.txt', 'utf8').split('\n').filter(l => l.trim());
  console.log(`✅ ${keys.length} chaves prontas`);
}

// 5. Checkar castle_bypass.js
if (!fs.existsSync('castle_bypass.js')) {
  erros.push('❌ castle_bypass.js não encontrado');
} else {
  const bypass = fs.readFileSync('castle_bypass.js', 'utf8');
  console.log('✅ castle_bypass.js existe');
  if (!bypass.includes('harvest_castle_token_fast')) {
    avisos.push('⚠️  castle_bypass não tem harvest_castle_token_fast');
  }
}

// 6. Checkar dashboard.js
if (!fs.existsSync('dashboard.js')) {
  erros.push('❌ dashboard.js não encontrado');
} else {
  const dashboard = fs.readFileSync('dashboard.js', 'utf8');
  console.log('✅ dashboard.js existe');
  if (!dashboard.includes('PORT')) {
    avisos.push('⚠️  dashboard não define PORT');
  }
}

// 7. Checkar fabricador_api.js
if (!fs.existsSync('fabricador_api.js')) {
  erros.push('❌ fabricador_api.js não encontrado');
} else {
  const fab = fs.readFileSync('fabricador_api.js', 'utf8');
  console.log('✅ fabricador_api.js existe');
  if (!fab.includes('PROXY_LIST')) {
    avisos.push('⚠️  fabricador_api não lê PROXY_LIST');
  }
  if (!fab.includes('getNextProxy')) {
    avisos.push('⚠️  fabricador_api não tem getNextProxy()');
  }
}

// 8. Checkar .env.railway
if (!fs.existsSync('.env.railway')) {
  avisos.push('⚠️  .env.railway não encontrado (use .env.example)');
} else {
  const env = fs.readFileSync('.env.railway', 'utf8');
  console.log('✅ .env.railway existe');
  if (!env.includes('PROXY_LIST')) {
    erros.push('❌ .env.railway sem PROXY_LIST');
  }
  if (!env.includes('CASTLE_PK')) {
    erros.push('❌ .env.railway sem CASTLE_PK');
  }
  if (!env.includes('FIREBASE_API_KEY')) {
    erros.push('❌ .env.railway sem FIREBASE_API_KEY');
  }
}

// 9. Git check
if (!fs.existsSync('.git')) {
  avisos.push('⚠️  Repositório git não inicializado');
} else {
  console.log('✅ Git repository existe');
}

// Resultado
console.log('\n' + '='.repeat(60));

if (erros.length === 0 && avisos.length === 0) {
  console.log('✅ TUDO PRONTO PARA DEPLOY!\n');
  process.exit(0);
}

if (erros.length > 0) {
  console.log('\n❌ ERROS CRÍTICOS:');
  erros.forEach(e => console.log('  ' + e));
}

if (avisos.length > 0) {
  console.log('\n⚠️  AVISOS:');
  avisos.forEach(a => console.log('  ' + a));
}

console.log('\n' + '='.repeat(60) + '\n');

process.exit(erros.length > 0 ? 1 : 0);
