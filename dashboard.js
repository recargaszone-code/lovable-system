const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 3700;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let stats = {
  total: 0,
  success: 0,
  errors: 0,
  running: false,
  startedAt: null,
  fastestTime: null,
  accounts: [],
  logs: [],
  currentCycle: 0,
  targetCount: 0,
};
let proc = null;
let proxyEnabled = true;
let vpnRotateEnabled = true;
let vpnRotateEvery = 3;
const PROXY_URL = 'http://3bf4dedb9208906a:ZmUnps7GhoLAEab8@res.proxy-seller.com:10000';

function broadcast(type, data) {
  const msg = JSON.stringify({ type, ...data });
  stats.logs.push({ type, ...data, ts: Date.now() });
  if (stats.logs.length > 2000) stats.logs = stats.logs.slice(-1500);
  for (const ws of wss.clients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

function parseLine(line) {
  if (line.includes('CICLO') && line.includes('<<<')) {
    const m = line.match(/CICLO (\d+)\/(\d+)/);
    if (m) {
      stats.currentCycle = parseInt(m[1]);
      stats.targetCount = parseInt(m[2]);
    }
  }

  if (line.includes('CONTA CRIADA + KEY EXTRAIDA')) {
    const tm = line.match(/([\d.]+)s/);
    const elapsed = tm ? parseFloat(tm[1]) : null;
    if (elapsed && (!stats.fastestTime || elapsed < stats.fastestTime)) {
      stats.fastestTime = elapsed;
    }
    stats.success++;
    stats.total++;
  }

  if (line.includes('email:') && line.includes('@') && !line.includes('verificação') && !line.includes('SmailPro') && !line.includes('signup:') && !line.includes('digitado')) {
    const em = line.match(/email:\s*(\S+@\S+)/);
    if (em && !stats.accounts.find(a => a.email === em[1])) {
      stats.accounts.push({ email: em[1], key: null, time: null });
    }
  }

  if (line.includes('key:') && line.includes('sk_')) {
    const km = line.match(/key:\s*(sk_\S+)/);
    if (km && stats.accounts.length > 0) {
      const last = stats.accounts[stats.accounts.length - 1];
      last.key = km[1];
    }
  }

  if (line.includes('ERRO ciclo')) {
    stats.errors++;
    stats.total++;
  }

  if (line.includes('LOTE COMPLETO')) {
    stats.running = false;
    broadcast('status', { running: false });
  }

  if (line.includes('FATAL')) {
    stats.running = false;
    broadcast('status', { running: false });
  }
}

function startFabricador(count) {
  if (proc) return;
  stats = { total: 0, success: 0, errors: 0, running: true, startedAt: Date.now(), fastestTime: null, accounts: [], logs: [], currentCycle: 0, targetCount: count };
  broadcast('status', { running: true });
  broadcast('clear', {});

  const env = {
    ...process.env,
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    LOVABLE_PROXY: proxyEnabled ? PROXY_URL : 'none',
    VPN_ROTATE: vpnRotateEnabled ? '1' : '0',
    VPN_ROTATE_EVERY: String(vpnRotateEvery),
  };

  proc = spawn('node', ['fabricador_api.js', String(count)], {
    cwd: path.resolve(__dirname),
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let buffer = '';
  proc.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      parseLine(line);
      broadcast('log', { level: 'info', text: line });
    }
  });

  proc.stderr.on('data', (chunk) => {
    const lines = chunk.toString().split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      if (line.includes('NODE_TLS_REJECT')) continue;
      parseLine(line);
      broadcast('log', { level: 'error', text: line });
    }
  });

  proc.on('close', (code) => {
    stats.running = false;
    proc = null;
    broadcast('log', { level: code === 0 ? 'info' : 'error', text: `processo finalizado (code ${code})` });
    broadcast('status', { running: false });
  });
}

