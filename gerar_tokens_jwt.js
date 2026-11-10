/**
 * GERADOR DE TOKENS JWT LOVABLE / FIREBASE (VIA SECURETOKEN + REFRESH_TOKEN)
 * - Rota de alta velocidade sem bloqueio: usa o endpoint oficial de renovação do Firebase
 *   (securetoken.googleapis.com/v1/token?key=...)
 * - Não passa pela Cloud Function restritiva de login (zero BLOCKING_FUNCTION_ERROR_RESPONSE)
 * - Compatível com rotatividade de proxies do Proxy-Seller ou direto
 * - Lê de accounts.json / tokens_capturados.txt e regera tokens JWT válidos por 3600s para todas as contas
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');

const FIREBASE_API_KEY = 'AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw';
const TOKENS_TXT = path.join(__dirname, 'tokens_capturados.txt');
const DESKTOP_TOKENS_TXT = path.join(process.env.USERPROFILE || 'C:\\Users\\ShadezinX', 'Desktop', 'tokens_capturados.txt');
const DESKTOP_ACCOUNTS_JSON = path.join(process.env.USERPROFILE || 'C:\\Users\\ShadezinX', 'Desktop', 'accounts.json');
const PROXIES_FILE = path.join(__dirname, 'proxies.txt');

// 1. Carregar lista de proxies
function carregarProxies() {
  if (fs.existsSync(PROXIES_FILE)) {
    try {
      const list = fs.readFileSync(PROXIES_FILE, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (list.length > 0) return list;
    } catch (e) {}
  }
  const fallback = [];
  for (let port = 10000; port <= 10999; port++) {
    fallback.push(`7fec44985e3f486d:cdnCEzvtXjpyB4Tb@res.proxy-seller.com:${port}`);
  }
  return fallback;
}

const PROXIES_POOL = carregarProxies();
let PROXY_INDEX = 0;

function obterProximaProxy() {
  const p = PROXIES_POOL[PROXY_INDEX % PROXIES_POOL.length];
  PROXY_INDEX++;
  const match = p.match(/([^:]+):([^@]+)@([^:]+):(\d+)/);
  if (match) {
    return {
      usuario: match[1],
      senha: match[2],
      host: match[3],
      porta: match[4],
      url: `http://${match[1]}:${match[2]}@${match[3]}:${match[4]}`
    };
  }
  return null;
}

// 2. Renovar JWT usando Refresh Token (Bypass limpo de Cloud Function)
function renovarJwtViaRefreshToken(refreshToken, proxyConfig = null, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const postData = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(refreshToken);

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: timeoutMs
    };

    if (proxyConfig) {
      reqOptions.agent = new HttpsProxyAgent(proxyConfig.url);
    }

    const req = https.request(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.id_token) {
            resolve({
              ok: true,
              idToken: json.id_token,
              refreshToken: json.refresh_token,
              userId: json.user_id,
              expiresIn: json.expires_in
            });
          } else {
            resolve({ ok: false, error: json.error?.message || 'Token refresh falhou' });
          }
        } catch (e) {
          resolve({ ok: false, error: 'Parse error: ' + e.message });
        }
      });
    });

    req.on('error', err => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, error: 'Timeout de resposta' });
    });

    req.write(postData);
    req.end();
  });
}

// 3. Fallback: Autenticar por senha se a conta não tiver refreshToken
function autenticarPorSenha(email, password, proxyConfig = null) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ email, password, returnSecureToken: true });
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    if (proxyConfig) {
      reqOptions.agent = new HttpsProxyAgent(proxyConfig.url);
    }

    const req = https.request(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.idToken) {
            resolve({
              ok: true,
              idToken: json.idToken,
              refreshToken: json.refreshToken,
              userId: json.localId,
              expiresIn: json.expiresIn
            });
          } else {
            resolve({ ok: false, error: json.error?.message || 'Falha de senha' });
          }
        } catch (e) {
          resolve({ ok: false, error: e.message });
        }
      });
    });

    req.on('error', err => resolve({ ok: false, error: err.message }));
    req.write(postData);
    req.end();
  });
}

// 4. Carregar Mapa de Contas do Desktop accounts.json e tokens_capturados.txt
function carregarContasCompletas() {
  const mapa = new Map();

  // 1. Desktop accounts.json
  if (fs.existsSync(DESKTOP_ACCOUNTS_JSON)) {
    try {
      const lista = JSON.parse(fs.readFileSync(DESKTOP_ACCOUNTS_JSON, 'utf8'));
      if (Array.isArray(lista)) {
        for (const item of lista) {
          if (item.email) {
            mapa.set(item.email.toLowerCase().trim(), {
              email: item.email.trim(),
              password: item.password || '',
              refreshToken: item.refreshToken || null,
              token: item.token || item.accessToken || null
            });
          }
        }
      }
    } catch (e) {}
  }

  // 2. tokens_capturados.txt local
  if (fs.existsSync(TOKENS_TXT)) {
    try {
      const linhas = fs.readFileSync(TOKENS_TXT, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const linha of linhas) {
        const partes = linha.split('|');
        const email = partes[0]?.trim();
        const senha = partes[1]?.trim();
        const token = partes[2]?.trim();
        if (email && email.includes('@')) {
          const chave = email.toLowerCase();
          const existente = mapa.get(chave) || { email, password: senha, refreshToken: null, token };
          if (senha && senha !== 'sem_token') existente.password = senha;
          if (token && token.startsWith('eyJ')) existente.token = token;
          mapa.set(chave, existente);
        }
      }
    } catch (e) {}
  }

  return Array.from(mapa.values());
}

// 5. Atualizar token no disco
function atualizarTokenEmTodos(email, novoToken, novoRefresh = null) {
  // A. Desktop accounts.json
  if (fs.existsSync(DESKTOP_ACCOUNTS_JSON)) {
    try {
      const lista = JSON.parse(fs.readFileSync(DESKTOP_ACCOUNTS_JSON, 'utf8'));
      for (const item of lista) {
        if (item.email?.toLowerCase().trim() === email.toLowerCase().trim()) {
          item.token = novoToken;
          item.accessToken = novoToken;
          if (novoRefresh) item.refreshToken = novoRefresh;
          item.updatedAt = new Date().toISOString();
        }
      }
      fs.writeFileSync(DESKTOP_ACCOUNTS_JSON, JSON.stringify(lista, null, 2), 'utf8');
    } catch (e) {}
  }

  // B. tokens_capturados.txt (Local e Desktop)
  const paths = [TOKENS_TXT, DESKTOP_TOKENS_TXT, 'B:\\Lovable\\tokens_capturados.txt'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        const linhas = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean);
        const novas = linhas.map(l => {
          const partes = l.split('|');
          if (partes[0]?.toLowerCase().trim() === email.toLowerCase().trim()) {
            return `${partes[0]}|${partes[1]}|${novoToken}`;
          }
          return l;
        });
        fs.writeFileSync(p, novas.join('\n') + '\n', 'utf8');
      } catch (e) {}
    }
  }
}

// 6. Execução Principal
async function main() {
  console.clear();
  console.log('============================================================');
  console.log('   LOVABLE JWT TOKEN GENERATOR (SECURETOKEN + PROXY POOL)   ');
  console.log('============================================================\n');

  console.log(`[PROXIES] Pool carregado: ${PROXIES_POOL.length} proxies ativas`);
  const contas = carregarContasCompletas();
  console.log(`[CONTAS] Total localizadas para renovação: ${contas.length}\n`);

  if (contas.length === 0) {
    console.log('[AVISO] Nenhuma conta localizada para processamento.');
    return;
  }

  const args = process.argv.slice(2);
  let limite = contas.length;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) limite = parseInt(args[i + 1], 10);
  }

  const selecionadas = contas.slice(0, limite);
  console.log(`>>> Processando lote de ${selecionadas.length} conta(s)...\n`);

  const relatorio = { sucessos: 0, falhas: 0 };

  for (let i = 0; i < selecionadas.length; i++) {
    const conta = selecionadas[i];
    const proxy = obterProximaProxy();

    console.log('-'.repeat(60));
    console.log(`[CONTA #${i + 1}] ${conta.email}`);

    let res = null;

    // Método 1 (Ultra Rápido): Refresh Token via securetoken.googleapis.com
    if (conta.refreshToken) {
      process.stdout.write(`[AUTH] Renovando JWT via SecureToken (Proxy :${proxy.porta})... `);
      res = await renovarJwtViaRefreshToken(conta.refreshToken, proxy);
    }

    // Método 2 (Fallback): Se não tiver refresh token ou falhar, tenta login direto com senha
    if ((!res || !res.ok) && conta.password && conta.password !== 'sem_token') {
      process.stdout.write(`\n[FALLBACK] Autenticando com senha via Proxy :${proxy.porta}... `);
      res = await autenticarPorSenha(conta.email, conta.password, proxy);
    }

    if (res && res.ok) {
      console.log('SUCESSO! (Token 3600s gerado)');
      console.log(`[JWT NOVO] ${res.idToken.slice(0, 45)}...`);
      atualizarTokenEmTodos(conta.email, res.idToken, res.refreshToken);
      relatorio.sucessos++;
    } else {
      console.log(`FALHA: ${res ? res.error : 'Sem credenciais'}`);
      relatorio.falhas++;
    }

    // Intervalo de 500ms
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n============================================================');
  console.log(` FINALIZADO COM SUCESSO!`);
  console.log(` Tokens Gerados: ${relatorio.sucessos} | Falhas: ${relatorio.falhas}`);
  console.log('============================================================');
}

if (require.main === module) {
  main().catch(err => {
    console.error('[ERRO CRÍTICO]', err);
    process.exit(1);
  });
}
