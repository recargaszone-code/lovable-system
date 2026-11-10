// Chrome real (chrome.exe instalado) + puppeteer-core oficial, sem forks/patches.
// O navegador em si já não carrega nenhum binário de automação (patchright/playwright
// trocam o próprio chromium); aqui só conectamos via CDP a um Chrome normal já de pé.
const puppeteer = require('puppeteer-core');
const readline = require('readline');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const http = require('http');
const { testarConexaoGmail, obterEstadoAntes, obterUltimoCodigoLovable, aguardarLinkVerificacao } = require('./gmail_helper');
const { clicarHumano, clicarHumanoPorSeletor, clicarHumanoPorTexto, preencherNomeComConfirmacao, aguardarEClicarPorTexto, simularPresencaHumanaInicial, digitarHumanoAleatorio } = require('./humanize');
const { gerarPerfilFingerprint, aplicarFingerprint } = require('./fingerprint');
const CONFIG_PATH = path.join(__dirname, 'config.json');


const contas = [
  { id: 1, nome: 'Eugênio (Você)', email: 'eugenio@obsidien.online' },
  { id: 2, nome: 'Marta (Esposa)', email: 'marta@obsidien.online' },
  { id: 3, nome: 'Alfredo (Filho)', email: 'alfredo@obsidien.online' },
  { id: 4, nome: 'Dino', email: 'dino@obsidien.online' }
];

 const PRIMEIROS_NOMES = [
      'Lucas', 'Gabriel', 'Mateus', 'Felipe', 'Rafael', 'Bruno', 'Leonardo',
      'Thiago', 'Rodrigo', 'Daniel', 'Marcos', 'Andre', 'Eduardo', 'Caio',
      'Vitor', 'Gustavo', 'Diego', 'Renato', 'Danilo', 'Arthur', 'Samuel',
      'Bernardo', 'Heitor', 'Davi', 'Lorenzo', 'Theo', 'Benjamin', 'Pedro',
      'Alex', 'Hugo', 'Enzo', 'Joao', 'Marcelo', 'Murilo', 'Otavio',
      'Juliana', 'Camila', 'Beatriz', 'Mariana', 'Larissa', 'Leticia',
      'Fernanda', 'Aline', 'Amanda', 'Bruna', 'Carolina', 'Debora',
      'Natalia', 'Vanessa', 'Jessica', 'Bianca', 'Patricia', 'Renata'
    ];

    const SOBRENOMES = [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
      'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
      'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha',
      'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado',
      'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Goncalves', 'Santana', 'Teixeira'
    ];

       // Gera e-mails no formato humano (ex: martaalmeida@obsidien.online)
    function gerarContasAleatorias(qtd) {
      const lista = [];
      const emailsGerados = new Set();

      for (let i = 1; i <= qtd; i++) {
        const primeiro = PRIMEIROS_NOMES[Math.floor(Math.random() * PRIMEIROS_NOMES.length)];
        const sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
        const nomeCompleto = `${primeiro} ${sobrenome}`;

        // Normaliza para letras minúsculas sem acentos
        const baseEmail = `${primeiro}${sobrenome}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,
  '');

        // Se por acaso repetir a mesma combinação, adiciona um número no final para não colidir
        let emailFinal = `${baseEmail}@obsidien.online`;
        if (emailsGerados.has(emailFinal)) {
          emailFinal = `${baseEmail}${Math.floor(Math.random() * 89 + 10)}@obsidien.online`;
        }
        emailsGerados.add(emailFinal);

        lista.push({
          id: i,
          nome: nomeCompleto,
          email: emailFinal,
          senha: gerarSenhaAleatoria()
        });
      }
      return lista;
    }
function gerarSenhaAleatoria() {
  const maiusculas = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const minusculas = 'abcdefghjkmnpqrstuvwxyz';
  const numeros = '23456789';
  const simbolos = '!@#$%&*';
  const todos = maiusculas + minusculas + numeros + simbolos;

  // Garante pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 símbolo (requisitos Lovable)
  let senha = [
    maiusculas[crypto.randomInt(0, maiusculas.length)],
    minusculas[crypto.randomInt(0, minusculas.length)],
    numeros[crypto.randomInt(0, numeros.length)],
    simbolos[crypto.randomInt(0, simbolos.length)]
  ];

  // Completa até 12 caracteres
  for (let i = 0; i < 8; i++) {
    senha.push(todos[crypto.randomInt(0, todos.length)]);
  }

  // Embaralha
  return senha.sort(() => Math.random() - 0.5).join('');
}

const ultimaPosicaoMouse = new WeakMap();

function curvaBezier(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
  const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
  return { x, y };
}

// Checa se a porta de debug do Chrome já está respondendo
function aguardarPortaDebug(porta, timeoutMs = 45000) {
  const inicio = Date.now();
  return new Promise((resolve, reject) => {
    const tentar = () => {
      const req = http.get(`http://127.0.0.1:${porta}/json/version`, res => {
        res.resume();
        if (res.statusCode === 200) return resolve(true);
        retry();
      });
      req.on('error', retry);
      req.setTimeout(1000, () => { req.destroy(); retry(); });
    };
    const retry = () => {
      if (Date.now() - inicio > timeoutMs) return reject(new Error('Timeout aguardando porta de debug do Chrome'));
      setTimeout(tentar, 500);
    };
    tentar();
  });
}

