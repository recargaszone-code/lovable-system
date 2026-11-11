'use strict';

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3700;

// Estado
let isRunning = false;
let lastLog = '';
let lastError = '';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', isRunning, lastError: lastError || null });
});

app.get('/status', (req, res) => {
  res.json({ isRunning, lastLog, lastError });
});

app.post('/start', (req, res) => {
  if (isRunning) {
    return res.status(400).json({ error: 'Já está rodando' });
  }

  isRunning = true;
  lastLog = '';
  lastError = '';

  const numContas = 5;
  console.log(`\n🚀 Iniciando fabricador com ${numContas} contas...`);

  const proc = spawn('node', ['fabricador_api.js', String(numContas)], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', (data) => {
    const line = data.toString();
    console.log(line);
    lastLog = line;
  });

  proc.stderr.on('data', (data) => {
    const line = data.toString();
    console.error(line);
    lastError = line;
  });

  proc.on('close', (code) => {
    isRunning = false;
    console.log(`\n✅ Fabricador finalizado com código ${code}`);
  });

  proc.on('error', (err) => {
    isRunning = false;
    lastError = err.message;
    console.error('❌ Erro ao iniciar fabricador:', err);
  });

  res.json({ status: 'iniciando', contas: numContas });
});

app.listen(PORT, () => {
  console.log(`\n🌐 Servidor rodando na porta ${PORT}`);
  console.log(`   GET  /health   - status da saúde`);
  console.log(`   GET  /status   - logs recentes`);
  console.log(`   POST /start    - inicia fabricador\n`);
});