function stopFabricador() {
  if (!proc) return;
  proc.kill('SIGTERM');
  setTimeout(() => { if (proc) proc.kill('SIGKILL'); }, 5000);
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', stats: { ...stats, logs: undefined }, logs: stats.logs.slice(-200), proxyEnabled, vpnRotateEnabled, vpnRotateEvery }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      if (msg.action === 'start') startFabricador(msg.count || 1);
      if (msg.action === 'stop') stopFabricador();
      if (msg.action === 'toggle_proxy') {
        proxyEnabled = !!msg.enabled;
        broadcast('proxy_status', { enabled: proxyEnabled });
      }
      if (msg.action === 'toggle_vpn') {
        vpnRotateEnabled = !!msg.enabled;
        broadcast('vpn_status', { enabled: vpnRotateEnabled, every: vpnRotateEvery });
      }
      if (msg.action === 'set_vpn_every') {
        vpnRotateEvery = Math.max(1, Math.min(20, parseInt(msg.value) || 3));
        broadcast('vpn_status', { enabled: vpnRotateEnabled, every: vpnRotateEvery });
      }
    } catch {}
  });
});

// Health check para Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'lovable-dashboard'
  });
});

app.get('/', (req, res) => {
  res.send(DASHBOARD_HTML);
});

app.get('/api/stats', (req, res) => {
  res.json({ ...stats, logs: undefined });
});

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lovable Fabricador</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; color: #e0e0e0; font-family: 'Segoe UI', monospace; min-height: 100vh; }

  .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 20px 30px; border-bottom: 1px solid #2a2a4a; display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 22px; color: #00d4ff; font-weight: 600; }
  .header .status { padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
  .status.idle { background: #1a2a1a; color: #4a9; border: 1px solid #2a4a2a; }
  .status.running { background: #2a1a1a; color: #f80; border: 1px solid #4a2a1a; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

  .controls { padding: 20px 30px; display: flex; gap: 15px; align-items: center; }
  .controls input { background: #12121f; border: 1px solid #2a2a4a; color: #fff; padding: 10px 15px; border-radius: 8px; width: 120px; font-size: 14px; }
  .controls input:focus { outline: none; border-color: #00d4ff; }
  .btn { padding: 10px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-start { background: linear-gradient(135deg, #00d4ff, #0090ff); color: #000; }
  .btn-start:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0,212,255,0.3); }
  .btn-start:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-stop { background: #ff3355; color: #fff; }
  .btn-stop:hover { background: #ff1133; }
  .btn-stop:disabled { opacity: 0.3; cursor: not-allowed; }

  .proxy-toggle { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .proxy-toggle label { font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; }
  .proxy-toggle .badge { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; transition: all 0.3s; }
  .proxy-toggle .badge.on { background: #0a4; color: #fff; border: 1px solid #0c6; }
  .proxy-toggle .badge.off { background: #333; color: #888; border: 1px solid #555; }
  .switch { position: relative; width: 44px; height: 24px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .switch .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #333; border-radius: 24px; transition: 0.3s; }
  .switch .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.3s; }
  .switch input:checked + .slider { background: #0a4; }
  .switch input:checked + .slider:before { transform: translateX(20px); }

  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 0 30px 20px; }
  .card { background: linear-gradient(135deg, #12121f 0%, #1a1a2e 100%); border: 1px solid #2a2a4a; border-radius: 12px; padding: 20px; }
  .card .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .card .value { font-size: 32px; font-weight: 700; }
  .card .value.success { color: #0f8; }
  .card .value.error { color: #f44; }
  .card .value.time { color: #ff0; }
  .card .value.total { color: #00d4ff; }

  .main { display: grid; grid-template-columns: 1fr 380px; gap: 15px; padding: 0 30px 30px; height: calc(100vh - 320px); min-height: 400px; }

  .logs-panel { background: #08080f; border: 1px solid #2a2a4a; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
  .logs-header { padding: 12px 16px; border-bottom: 1px solid #2a2a4a; font-size: 13px; color: #888; display: flex; justify-content: space-between; }
  .logs-body { flex: 1; overflow-y: auto; padding: 10px 16px; font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: 12.5px; line-height: 1.6; }
  .logs-body::-webkit-scrollbar { width: 6px; }
  .logs-body::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  .log-line { white-space: pre-wrap; word-break: break-all; }
  .log-line.info { color: #b0b0c0; }
  .log-line.error { color: #ff5566; }
  .log-line.success { color: #0f8; font-weight: 600; }
  .log-line.step { color: #00d4ff; }

  .accounts-panel { background: #08080f; border: 1px solid #2a2a4a; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
  .accounts-header { padding: 12px 16px; border-bottom: 1px solid #2a2a4a; font-size: 13px; color: #888; }
  .accounts-body { flex: 1; overflow-y: auto; padding: 10px; }
  .account-card { background: #12121f; border: 1px solid #1a2a1a; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; }
  .account-card .email { color: #00d4ff; font-size: 13px; font-weight: 600; }
  .account-card .key { color: #0f8; font-size: 11px; font-family: monospace; margin-top: 4px; word-break: break-all; }
  .account-card .pending { color: #f80; font-size: 11px; }

  .progress-bar { height: 3px; background: #1a1a2e; margin: 0 30px 15px; border-radius: 2px; overflow: hidden; }
  .progress-bar .fill { height: 100%; background: linear-gradient(90deg, #00d4ff, #0f8); transition: width 0.5s; border-radius: 2px; }
</style>
</head>
<body>
  <div class="header">
    <h1>LOVABLE FABRICADOR</h1>
    <div class="status idle" id="statusBadge">PARADO</div>
  </div>

  <div class="controls">
    <label style="color:#888;font-size:13px;">Quantidade:</label>
    <input type="number" id="countInput" value="1" min="1" max="100">
    <button class="btn btn-start" id="btnStart" onclick="startService()">Começar Serviço</button>
    <button class="btn btn-stop" id="btnStop" onclick="stopService()" disabled>Parar</button>
    <div class="proxy-toggle">
      <label>Proxy</label>
      <label class="switch"><input type="checkbox" id="proxySwitch" checked onchange="toggleProxy(this.checked)"><span class="slider"></span></label>
      <span class="badge on" id="proxyBadge">PROXY ROTATIVO</span>
    </div>
    <div class="proxy-toggle" style="margin-left:15px;">
      <label>VPN Rotate</label>
      <label class="switch"><input type="checkbox" id="vpnSwitch" checked onchange="toggleVPN(this.checked)"><span class="slider"></span></label>
      <span class="badge on" id="vpnBadge">A CADA 3</span>
      <select id="vpnEvery" onchange="setVpnEvery(this.value)" style="background:#222;color:#fff;border:1px solid #555;border-radius:6px;padding:4px 8px;font-size:12px;">
        <option value="2">2</option><option value="3" selected>3</option><option value="5">5</option><option value="7">7</option><option value="10">10</option>
      </select>
    </div>
  </div>

  <div class="progress-bar"><div class="fill" id="progressFill" style="width:0%"></div></div>

  <div class="grid">
    <div class="card"><div class="label">Sucessos</div><div class="value success" id="statSuccess">0</div></div>
    <div class="card"><div class="label">Erros</div><div class="value error" id="statErrors">0</div></div>
    <div class="card"><div class="label">Menor Tempo</div><div class="value time" id="statFastest">--</div></div>
    <div class="card"><div class="label">Progresso</div><div class="value total" id="statProgress">0/0</div></div>
  </div>

  <div class="main">
    <div class="logs-panel">
      <div class="logs-header">
        <span>Logs em tempo real</span>
        <span id="logCount">0 linhas</span>
      </div>
      <div class="logs-body" id="logsBody"></div>
    </div>
    <div class="accounts-panel">
      <div class="accounts-header">Contas Criadas</div>
      <div class="accounts-body" id="accountsBody"></div>
    </div>
  </div>

<script>
let ws = null, logLines = 0, autoScroll = true, wsReady = false;
const logsBody = document.getElementById('logsBody');

function connect() {
  ws = new WebSocket('ws://' + location.host);
  ws.onopen = () => { wsReady = true; };
  ws.onclose = () => { wsReady = false; setTimeout(connect, 2000); };
  ws.onerror = () => { wsReady = false; };
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'init') {
      updateStats(msg.stats);
      msg.logs.forEach(l => { if (l.type === 'log') addLog(l.level, l.text); });
      updateAccounts(msg.stats.accounts || []);
      if (msg.proxyEnabled !== undefined) updateProxyBadge(msg.proxyEnabled);
      if (msg.vpnRotateEnabled !== undefined) updateVpnBadge(msg.vpnRotateEnabled, msg.vpnRotateEvery);
    }
    if (msg.type === 'log') addLog(msg.level, msg.text);
    if (msg.type === 'status') updateRunning(msg.running);
    if (msg.type === 'proxy_status') updateProxyBadge(msg.enabled);
    if (msg.type === 'vpn_status') updateVpnBadge(msg.enabled, msg.every);
    if (msg.type === 'clear') { logsBody.innerHTML = ''; logLines = 0; }
  };
}

function addLog(level, text) {
  const div = document.createElement('div');
  div.className = 'log-line';

  if (text.includes('CONTA CRIADA') || text.includes('KEY CAPTURADA') || text.includes('LOTE COMPLETO')) {
    div.className += ' success';
    parseStats(text);
  } else if (text.includes('ERRO') || text.includes('FATAL') || level === 'error') {
    div.className += ' error';
    parseStats(text);
  } else if (/\\[\\d+\\/7\\]/.test(text)) {
    div.className += ' step';
  } else {
    div.className += ' info';
  }

  div.textContent = text;
  logsBody.appendChild(div);
  logLines++;
  document.getElementById('logCount').textContent = logLines + ' linhas';

  if (autoScroll) logsBody.scrollTop = logsBody.scrollHeight;
}

function parseStats(text) {
  if (text.includes('CONTA CRIADA')) {
    const tm = text.match(/([\\d.]+)s/);
    const el = tm ? parseFloat(tm[1]) : null;
    const cur = document.getElementById('statFastest').textContent;
    if (el && (cur === '--' || el < parseFloat(cur))) {
      document.getElementById('statFastest').textContent = el.toFixed(1) + 's';
    }
    const s = parseInt(document.getElementById('statSuccess').textContent) + 1;
    document.getElementById('statSuccess').textContent = s;
    updateProgress();
  }
  if (text.includes('ERRO ciclo')) {
    const e = parseInt(document.getElementById('statErrors').textContent) + 1;
    document.getElementById('statErrors').textContent = e;
  }
  if (text.includes('email:') && text.includes('@') && !text.includes('verificação') && !text.includes('SmailPro') && !text.includes('signup:')) {
    const em = text.match(/email:\\s*(\\S+@\\S+)/);
    if (em) addAccount(em[1]);
  }
  if (text.includes('key:') && text.includes('sk_')) {
    const km = text.match(/key:\\s*(sk_\\S+)/);
    if (km) updateLastAccountKey(km[1]);
  }
}

function addAccount(email) {
  const body = document.getElementById('accountsBody');
  const card = document.createElement('div');
  card.className = 'account-card';
  card.id = 'acc-' + email.replace(/[^a-z0-9]/gi, '_');
  card.innerHTML = '<div class="email">' + email + '</div><div class="pending">extraindo key...</div>';
  body.insertBefore(card, body.firstChild);
}

function updateLastAccountKey(key) {
  const cards = document.querySelectorAll('.account-card');
  if (cards.length > 0) {
    const pending = cards[0].querySelector('.pending');
    if (pending) pending.remove();
    let keyDiv = cards[0].querySelector('.key');
    if (!keyDiv) { keyDiv = document.createElement('div'); keyDiv.className = 'key'; cards[0].appendChild(keyDiv); }
    keyDiv.textContent = key;
    cards[0].style.borderColor = '#0f8';
  }
}

function updateStats(s) {
  document.getElementById('statSuccess').textContent = s.success || 0;
  document.getElementById('statErrors').textContent = s.errors || 0;
  document.getElementById('statFastest').textContent = s.fastestTime ? s.fastestTime.toFixed(1) + 's' : '--';
  document.getElementById('statProgress').textContent = (s.currentCycle || 0) + '/' + (s.targetCount || 0);
  updateRunning(s.running);
  updateAccounts(s.accounts || []);
}

function updateAccounts(accounts) {
  const body = document.getElementById('accountsBody');
  body.innerHTML = '';
  for (const a of accounts.reverse()) {
    const card = document.createElement('div');
    card.className = 'account-card';
    if (a.key) card.style.borderColor = '#0f8';
    card.innerHTML = '<div class="email">' + a.email + '</div>' + (a.key ? '<div class="key">' + a.key + '</div>' : '<div class="pending">extraindo key...</div>');
    body.appendChild(card);
  }
}

function updateProgress() {
  const s = parseInt(document.getElementById('statSuccess').textContent);
  const e = parseInt(document.getElementById('statErrors').textContent);
  const target = parseInt((document.getElementById('statProgress').textContent.split('/')[1]) || 0);
  const done = s + e;
  document.getElementById('statProgress').textContent = done + '/' + target;
  const pct = target > 0 ? (done / target * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
}

function updateRunning(running) {
  const badge = document.getElementById('statusBadge');
  const btnStart = document.getElementById('btnStart');
  const btnStop = document.getElementById('btnStop');
  if (running) {
    badge.className = 'status running'; badge.textContent = 'RODANDO';
    btnStart.disabled = true; btnStop.disabled = false;
  } else {
    badge.className = 'status idle'; badge.textContent = 'PARADO';
    btnStart.disabled = false; btnStop.disabled = true;
  }
}

function startService() {
  if (!wsReady) {
    addLog('error', '[dashboard] websocket desconectado, reconectando...');
    connect();
    setTimeout(() => { if (wsReady) startService(); }, 1500);
    return;
  }
  const count = parseInt(document.getElementById('countInput').value) || 1;
  document.getElementById('statSuccess').textContent = '0';
  document.getElementById('statErrors').textContent = '0';
  document.getElementById('statFastest').textContent = '--';
  document.getElementById('statProgress').textContent = '0/' + count;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('accountsBody').innerHTML = '';
  logsBody.innerHTML = ''; logLines = 0;
  ws.send(JSON.stringify({ action: 'start', count: count }));
}

function stopService() {
  if (wsReady) ws.send(JSON.stringify({ action: 'stop' }));
}

function toggleProxy(enabled) {
  if (wsReady) ws.send(JSON.stringify({ action: 'toggle_proxy', enabled }));
  updateProxyBadge(enabled);
}

function updateProxyBadge(enabled) {
  const badge = document.getElementById('proxyBadge');
  const sw = document.getElementById('proxySwitch');
  sw.checked = enabled;
  if (enabled) {
    badge.className = 'badge on'; badge.textContent = 'PROXY ROTATIVO';
  } else {
    badge.className = 'badge off'; badge.textContent = 'SEM PROXY';
  }
}

function toggleVPN(enabled) {
  if (wsReady) ws.send(JSON.stringify({ action: 'toggle_vpn', enabled }));
  updateVpnBadge(enabled);
}

function setVpnEvery(val) {
  if (wsReady) ws.send(JSON.stringify({ action: 'set_vpn_every', value: parseInt(val) }));
  updateVpnBadge(document.getElementById('vpnSwitch').checked, parseInt(val));
}

function updateVpnBadge(enabled, every) {
  const badge = document.getElementById('vpnBadge');
  const sw = document.getElementById('vpnSwitch');
  const sel = document.getElementById('vpnEvery');
  sw.checked = enabled;
  if (every !== undefined) sel.value = String(every);
  if (enabled) {
    badge.className = 'badge on'; badge.textContent = 'A CADA ' + (every || sel.value);
  } else {
    badge.className = 'badge off'; badge.textContent = 'VPN OFF';
  }
}

logsBody.addEventListener('scroll', () => {
  autoScroll = (logsBody.scrollHeight - logsBody.scrollTop - logsBody.clientHeight) < 50;
});

connect();
</script>
</body>
</html>`;

server.listen(PORT, () => {
  console.log(`dashboard: http://localhost:${PORT}`);
});