// Carrega pool de proxies de proxies.txt se existir
const PROXIES_FILE = path.join(__dirname, 'proxies.txt');
function carregarProxies() {
  if (fs.existsSync(PROXIES_FILE)) {
    try {
      return fs.readFileSync(PROXIES_FILE, 'utf-8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    } catch(e) {}
  }
  return [];
}
const PROXIES_POOL = carregarProxies();
let PROXY_INDEX = 0;

function obterProximaProxy() {
  if (PROXIES_POOL.length === 0) return null;
  const p = PROXIES_POOL[PROXY_INDEX % PROXIES_POOL.length];
  PROXY_INDEX++;
  // formato: 7fec44985e3f486d:cdnCEzvtXjpyB4Tb@res.proxy-seller.com:10000
  const match = p.match(/([^:]+):([^@]+)@([^:]+):(\d+)/);
  if (match) {
    return {
      usuario: match[1],
      senha: match[2],
      host: match[3],
      porta: match[4],
      serverArg: `http://${match[3]}:${match[4]}`
    };
  }
  return null;
}

// Sobe o Chrome como um processo independente (igual abrir manualmente),
// e depois conecta via CDP. Evita as flags de automação que puppeteer.launch injeta.
async function abrirChromeNormal(proxyConfig = null) {
  const porta = crypto.randomInt(9222, 9999);
  const pastaTempChrome = path.join(os.tmpdir(), `chrome_temp_${Date.now()}_${crypto.randomInt(100000, 999999)}`);

  const chromeArgs = [
    `--user-data-dir=${pastaTempChrome}`,
    `--remote-debugging-port=${porta}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--no-sandbox',
    '--disable-extensions',
    '--disable-default-apps'
  ];

  if (proxyConfig && proxyConfig.serverArg) {
    chromeArgs.push(`--proxy-server=${proxyConfig.serverArg}`);
    console.log(`[PROXY] Roteando Chrome via Proxy Seller: ${proxyConfig.serverArg}`);
  }

  console.log(`[CHROME] Abrindo Chrome normal (perfil: ${pastaTempChrome}, porta debug: ${porta})...`);

  const chromeProc = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    chromeArgs,
    { detached: true, stdio: 'ignore' }
  );
  chromeProc.unref();

  await aguardarPortaDebug(porta);

  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${porta}`,
    defaultViewport: null
  });

  return { browser, pastaTempChrome, chromeProc };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar(texto) {
  return new Promise(resolve => rl.question(texto, resolve));
}

function carregarConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (e) {}
  }
  return { gmailUser: 'developermax2maker@gmail.com', gmailAppPassword: 'cubklsjqsbzrlkwz' };
}

const DESKTOP_ACCOUNTS_JSON = 'C:\\Users\\ShadezinX\\Desktop\\accounts.json';
const TOKENS_TXT = path.join(__dirname, 'tokens_capturados.txt');
const DESKTOP_TOKENS_TXT = 'C:\\Users\\ShadezinX\\Desktop\\tokens_capturados.txt';

