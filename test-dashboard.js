#!/usr/bin/env node
'use strict';

// test-dashboard.js — testa WebSocket do dashboard.js

const http = require('http');
const fs = require('fs');

process.env.PORT = process.env.PORT || 3700;

// Load .env
const envFile = fs.readFileSync('.env.railway', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

// Start dashboard
console.log('🚀 Iniciando Dashboard...\n');
const dashboard = require('./dashboard');

// Aguardar servidor iniciar
setTimeout(async () => {
  console.log(`📡 Testando em http://localhost:${process.env.PORT}...\n`);

  // 1. Testar /health
  console.log('[1/3] Health check...');
  try {
    const result = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${process.env.PORT}/health`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }).on('error', reject);
    });

    if (result.status === 200) {
      console.log(`✅ Health check OK (${result.data})\n`);
    } else {
      console.log(`❌ Health check failed: ${result.status}\n`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`❌ Erro: ${e.message}\n`);
    process.exit(1);
  }

  // 2. Testar GET /
  console.log('[2/3] Página principal...');
  try {
    const result = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${process.env.PORT}/`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: data.substring(0, 200) }));
      }).on('error', reject);
    });

    if (result.status === 200 && result.data.length > 0) {
      console.log(`✅ Página OK (${result.data.length} bytes)\n`);
    } else {
      console.log(`❌ Página falhou: ${result.status}\n`);
    }
  } catch (e) {
    console.error(`❌ Erro: ${e.message}\n`);
  }

  // 3. WebSocket
  console.log('[3/3] WebSocket...');
  try {
    const WebSocket = require('ws');
    const ws = new WebSocket(`ws://localhost:${process.env.PORT}/`);

    ws.on('open', () => {
      console.log('✅ WebSocket conectado\n');
      ws.close();

      console.log('════════════════════════��═══════════════════════════════════');
      console.log('\n✅ DASHBOARD PRONTO!\n');
      console.log('URLs:');
      console.log(`  Dashboard: http://localhost:${process.env.PORT}/`);
      console.log(`  Health: http://localhost:${process.env.PORT}/health`);
      console.log(`  WebSocket: ws://localhost:${process.env.PORT}/\n`);

      process.exit(0);
    });

    ws.on('error', (err) => {
      console.error(`❌ WebSocket error: ${err.message}\n`);
      process.exit(1);
    });

    setTimeout(() => {
      console.error('❌ WebSocket timeout\n');
      process.exit(1);
    }, 5000);

  } catch (e) {
    console.error(`❌ Erro: ${e.message}\n`);
    process.exit(1);
  }

}, 2000);
