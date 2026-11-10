'use strict';
const { execSync, exec } = require('child_process');
const https = require('https');
const http = require('http');

// rotaciona IP via TunnelBear (desabilita/reabilita adaptador + restart serviço)
// requer execução como admin pra controlar adaptador de rede

const TB_ADAPTERS = ['TunnelBearWireguard', 'Ethernet 4']; // WireGuard Tunnel (primary) + TAP fallback
const TB_SERVICE = 'TunnelBearWireguardService';
const TB_MAINT_SERVICE = 'TunnelBearMaintenance';
const IP_CHECK_URL = 'https://api.ipify.org?format=json';
const MAX_ROTATE_ATTEMPTS = 3;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getPublicIP() {
  return new Promise((resolve, reject) => {
    const req = https.get(IP_CHECK_URL, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data).ip); }
        catch { resolve(data.trim()); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function adapterStatus() {
  for (const name of TB_ADAPTERS) {
    try {
      const out = execSync(
        `powershell -Command "(Get-NetAdapter -Name '${name}' -ErrorAction SilentlyContinue).Status"`,
        { timeout: 10000, encoding: 'utf8' }
      ).trim();
      if (out === 'Up') return 'Up';
    } catch {}
  }
  return 'Disconnected';
}

function serviceStatus(name) {
  try {
    const out = execSync(
      `powershell -Command "(Get-Service -Name '${name}' -ErrorAction SilentlyContinue).Status"`,
      { timeout: 10000, encoding: 'utf8' }
    ).trim();
    return out; // 'Running', 'Stopped'
  } catch { return ''; }
}

function disableAdapter() {
  for (const name of TB_ADAPTERS) {
    try { execSync(`powershell -Command "Disable-NetAdapter -Name '${name}' -Confirm:\\$false -ErrorAction SilentlyContinue"`, { timeout: 15000, stdio: 'ignore' }); } catch {}
  }
  return true;
}

function enableAdapter() {
  for (const name of TB_ADAPTERS) {
    try { execSync(`powershell -Command "Enable-NetAdapter -Name '${name}' -Confirm:\\$false -ErrorAction SilentlyContinue"`, { timeout: 15000, stdio: 'ignore' }); } catch {}
  }
  return true;
}

function restartService(name) {
  try {
    execSync(`powershell -Command "Restart-Service -Name '${name}' -Force -ErrorAction SilentlyContinue"`, { timeout: 20000, stdio: 'ignore' });
    return true;
  } catch { return false; }
}

function stopService(name) {
  try {
    execSync(`powershell -Command "Stop-Service -Name '${name}' -Force -ErrorAction SilentlyContinue"`, { timeout: 15000, stdio: 'ignore' });
    return true;
  } catch { return false; }
}

function startService(name) {
  try {
    execSync(`powershell -Command "Start-Service -Name '${name}' -ErrorAction SilentlyContinue"`, { timeout: 15000, stdio: 'ignore' });
    return true;
  } catch { return false; }
}

function killTunnelBearUI() {
  try {
    execSync('taskkill /F /IM TunnelBear.UI.exe /T 2>nul', { timeout: 10000, stdio: 'ignore' });
  } catch {}
}

function launchTunnelBearUI() {
  try {
    exec('"C:\\Program Files\\TunnelBear\\TunnelBear.exe"');
  } catch {}
}

async function waitForVPN(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const status = adapterStatus();
    if (status === 'Up') return true;
    await sleep(2000);
  }
  return false;
}

async function rotateVPN() {
  let oldIP = null;
  try { oldIP = await getPublicIP(); } catch {}
  console.log(`[vpn] IP atual: ${oldIP || 'desconhecido'}`);

  for (let attempt = 1; attempt <= MAX_ROTATE_ATTEMPTS; attempt++) {
    console.log(`[vpn] rotação tentativa ${attempt}/${MAX_ROTATE_ATTEMPTS}...`);

    // method 1: restart wireguard service (fastest)
    console.log('[vpn] reiniciando serviço WireGuard...');
    stopService(TB_SERVICE);
    await sleep(2000);

    // kill UI and restart to force new server selection
    killTunnelBearUI();
    await sleep(1000);

    startService(TB_SERVICE);
    launchTunnelBearUI();
    await sleep(3000);

    // wait for adapter to come up
    console.log('[vpn] aguardando adaptador subir...');
    const up = await waitForVPN(25000);
    if (!up) {
      console.log('[vpn] adaptador não subiu, tentando via adapter toggle...');
      // method 2: disable/enable adapter
      disableAdapter();
      await sleep(3000);
      enableAdapter();
      await sleep(3000);
      launchTunnelBearUI();
      const up2 = await waitForVPN(20000);
      if (!up2) {
        console.log('[vpn] adaptador ainda não subiu');
        continue;
      }
    }

    // verify IP changed
    await sleep(3000);
    let newIP = null;
    try { newIP = await getPublicIP(); } catch {}
    console.log(`[vpn] novo IP: ${newIP || 'falhou'}`);

    if (newIP && newIP !== oldIP) {
      console.log(`[vpn] IP rotacionado: ${oldIP} → ${newIP}`);
      return { success: true, oldIP, newIP };
    }

    if (newIP) {
      console.log('[vpn] IP não mudou, tentando novamente...');
      // force full disconnect + reconnect
      stopService(TB_SERVICE);
      disableAdapter();
      await sleep(5000);
      enableAdapter();
      await sleep(2000);
      startService(TB_SERVICE);
      launchTunnelBearUI();
      await sleep(5000);
    }
  }

  // even if IP didn't change, VPN might still be up
  const finalIP = await getPublicIP().catch(() => null);
  console.log(`[vpn] IP final: ${finalIP || 'falhou'} (tentativas esgotadas)`);
  return { success: false, oldIP, newIP: finalIP };
}

async function ensureVPNConnected() {
  const status = adapterStatus();
  if (status === 'Up') {
    const ip = await getPublicIP().catch(() => null);
    console.log(`[vpn] já conectado (IP: ${ip})`);
    return true;
  }

  console.log('[vpn] VPN desconectada, tentando conectar...');
  enableAdapter();
  startService(TB_SERVICE);
  launchTunnelBearUI();

  const up = await waitForVPN(30000);
  if (up) {
    const ip = await getPublicIP().catch(() => null);
    console.log(`[vpn] conectado (IP: ${ip})`);
  } else {
    console.log('[vpn] falhou ao conectar — liga o TunnelBear manualmente');
  }
  return up;
}

async function connectVPN() {
  if (adapterStatus() === 'Up') return true;
  console.log('[vpn] conectando...');
  startService(TB_SERVICE);
  const up = await waitForVPN(20000);
  if (up) console.log('[vpn] ON');
  else console.log('[vpn] falhou ao conectar');
  return up;
}

async function disconnectVPN() {
  if (adapterStatus() !== 'Up') return true;
  console.log('[vpn] desconectando...');
  stopService(TB_SERVICE);
  await sleep(2000);
  console.log('[vpn] OFF');
  return true;
}

module.exports = { rotateVPN, ensureVPNConnected, connectVPN, disconnectVPN, getPublicIP, adapterStatus };