function salvarContaComToken(email, token, refreshToken, nome, senha) {
  // 1. Atualiza accounts.json no Desktop
  let contasJson = [];
  if (fs.existsSync(DESKTOP_ACCOUNTS_JSON)) {
    try {
      contasJson = JSON.parse(fs.readFileSync(DESKTOP_ACCOUNTS_JSON, 'utf-8'));
      if (!Array.isArray(contasJson)) contasJson = [];
    } catch (e) {
      contasJson = [];
    }
  }

  // Remove registro anterior com o mesmo e-mail para atualizar
  contasJson = contasJson.filter(c => c.email.toLowerCase() !== email.toLowerCase());

  contasJson.push({
    email: email,
    name: nome,
    password: senha,
    token: token || null,
    accessToken: token || null,
    refreshToken: refreshToken || null,
    createdAt: new Date().toISOString()
  });

  try {
    fs.writeFileSync(DESKTOP_ACCOUNTS_JSON, JSON.stringify(contasJson, null, 2), 'utf-8');
    console.log(`\n[ARQUIVO] Conta salva com sucesso no Desktop -> accounts.json (Senha salva!)`);
  } catch (err) {
    console.log(`\n[ERRO] Falha ao gravar accounts.json no Desktop: ${err.message}`);
  }

  // 2. Salva no formato texto simples: email|senha|token
  const linha = `${email}|${senha}|${token || 'sem_token'}\n`;
  try {
    fs.appendFileSync(TOKENS_TXT, linha, 'utf-8');
  } catch (e) {}
  try {
    fs.appendFileSync(DESKTOP_TOKENS_TXT, linha, 'utf-8');
    console.log(`[ARQUIVO] Salvo com sucesso no Desktop -> tokens_capturados.txt`);
  } catch (e) {}
}

async function processarConta(browser, conta, config, proxyConfig = null) {
  const senhaConta = conta.senha || gerarSenhaAleatoria();

  console.log('\n' + '='.repeat(60));
  console.log(`>>> PROCESSANDO CONTA: ${conta.nome}`);
  console.log(`>>> E-MAIL: ${conta.email}`);
  console.log(`>>> SENHA ALEATÓRIA GERADA: ${senhaConta}`);
  if (proxyConfig) {
    console.log(`>>> PROXY ATIVA: ${proxyConfig.serverArg}`);
  }
  console.log('='.repeat(60));

  console.log(`[IMAP] Verificando estado inicial da caixa para ${conta.email}...`);
  const estadoAntes = await obterEstadoAntes(config.gmailUser, config.gmailAppPassword, conta.email);
  console.log(`[IMAP] Maior UID anterior: Geral = ${estadoAntes.maxUidGeral} | Conta = ${estadoAntes.maxUidDestino}`);

  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  const perfilFingerprint = gerarPerfilFingerprint();
  console.log(`[FINGERPRINT] ${perfilFingerprint.nucleos} núcleos, ${perfilFingerprint.memoria}GB RAM, GPU "${perfilFingerprint.gpu.renderer}", tela ${perfilFingerprint.resolucao.width}x${perfilFingerprint.resolucao.height}`);
  await aplicarFingerprint(page, perfilFingerprint);

  if (proxyConfig && proxyConfig.usuario && proxyConfig.senha) {
    await page.authenticate({ username: proxyConfig.usuario, password: proxyConfig.senha });
  }

  try {

  console.log('\n[1/6] Acessando a página de login do Lovable (escala normal 100%)...');
  await page.goto('https://lovable.dev/signup', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  // Fecha banner de cookies se existir
  try {
    const botaoOk = await page.$('button::-p-text(OK)');
    if (botaoOk) await clicarHumano(page, botaoOk);
  } catch (e) {}

  // 1. Digita o e-mail
  try {
    await page.waitForSelector('input#email', { timeout: 10000 });
    console.log(`[2/6] Digitando o e-mail: ${conta.email}...`);
    const campoEmail = await page.$('input#email');
    await clicarHumano(page, campoEmail);
    await new Promise(r => setTimeout(r, crypto.randomInt(250, 600)));
      await digitarHumanoAleatorio(page, conta.email);

    // Delay antes de continuar
    await new Promise(r => setTimeout(r, 1000));

    console.log('[3/6] Clicando no botão "Continue"...');
    await clicarHumanoPorSeletor(page, 'button[type="submit"]');
  } catch (err) {
    console.log('[!] Nota: e-mail já preenchido ou falha:', err.message);
  }

  // 2. Digita a senha e clica em "Create your account"
  console.log('[4/6] Aguardando campo de senha...');
  let timestampEnvio = Date.now();

  try {
    await page.waitForSelector('input#password', { timeout: 15000 });
    console.log(`[4/6] Digitando a senha gerada: ${senhaConta}...`);
    await new Promise(r => setTimeout(r, 1000));
    const campoSenha = await page.$('input#password');
    await clicarHumano(page, campoSenha);
    await new Promise(r => setTimeout(r, crypto.randomInt(300, 700)));
      await digitarHumanoAleatorio(page, senhaConta);

    // Dispara eventos para o React reconhecer a senha digitada
    await page.evaluate(() => {
      const p = document.querySelector('input#password');
      if (p) {
        p.dispatchEvent(new Event('input', { bubbles: true }));
        p.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Aguarda o Cloudflare Turnstile resolver automaticamente (delay de 8 segundos)
    console.log('\n[5/6] Aguardando 8 segundos para o Cloudflare validar...');
    for (let s = 8; s > 0; s--) {
      process.stdout.write(`\r[-] Validação Cloudflare: ${s}s restantes... `);
      await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\n[-] Tempo de validação concluído!');

    // Tenta clicar no botão até a tela mudar
    console.log('\n[+] Clicando no botão de cadastro ("Create your account" ou "Log in")...');
    
    let submetido = false;
    for (let tentativa = 1; tentativa <= 5; tentativa++) {
      timestampEnvio = Date.now(); // Marca o timestamp exato do envio

      const cliqueOk = await clicarHumanoPorSeletor(page, 'button[type="submit"]');
      if (!cliqueOk) {
        await page.keyboard.press('Enter');
      }

      // Aguarda 3 segundos para ver se o formulário saiu da tela
      await new Promise(r => setTimeout(r, 3000));

      const aindaNaTelaSenha = await page.evaluate(() => !!document.querySelector('input#password'));
      if (!aindaNaTelaSenha) {
        submetido = true;
        console.log('[-] FORMULÁRIO ENVIADO COM SUCESSO! A página avançou.');
        break;
      } else {
        console.log(`[-] Tentativa ${tentativa}: formulário ainda na tela, aguardando...`);
      }
    }

    if (!submetido) {
      console.log('\n' + '!'.repeat(60));
      console.log('>>> ATENÇÃO: O robô tentou clicar, mas a página ainda está na tela de senha.');
      console.log('>>> Se aparecer o botão "Create your account" ou um Captcha na tela,');
      console.log('>>> dê um clique nele no navegador agora!');
      console.log('!'.repeat(60));

      // Fica monitorando até a tela de senha finalmente sumir (máximo 60s)
      try {
        await page.waitForFunction(() => !document.querySelector('input#password'), { timeout: 60000 });
        timestampEnvio = Date.now();
        console.log('\n[-] Confirmado! A tela avançou.');
      } catch (e) {
        console.log('[!] Continuando para a checagem do Gmail...');
      }
    }

  } catch (err) {
    console.log('[!] Erro na etapa da senha:', err.message);
  }

  console.log('\n' + '-'.repeat(60));
  console.log('>>> CONTA PROCESSADA NO SITE! AGORA BUSCANDO NO GMAIL...');
  console.log('-'.repeat(60));

  // 3. Aguarda o NOVO link chegar no Gmail
  console.log('\n[6/6] Monitorando o Gmail para capturar a ÚLTIMA mensagem de verificação recebida...');
  const linkAtivacao = await aguardarLinkVerificacao(
    config.gmailUser,
    config.gmailAppPassword,
    conta.email,
    estadoAntes,
    120
  );

  if (linkAtivacao) {
    console.log('\n' + '*'.repeat(60));
    console.log('>>> ÚLTIMO LINK DE ATIVAÇÃO CAPTURADO!');
    console.log(`>>> ${linkAtivacao}`);
    console.log('>>> ABRINDO O LINK EM UMA NOVA ABA DO NAVEGADOR...');
    console.log('*'.repeat(60));

    // Abre o link de verificação em uma NOVA ABA
    const novaAba = await context.newPage();
    await aplicarFingerprint(novaAba, perfilFingerprint);
    if (proxyConfig && proxyConfig.usuario && proxyConfig.senha) {
      try { await novaAba.authenticate({ username: proxyConfig.usuario, password: proxyConfig.senha }); } catch(e) {}
    }
    await novaAba.bringToFront();
    await novaAba.goto(linkAtivacao, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    process.stdout.write('\x07');
    console.log(`\n>>> NOVA ABA CARREGADA COM SUCESSO! Iniciando Onboarding...`);

    // 1. Primeiro botão "Next" (com delay de 6s pra humanizar) na nova aba
    console.log('\n[-] Aguardando 6 segundos para humanizar...');
    await new Promise(r => setTimeout(r, 6000));

    console.log('[ONBOARDING 1/3] Clicando no primeiro botão "Next"...');
    await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);

    // 2. Input fullName (com delay de 6s pra humanizar) na nova aba
    console.log('\n[-] Aguardando 6 segundos para humanizar...');
    await new Promise(r => setTimeout(r, 6000));

    const nomeLimpo = conta.nome.replace(/\s*\(.*?\)/, '').trim();
    console.log(`[ONBOARDING 2/3] Digitando o nome "${nomeLimpo}" no campo de nome...`);
    const nomeConfirmado = await preencherNomeComConfirmacao(novaAba, nomeLimpo);
    if (nomeConfirmado) {
      console.log(`[ONBOARDING 2/3] Nome confirmado no campo: "${nomeConfirmado}"`);
    } else {
      console.log('[!] AVISO: não confirmei o preenchimento do nome.');
    }

    // Clica em Next após digitar o nome (com delay de 6s pra humanizar) na nova aba
    console.log('\n[-] Aguardando 6 segundos para humanizar...');
    await new Promise(r => setTimeout(r, 6000));

    if (nomeConfirmado) {
      console.log('[-] Clicando no botão "Next"...');
      await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);
    } else {
      console.log('[!] Nome não confirmado, pulando o clique em "Next" pra não travar o onboarding.');
    }

    // 3. Opção "Founder" (com delay de 6s pra humanizar)
    console.log('\n[-] Aguardando 6 segundos para humanizar...');
    await new Promise(r => setTimeout(r, 6000));

    console.log('[ONBOARDING 3/4] Selecionando a opção "Founder"...');
    await aguardarEClicarPorTexto(novaAba, ['founder']);

    // Se houver um botão Next após selecionar Founder, clica nele
    await new Promise(r => setTimeout(r, 3000));
    await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);

    // 4. Opção "Solo" (com delay de 6s pra humanizar)
    console.log('\n[-] Aguardando 6 segundos para humanizar...');
    await new Promise(r => setTimeout(r, 6000));

    console.log('[ONBOARDING 4/4] Selecionando a opção "Solo"...');
    await aguardarEClicarPorTexto(novaAba, ['solo']);

    // Se houver um botão de confirmação pós-Solo, tenta clicar
    await new Promise(r => setTimeout(r, 3000));
    await aguardarEClicarPorTexto(novaAba, ['next', 'continue']);

    // 5. Captura do Token de Autenticação (Firebase Auth em IndexedDB)
    console.log('\n[TOKEN] Extraindo token de autenticação do Lovable via IndexedDB...');
    let tokenCapturado = null;
    let refreshTokenCapturado = null;

    for (let tent = 1; tent <= 6; tent++) {
      const authData = await novaAba.evaluate(async () => {
        try {
          const req = indexedDB.open('firebaseLocalStorageDb');
          return await new Promise((resolve) => {
            req.onsuccess = () => {
              const db = req.result;
              if (!db.objectStoreNames || !db.objectStoreNames.length) return resolve(null);
              const storeName = db.objectStoreNames[0];
              const tx = db.transaction(storeName, 'readonly');
              const getAllReq = tx.objectStore(storeName).getAll();
              getAllReq.onsuccess = ev => {
                const item = ev.target.result && ev.target.result[0];
                if (item?.value?.stsTokenManager) {
                  resolve({
                    accessToken: item.value.stsTokenManager.accessToken,
                    refreshToken: item.value.stsTokenManager.refreshToken
                  });
                } else {
                  resolve(null);
                }
              };
              getAllReq.onerror = () => resolve(null);
            };
            req.onerror = () => resolve(null);
          });
        } catch (err) {
          return null;
        }
      });

      if (authData && authData.accessToken) {
        tokenCapturado = authData.accessToken;
        refreshTokenCapturado = authData.refreshToken;
        break;
      }
      await new Promise(r => setTimeout(r, 1500));
    }

    if (tokenCapturado) {
      console.log('\n' + '*'.repeat(60));
      console.log('>>> TOKEN DE ACESSO CAPTURADO COM SUCESSO!');
      console.log(`>>> ${tokenCapturado.slice(0, 40)}...`);
      console.log('*'.repeat(60));
      salvarContaComToken(conta.email, tokenCapturado, refreshTokenCapturado, nomeLimpo, senhaConta);
    } else {
      console.log('[!] Aviso: Não foi possível obter o token do IndexedDB nesta tentativa, mas salvando dados com a senha...');
      salvarContaComToken(conta.email, null, null, nomeLimpo, senhaConta);
    }

    // 6. Aguardar 10s e fechar sessão automaticamente
    console.log('\n' + '='.repeat(60));
    console.log(`>>> SUCESSO! A conta de ${conta.nome} foi 100% configurada na nova aba!`);
    console.log('>>> Aguardando 10 segundos antes de fechar a sessão...');
    console.log('='.repeat(60));

    for (let s = 10; s > 0; s--) {
      process.stdout.write(`\r[-] Finalizando e fechando sessão em ${s}s... `);
      await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\n[OK] Sessão encerrada com sucesso!');

    try { await novaAba.close(); } catch(e) {}
  } else {
    console.log('\n[AVISO] O link novo não foi identificado dentro do tempo limite.');
    await perguntar(`\nPressione [ENTER] para finalizar a sessão de ${conta.nome}... `);
  }

  } finally {
    try { await page.close(); } catch(e) {}
    try { await context.close(); } catch(e) {}
  }
}

async function main() {
  console.clear();
  console.log('============================================================');
  console.log('    ASSISTENTE LOVABLE - COM DELAY E ESCALA 100% PADRÃO     ');
  console.log('============================================================');
  console.log(' - Visualização: 100% normal (sem zoom artificial)');
  console.log(' - Delays de segurança adicionados');
  console.log(' - Filtro para capturar APENAS o link recém-enviado\n');

  const config = carregarConfig();

  console.log('[GMAIL] Testando autenticação com o Gmail...');
  const teste = await testarConexaoGmail(config.gmailUser, config.gmailAppPassword);
  if (teste.ok) {
    console.log(`[GMAIL] Conectado com sucesso (${config.gmailUser})!\n`);
  } else {
    console.log(`[GMAIL] Aviso de conexão: ${teste.error}\n`);
  }

  console.log('Contas configuradas:');
  contas.forEach(c => console.log(` [${c.id}] ${c.nome} -> ${c.email}`));
  console.log(' [5] Cadastrar todas as 4 contas fixas em sequência');
  console.log(' [6] Digitar um E-MAIL PERSONALIZADO manualmente');
  console.log(' [7] Gerar e cadastrar E-MAILS ALEATÓRIOS (Você escolhe a quantidade)');
  console.log(' [0] Sair');
  console.log('------------------------------------------------------------');

  // Modo não-interativo: node assistente_lovable.js --opcao 7 --qtd 3
  const argv = process.argv.slice(2);
  const pegarArg = nome => {
    const i = argv.indexOf(`--${nome}`);
    return i >= 0 ? argv[i + 1] : null;
  };
  const opcaoArg = pegarArg('opcao');

  const opcao = opcaoArg !== null ? opcaoArg : await perguntar('\nEscolha uma opção (1 a 7, ou 0): ');
  if (opcao.trim() === '0') {
    rl.close();
    process.exit(0);
  }

  let contasParaProcessar = [];
  if (opcao.trim() === '7') {
    console.log('\n' + '='.repeat(60));
    console.log('>>> GERADOR DE E-MAILS ALTAMENTE ALEATÓRIOS');
    console.log('='.repeat(60));
    const qtdArg = pegarArg('qtd');
    const qtdStr = qtdArg !== null ? qtdArg : await perguntar('Quantos e-mails aleatórios você deseja criar? (ex: 3, 5, 10): ');
    const qtd = parseInt(qtdStr.trim(), 10);
    if (isNaN(qtd) || qtd <= 0) {
      console.log('[!] Quantidade inválida. Operação cancelada.');
      rl.close();
      process.exit(1);
    }

    contasParaProcessar = gerarContasAleatorias(qtd);
    console.log(`\n[OK] ${qtd} contas geradas com sucesso (sem repetições):`);
    contasParaProcessar.forEach(c => console.log(` [${c.id}] ${c.nome} -> ${c.email}`));

    if (opcaoArg === null) {
      await perguntar('\nPressione [ENTER] para iniciar os cadastros... ');
    }
  } else if (opcao.trim() === '6') {
    console.log('\n' + '-'.repeat(60));
    console.log('>>> CADASTRO COM E-MAIL PERSONALIZADO');
    console.log('-'.repeat(60));
    const emailCustom = await perguntar('Digite o e-mail desejado: ');
    if (!emailCustom || !emailCustom.includes('@')) {
      console.log('[!] E-mail inválido. Encerrando.');
      rl.close();
      process.exit(1);
    }
    let nomeCustom = await perguntar('Digite o nome para o perfil (ou tecle ENTER para usar o e-mail): ');
    if (!nomeCustom || nomeCustom.trim() === '') {
      nomeCustom = emailCustom.split('@')[0];
    }

    contasParaProcessar = [{
      id: 99,
      nome: nomeCustom.trim(),
      email: emailCustom.trim()
    }];
  } else if (opcao.trim() === '5' || opcao.trim().toLowerCase() === 't') {
    contasParaProcessar = contas;
  } else {
    const selecionada = contas.find(c => c.id.toString() === opcao.trim());
    contasParaProcessar = selecionada ? [selecionada] : contas;
  }

  const resultado = { sucesso: [], falha: [] };

  for (let i = 0; i < contasParaProcessar.length; i++) {
    const conta = contasParaProcessar[i];
    let ok = false;
    const proxyDaConta = obterProximaProxy();

    for (let tentativa = 1; tentativa <= 2 && !ok; tentativa++) {
      let chromeInstance = null;
      try {
        console.log(`\n[CHROME] Abrindo instância isolada com proxy (${proxyDaConta ? proxyDaConta.serverArg : 'sem proxy'})...`);
        chromeInstance = await abrirChromeNormal(proxyDaConta);
        await processarConta(chromeInstance.browser, conta, config, proxyDaConta);
        ok = true;
        resultado.sucesso.push(conta.email);
      } catch (err) {
        console.log(`\n[ERRO] Falha ao processar ${conta.email} (tentativa ${tentativa}/2): ${err.message}`);
        if (tentativa === 2) {
          resultado.falha.push({ email: conta.email, erro: err.message });
        } else {
          await new Promise(r => setTimeout(r, 5000));
        }
      } finally {
        if (chromeInstance && chromeInstance.browser) {
          try { await chromeInstance.browser.close(); } catch(e) {}
        }
        if (chromeInstance && chromeInstance.chromeProc) {
          try { chromeInstance.chromeProc.kill(); } catch(e) {}
        }
      }
    }

    // Delay humano/aleatório entre contas pra não deixar o padrão óbvio (não aplica após a última)
    if (i < contasParaProcessar.length - 1) {
      const delayMs = crypto.randomInt(15000, 30000);
      console.log(`\n[LOTE] Aguardando ${Math.round(delayMs / 1000)}s antes da próxima conta (${i + 2}/${contasParaProcessar.length})...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(' LOTE FINALIZADO ');
  console.log('='.repeat(60));
  console.log(`[OK] Sucesso: ${resultado.sucesso.length}/${contasParaProcessar.length}`);
  resultado.sucesso.forEach(e => console.log(`   + ${e}`));
  if (resultado.falha.length > 0) {
    console.log(`[FALHA] ${resultado.falha.length} conta(s) não concluída(s):`);
    resultado.falha.forEach(f => console.log(`   - ${f.email}: ${f.erro}`));
  }
  console.log('============================================================\n');

  rl.close();
}

main().catch(err => {
  console.error('Erro geral:', err);
  rl.close();
});
