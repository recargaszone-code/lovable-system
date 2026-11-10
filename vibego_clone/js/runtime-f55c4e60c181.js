(()=>{'use strict';
const plans = [
  {id:'trial_1h',name:'Teste VibeGO Conect',duration:'1 hora',seconds:3600,price:1990,ips:1,checkoutUrl:null},
  {id:'week_7d',name:'VibeGO Conect 7 dias',duration:'7 dias',seconds:604800,price:6790,ips:1,checkoutUrl:null},
  {id:'fortnight_14d',name:'VibeGO Conect 14 dias',duration:'14 dias',seconds:1209600,price:12790,ips:1,checkoutUrl:null},
  {id:'max_30d',name:'VibeGO Conect Max',duration:'30 dias',seconds:2592000,price:24790,ips:2,checkoutUrl:null}
];
const commerce = {mode:'preview',supportUrl:null,automaticRenewal:false,extraIPEnabled:false,termsUrl:null,privacyUrl:null};
const models = ['Claude Opus 5.5','Fable 5.1','Sonnet 5','GPT-6 Astra'].map(name=>({name,status:'draft',gatewayId:null,testedTools:[],validatedAt:null,source:'Briefing do proprietário, PRD v1.0'}));
const money = cents => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
function checkoutFor(id){const plan=plans.find(p=>p.id===id);if(!plan)throw new Error('Plano inválido');if(!plan.checkoutUrl)return null;const url=new URL(plan.checkoutUrl);if(url.protocol!=='https:')throw new Error('O checkout precisa usar HTTPS');return url.href;}

const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
function journeyState(progress){
 const p=clamp(progress);
 return {progress:p,phase:p<.28?0:p<.7?1:2,
  blocked:1-clamp((p-.13)/.17),access:clamp((p-.22)/.14)*(1-clamp((p-.64)/.14)),ready:clamp((p-.7)/.16),
  door:clamp((p-.16)/.12)*(1-clamp((p-.7)/.13)),spread:clamp((p-.26)/.4)*137,
  blockedY:-clamp((p-.08)/.3)*90,readyY:(1-clamp((p-.67)/.22))*62,
  blockedScale:1-clamp(p/.4)*.11,accessScale:.84+clamp((p-.2)/.42)*.16,readyScale:.92+clamp((p-.68)/.2)*.08};
}

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const dialog=$('#plan-dialog');let opener;

// ========================================================
// MOTOR DE CHECKOUT TRANSPARENTE PIX & POLLING (ZDB ENGINE v2.0)
// ========================================================
const PUBLIC_SITE = location.origin + (['paglovers.com.br','www.paglovers.com.br'].includes(location.hostname) ? '/vibego/' : '/');
const CONFIG_API_ROOT = ['vibegoconect.com','www.vibegoconect.com','api.vibegoconect.com'].includes(location.hostname) ? 'https://api.vibegoconect.com' : 'https://paglovers.com.br';
const CHECKOUT_API_BASE = window.location.origin + '/v1';
try { fetch(CHECKOUT_API_BASE + '/track/visit', { method: 'POST' }).catch(()=>{}); } catch(e) {}
let activePollTimer = null;
let currentOrderId = null;
let currentKeyData = null;

const STORAGE_ORDER_KEY = 'vibego_active_order';
const STORAGE_KEY_DATA = 'vibego_approved_key';

function getModalStep() {
  const stepSuccess = $('#checkout-step-success');
  if (stepSuccess && stepSuccess.style.display === 'block') return 'success';
  const stepPix = $('#checkout-step-pix');
  if (stepPix && stepPix.style.display === 'block') return 'pix';
  return 'form';
}

function setPlan(id){const p=plans.find(x=>x.id===id);if(!p)return;$('#plan-select').value=p.id;$('#dialog-title').textContent=p.name;$('#order-duration').textContent=`${p.duration} de acesso`;$('#order-ips').textContent=`${p.ips} IP${p.ips===2?'s':''} autorizado${p.ips===2?'s':''}`;$('#order-price').textContent=money(p.price);$('#order-note').textContent=p.id==='trial_1h'?'Teste pago. São 60 minutos corridos de validade, conforme a regra de ativação informada.':'Compra por período. Sem renovação automática.';$('#checkout-status').textContent='';}

function openModal(planId, triggerBtn) {
  if (triggerBtn) opener = triggerBtn;

  // 1. Se há chave ativa entregue nesta sessão, preserva a visualização da credencial
  if (currentKeyData && currentKeyData.key && getModalStep() === 'success') {
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    return;
  }

  // 2. Se há pedido PIX pendente ativo com menos de 45 minutos, retoma a etapa do PIX
  const savedOrderStr = localStorage.getItem(STORAGE_ORDER_KEY);
  if (savedOrderStr && currentOrderId) {
    try {
      const savedOrder = JSON.parse(savedOrderStr);
      if (Date.now() - (savedOrder.timestamp || 0) < 45 * 60 * 1000) {
        showPixStep(savedOrder);
        if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
        document.body.style.overflow = 'hidden';
        return;
      } else {
        localStorage.removeItem(STORAGE_ORDER_KEY);
      }
    } catch (e) {}
  }

  // 3. Caso normal: abre o formulário de compra
  if (planId) setPlan(planId);
  const stepForm = $('#checkout-step-form');
  const stepPix = $('#checkout-step-pix');
  const stepSuccess = $('#checkout-step-success');
  if (stepForm) stepForm.style.display = 'block';
  if (stepPix) stepPix.style.display = 'none';
  if (stepSuccess) stepSuccess.style.display = 'none';
  if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
  document.body.style.overflow = 'hidden';
  $('#plan-select')?.focus();
}

$$('[data-plan]').forEach(b => b.addEventListener('click', () => {
  openModal(b.dataset.plan, b);
}));

$('#plan-select').addEventListener('change', e => setPlan(e.target.value));

function closeDialog(isExplicitAction = false) {
  const step = getModalStep();
  // Bloqueio rigoroso: se não for ação explícita (ex: clique fora ou tecla ESC), NUNCA fecha em PIX ou Sucesso
  if (!isExplicitAction && (step === 'pix' || step === 'success')) {
    return;
  }

  if (step === 'form') {
    const statusEl = $('#checkout-status');
    if (statusEl) statusEl.textContent = '';
    const btn = $('#checkout-button');
    if (btn) btn.disabled = false;
    const btnTxt = $('#btn-text');
    if (btnTxt) btnTxt.textContent = 'Garantir Acesso Imediato';
  }

  if (dialog.close) dialog.close();
  else dialog.removeAttribute('open');
  document.body.style.overflow = '';
  opener?.focus();
}

$('#close-dialog').addEventListener('click', () => closeDialog(true));
$('#back-dialog').addEventListener('click', () => closeDialog(true));
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  opener?.focus();
});

// Clique no backdrop: permitido apenas na etapa 'form'
dialog.addEventListener('click', e => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      closeDialog(false);
    }
  }
});

// Tecla ESC: prevenida em PIX e Sucesso para evitar perda acidental
dialog.addEventListener('cancel', e => {
  const step = getModalStep();
  if (step === 'pix' || step === 'success') {
    e.preventDefault();
  } else {
    document.body.style.overflow = '';
    opener?.focus();
  }
});

dialog.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.keyCode === 27) {
    const step = getModalStep();
    if (step === 'pix' || step === 'success') {
      e.preventDefault();
      e.stopPropagation();
    }
  }
});

function stopPolling() {
  if (activePollTimer) {
    clearInterval(activePollTimer);
    activePollTimer = null;
  }
}

function resetModalSteps() {
  stopPolling();
  const stepForm = $('#checkout-step-form');
  const stepPix = $('#checkout-step-pix');
  const stepSuccess = $('#checkout-step-success');
  if (stepForm) stepForm.style.display = 'block';
  if (stepPix) stepPix.style.display = 'none';
  if (stepSuccess) stepSuccess.style.display = 'none';
  const statusEl = $('#checkout-status');
  if (statusEl) statusEl.textContent = '';
  const btn = $('#checkout-button');
  if (btn) btn.disabled = false;
  const btnTxt = $('#btn-text');
  if (btnTxt) btnTxt.textContent = 'Garantir Acesso Imediato';
}

function showPixStep(data) {
  $('#checkout-step-form').style.display = 'none';
  $('#checkout-step-pix').style.display = 'block';
  $('#checkout-step-success').style.display = 'none';

  $('#pix-qr-img').src = data.qrCodeBase64;
  $('#pix-copia-cola').value = data.copyPaste;
  $('#pix-amount-val').textContent = money(data.amount * 100);

  currentOrderId = data.orderId;
  
  try {
    localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify({
      orderId: data.orderId,
      amount: data.amount,
      planName: data.planName,
      qrCodeBase64: data.qrCodeBase64,
      copyPaste: data.copyPaste,
      timestamp: Date.now()
    }));
  } catch (e) {}

  startPolling(data.orderId);
}

let currentSuccessTool = 'claude';

function getClaudePowerShellScript(key) {
  return `# 1. Garante o npm e Claude no PATH da sessao atual\n` +
         `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") + ";$env:APPDATA\\npm"\n\n` +
         `# 2. Configura as variaveis do VibeGO Conect na sessao\n` +
         `$env:ANTHROPIC_BASE_URL="${CONFIG_API_ROOT}"\n` +
         `$env:ANTHROPIC_API_KEY="${key}"\n\n` +
         `# 3. Salva permanente no Windows (nao precisa redigitar ao abrir novo terminal)\n` +
         `[System.Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', '${CONFIG_API_ROOT}', 'User')\n` +
         `[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', '${key}', 'User')\n\n` +
         `# 4. Verifica e instala o Claude Code via npm se necessario\n` +
         `if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {\n` +
         `    Write-Host "Instalando Claude Code via npm..." -ForegroundColor Cyan\n` +
         `    npm install -g @anthropic-ai/claude-code\n` +
         `    $env:Path += ";$env:APPDATA\\npm"\n` +
         `}\n\n` +
         `# 5. Inicia o Claude Code (com suporte a PowerShell ISE ou Console Padrao)\n` +
         `Write-Host "Iniciando Claude Code no cluster VibeGO..." -ForegroundColor Green\n` +
         `if ($host.Name -match 'ISE') {\n` +
         `    Start-Process powershell -ArgumentList "-NoExit", "-Command", "claude"\n` +
         `} else {\n` +
         `    claude\n` +
         `}`;
}

function getCodexConfigScript(key) {
  return `# 1. Salvar chave comercial VibeGO Conect no Windows (Sessao Atual + Usuario Permanente)\n` +
         `$env:VIBEGO_API_KEY="${key}"\n` +
         `[System.Environment]::SetEnvironmentVariable('VIBEGO_API_KEY', '${key}', 'User')\n\n` +
         `# 2. Localizar pasta do Codex respeitando CODEX_HOME\n` +
         `$codexDir = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { "$env:USERPROFILE\\.codex" }\n` +
         `if (!(Test-Path $codexDir)) { New-Item -ItemType Directory -Path $codexDir -Force | Out-Null }\n` +
         `$configFile = "$codexDir\\config.toml"\n` +
         `$catalogFile = "$codexDir\\models.json"\n\n` +
         `# 3. Salvar backup de seguranca de config.toml se ja existir\n` +
         `if (Test-Path $configFile) { Copy-Item $configFile "$configFile.bak" -Force }\n\n` +
         `# 4. Gravar catalogo oficial de modelos comerciais VibeGO Conect (ModelsResponse)\n` +
         `@'\n` +
         `{\n` +
         `  "models": [\n` +
         `    {\n` +
         `      "slug": "gpt-6-astra[1m]",\n` +
         `      "display_name": "GPT-6 Astra (1M)",\n` +
         `      "description": "Modelo principal VibeGO Conect para geracao de codigo e raciocinio de alta performance",\n` +
         `      "default_reasoning_level": "medium",\n` +
         `      "supported_reasoning_levels": ["low", "medium", "high"],\n` +
         `      "shell_type": "standard",\n` +
         `      "visibility": "public",\n` +
         `      "supported_in_api": true,\n` +
         `      "priority": 1,\n` +
         `      "context_window": 1048576,\n` +
         `      "max_context_window": 1048576,\n` +
         `      "input_modalities": ["text", "image"],\n` +
         `      "supports_search_tool": false,\n` +
         `      "supports_experimental_context": false,\n` +
         `      "use_responses_lite": true,\n` +
         `      "supports_reasoning_effort_updates": true\n` +
         `    },\n` +
         `    {\n` +
         `      "slug": "claude-sonnet-5[1m]",\n` +
         `      "display_name": "Claude Sonnet 5 (1M)",\n` +
         `      "description": "Modelo multimodal avancado para desenvolvimento e refatoracao",\n` +
         `      "default_reasoning_level": "medium",\n` +
         `      "supported_reasoning_levels": ["low", "medium", "high"],\n` +
         `      "shell_type": "standard",\n` +
         `      "visibility": "public",\n` +
         `      "supported_in_api": true,\n` +
         `      "priority": 2,\n` +
         `      "context_window": 1048576,\n` +
         `      "max_context_window": 1048576,\n` +
         `      "input_modalities": ["text", "image"],\n` +
         `      "supports_search_tool": false,\n` +
         `      "supports_experimental_context": false,\n` +
         `      "use_responses_lite": true,\n` +
         `      "supports_reasoning_effort_updates": true\n` +
         `    },\n` +
         `    {\n` +
         `      "slug": "claude-opus-5-5[1m]",\n` +
         `      "display_name": "Claude Opus 5.5 (1M)",\n` +
         `      "description": "Modelo topo de linha para arquitetura complexa de sistemas e analise rigorosa",\n` +
         `      "default_reasoning_level": "high",\n` +
         `      "supported_reasoning_levels": ["medium", "high"],\n` +
         `      "shell_type": "standard",\n` +
         `      "visibility": "public",\n` +
         `      "supported_in_api": true,\n` +
         `      "priority": 3,\n` +
         `      "context_window": 1048576,\n` +
         `      "max_context_window": 1048576,\n` +
         `      "input_modalities": ["text", "image"],\n` +
         `      "supports_search_tool": false,\n` +
         `      "supports_experimental_context": false,\n` +
         `      "use_responses_lite": true,\n` +
         `      "supports_reasoning_effort_updates": true\n` +
         `    },\n` +
         `    {\n` +
         `      "slug": "claude-fable-5.1[1m]",\n` +
         `      "display_name": "Claude Fable 5.1 (1M)",\n` +
         `      "description": "Modelo ultrarrapido para edicao, refatoracao e iteracao agil de codigo",\n` +
         `      "default_reasoning_level": "low",\n` +
         `      "supported_reasoning_levels": ["low", "medium"],\n` +
         `      "shell_type": "standard",\n` +
         `      "visibility": "public",\n` +
         `      "supported_in_api": true,\n` +
         `      "priority": 4,\n` +
         `      "context_window": 1048576,\n` +
         `      "max_context_window": 1048576,\n` +
         `      "input_modalities": ["text", "image"],\n` +
         `      "supports_search_tool": false,\n` +
         `      "supports_experimental_context": false,\n` +
         `      "use_responses_lite": true,\n` +
         `      "supports_reasoning_effort_updates": true\n` +
         `    }\n` +
         `  ]\n` +
         `}\n` +
         `'@ | Set-Content -Path $catalogFile -Encoding utf8\n\n` +
         `# 5. Atualizar cirurgicamente config.toml (preserva MCPs, projetos e plugins)\n` +
         `$existing = if (Test-Path $configFile) { Get-Content $configFile -Raw -Encoding utf8 } else { "" }\n` +
         `$clean = if ($existing) {\n` +
         `    $c = $existing -replace '(?ms)^\\s*\\[model_providers\\.vibego\\].*?(?=^\\s*\\[|\\Z)', ''\n` +
         `    $c = $c -replace '(?m)^\\s*model\\s*=.*?\\r?\\n', ''\n` +
         `    $c = $c -replace '(?m)^\\s*model_provider\\s*=.*?\\r?\\n', ''\n` +
         `    $c.Trim()\n` +
         `} else { "" }\n` +
         `$header = "model = \\\`"gpt-6-astra[1m]\\\`"\\\`r\\\`nmodel_provider = \\\`"vibego\\\`""\n` +
         `$section = @"\n` +
         `[model_providers.vibego]\n` +
         `name = "VibeGO Conect"\n` +
         `base_url = "${CONFIG_API_ROOT}/v1"\n` +
         `wire_api = "responses"\n` +
         `env_key = "VIBEGO_API_KEY"\n` +
         `model_catalog_url = "${CONFIG_API_ROOT}/v1/models"\n` +
         `model_catalog_json = '$catalogFile'\n` +
         `"@\n` +
         `$final = if ($clean) { "$header\\\`r\\\`n\\\`r\\\`n$clean\\\`r\\\`n\\\`r\\\`n$section" } else { "$header\\\`r\\\`n\\\`r\\\`n$section" }\n` +
         `$final | Set-Content -Path $configFile -Encoding utf8\n\n` +
         `# 6. Informacoes e Inicializacao (Tratamento para PowerShell ISE e Codex Desktop)\n` +
         `Write-Host "Configuracao do VibeGO Conect concluida com sucesso!" -ForegroundColor Green\n` +
         `Write-Host "• Codex Desktop: Se o aplicativo estiver aberto, reinicie-o para carregar a chave." -ForegroundColor Cyan\n` +
         `if ($host.Name -match 'ISE') {\n` +
         `    Write-Host "AVISO: O PowerShell ISE nao suporta terminal interativo (stdout is not a terminal)." -ForegroundColor Yellow\n` +
         `    Write-Host "Para iniciar o Codex CLI, abra o Windows Terminal ou powershell.exe e execute: codex" -ForegroundColor Cyan\n` +
         `} else {\n` +
         `    Write-Host "Iniciando Codex CLI oficial no cluster VibeGO..." -ForegroundColor Green\n` +
         `    codex\n` +
         `}`;
}

function updateSuccessCommandView() {
  if (!currentKeyData || !currentKeyData.key) return;
  const key = currentKeyData.key;
  const tabClaude = $('#tab-checkout-claude');
  const tabCodex = $('#tab-checkout-codex');
  const descEl = $('#checkout-cmd-desc');
  const preEl = $('#success-cli-cmd');
  const baseEl = $('#checkout-base-url-hint');

  if (currentSuccessTool === 'claude') {
    if (tabClaude) { tabClaude.classList.add('primary'); tabClaude.style.background = ''; }
    if (tabCodex) { tabCodex.classList.remove('primary'); tabCodex.style.background = '#252c2d'; }
    if (descEl) descEl.textContent = 'Cole no PowerShell para auto-instalar, salvar no Windows e iniciar:';
    if (preEl) preEl.textContent = getClaudePowerShellScript(key);
    if (baseEl) baseEl.textContent = 'Base URL: ' + CONFIG_API_ROOT;
  } else {
    if (tabCodex) { tabCodex.classList.add('primary'); tabCodex.style.background = ''; }
    if (tabClaude) { tabClaude.classList.remove('primary'); tabClaude.style.background = '#252c2d'; }
    if (descEl) descEl.textContent = 'Configure na sua extensão (Cursor/Roo Code/Cline) ou salve no Windows:';
    if (preEl) preEl.textContent = getCodexConfigScript(key);
    if (baseEl) baseEl.textContent = 'Base URL: ' + CONFIG_API_ROOT + '/v1';
  }
}


function buildVibeGOReceipt(data) {
  return [
    'VIBEGO — SEUS DADOS DE ACESSO', '',
    'Pedido: ' + (data.order_id || 'Consulte a confirmação da compra'),
    'Plano: ' + (data.plan || 'VibeGO Conect'),
    'Chave: ' + data.key,
    'Código de recuperação: ' + (data.recovery_code || 'Use a opção Emitir novo código na confirmação da compra'),
    ...(data.expires ? ['Validade: ' + data.expires] : []), '',
    'CONFIGURAÇÃO AUTOMÁTICA — VIBEGO CONECT',
    'Downloads oficiais: ' + PUBLIC_SITE + 'downloads/',
    'Windows: ' + PUBLIC_SITE + 'downloads/VibeGO-Conect-Windows-2.4.0.msi',
    'Mac (em validação): ' + PUBLIC_SITE + 'downloads/VibeGO-Conect-Mac.zip',
    'Linux: ' + PUBLIC_SITE + 'downloads/VibeGO-Conect-Linux.tar.gz', '',
    '1. Baixe o VibeGO Conect para o seu computador.',
    '2. Abra e escolha Claude Desktop, Claude no terminal ou Codex.',
    '3. Cole a chave acima, confira o modelo e conecte.',
    'As ferramentas precisam estar instaladas. Você pode voltar ao modo conta pelo configurador.', '',
    'Guarde este arquivo em local privado. Não compartilhe a chave nem o código de recuperação.',
    'Configuração manual: ' + PUBLIC_SITE + 'docs/',
    'Recuperar acesso ou redefinir IP: ' + PUBLIC_SITE + '',
    'Suporte: https://wa.me/5599984699061', ''
  ].join('\n');
}

function showSuccessStep(data) {
  stopPolling();
  $('#checkout-step-form').style.display = 'none';
  $('#checkout-step-pix').style.display = 'none';
  $('#checkout-step-success').style.display = 'block';

  currentKeyData = data;
  $('#success-api-key').textContent = data.key;

  // Exibição e controle do Código de Recuperação Individual
  const recCodeEl = $('#success-recovery-code');
  const recRotateContainer = $('#checkout-recovery-rotate-container');
  if (data.recovery_code) {
    if (recCodeEl) recCodeEl.textContent = data.recovery_code;
    if (recRotateContainer) recRotateContainer.style.display = 'none';
  } else if (data.has_recovery_code) {
    if (recCodeEl) recCodeEl.textContent = '(Código salvo no pedido)';
    if (recRotateContainer) recRotateContainer.style.display = 'block';
  }

  // Listener para copiar código de recuperação no checkout
  const btnCopyRec = $('#btn-copy-recovery-code-checkout');
  if (btnCopyRec && !btnCopyRec.dataset.bound) {
    btnCopyRec.dataset.bound = 'true';
    btnCopyRec.addEventListener('click', async () => {
      const code = $('#success-recovery-code')?.textContent || '';
      if (code && !code.includes('Carregando') && !code.includes('(')) {
        await navigator.clipboard.writeText(code).catch(()=>{});
        const orig = btnCopyRec.textContent;
        btnCopyRec.textContent = 'Copiado!';
        setTimeout(() => { btnCopyRec.textContent = orig; }, 2000);
      }
    });
  }

  // Listener para reemissão / rotação mediante sessão autenticada de checkout
  const btnRotate = $('#btn-rotate-checkout-recovery');
  if (btnRotate && !btnRotate.dataset.bound) {
    btnRotate.dataset.bound = 'true';
    btnRotate.addEventListener('click', async () => {
      const ordId = currentKeyData?.orderId || currentOrderId;
      if (!ordId) return;
      btnRotate.disabled = true;
      btnRotate.textContent = 'Emitindo...';
      try {
        const res = await fetch(`${CHECKOUT_API_BASE}/checkout/recovery_code/rotate`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: ordId })
        });
        const rotData = await res.json();
        if (res.ok && rotData.success && rotData.recovery_code) {
          if (currentKeyData) currentKeyData.recovery_code = rotData.recovery_code;
          if (recCodeEl) recCodeEl.textContent = rotData.recovery_code;
          if (recRotateContainer) recRotateContainer.style.display = 'none';
        } else {
          alert(rotData.error || 'Falha ao reemitir código.');
        }
      } catch (e) {
        alert('Erro de conexão ao reemitir código.');
      } finally {
        btnRotate.disabled = false;
        btnRotate.textContent = 'Emitir novo código de recuperação';
      }
    });
  }

  currentSuccessTool = 'claude';
  updateSuccessCommandView();

  // Listeners das abas
  const tabClaude = $('#tab-checkout-claude');
  if (tabClaude && !tabClaude.dataset.bound) {
    tabClaude.dataset.bound = 'true';
    tabClaude.addEventListener('click', () => { currentSuccessTool = 'claude'; updateSuccessCommandView(); });
  }
  const tabCodex = $('#tab-checkout-codex');
  if (tabCodex && !tabCodex.dataset.bound) {
    tabCodex.dataset.bound = 'true';
    tabCodex.addEventListener('click', () => { currentSuccessTool = 'codex'; updateSuccessCommandView(); });
  }

  // Botão copiar comando
  const btnCopyCmd = $('#btn-copy-checkout-cmd');
  if (btnCopyCmd && !btnCopyCmd.dataset.bound) {
    btnCopyCmd.dataset.bound = 'true';
    btnCopyCmd.addEventListener('click', () => {
      const txt = $('#success-cli-cmd').textContent;
      navigator.clipboard.writeText(txt);
      btnCopyCmd.textContent = 'Copiado!';
      setTimeout(() => { btnCopyCmd.textContent = 'Copiar Comando'; }, 2500);
    });
  }

  // Botão salvar .txt
  const btnDownloadTxt = $('#btn-download-txt');
  if (btnDownloadTxt && !btnDownloadTxt.dataset.bound) {
    btnDownloadTxt.dataset.bound = 'true';
    btnDownloadTxt.addEventListener('click', () => {
      const active = currentKeyData;
      if (!active?.key) return;
      const content = buildVibeGOReceipt({ order_id: active.orderId || currentOrderId, key: active.key, plan: active.planName, recovery_code: active.recovery_code || $('#success-recovery-code')?.textContent });
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `chave-vibego-${active.key.slice(-8)}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  // Botão novo pedido (contratar outro plano)
  const btnNewOrder = $('#btn-new-order');
  if (btnNewOrder && !btnNewOrder.dataset.bound) {
    btnNewOrder.dataset.bound = 'true';
    btnNewOrder.addEventListener('click', () => {
      currentKeyData = null;
      resetModalSteps();
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    localStorage.removeItem(STORAGE_ORDER_KEY);
  } catch (e) {}
}

function startPolling(orderId) {
  stopPolling();

  activePollTimer = setInterval(async () => {
    try {
      const res = await fetch(`${CHECKOUT_API_BASE}/checkout/status/${orderId}`, {
        credentials: 'same-origin'
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          const errData = await res.json().catch(() => ({}));
          if (errData && errData.status === 'SESSAO_EXPIRADA') {
            stopPolling();
            const statusEl = $('#checkout-status');
            if (statusEl) {
              statusEl.textContent = errData.error || 'Sessão de entrega encerrada. Contate o suporte.';
            }
          }
        }
        return;
      }
      const statusData = await res.json();
      if (statusData.status === 'COMPLETO' && statusData.key) {
        showSuccessStep(statusData);
        if (!dialog.open && !dialog.hasAttribute('open')) {
          if (dialog.showModal) dialog.showModal();
          else dialog.setAttribute('open', '');
          document.body.style.overflow = 'hidden';
        }
      }
    } catch (e) {
      console.warn('[VibeGO Conect Checkout Polling Error]:', e);
    }
  }, 3000);
}

// Botão Copiar PIX
$('#btn-copy-pix')?.addEventListener('click', async () => {
  const code = $('#pix-copia-cola').value;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    const fb = $('#copy-feedback');
    fb.style.display = 'block';
    setTimeout(() => { fb.style.display = 'none'; }, 3500);
  } catch (err) {
    $('#pix-copia-cola').select();
    document.execCommand('copy');
  }
});

// Botão Cancelar / Voltar da tela do PIX
$('#btn-cancel-pix')?.addEventListener('click', () => {
  try { localStorage.removeItem(STORAGE_ORDER_KEY); } catch (e) {}
  currentOrderId = null;
  stopPolling();
  resetModalSteps();
});

// Botão Copiar Chave de API
$('#btn-copy-key')?.addEventListener('click', async () => {
  const key = $('#success-api-key').textContent;
  if (!key) return;
  try {
    await navigator.clipboard.writeText(key);
    const btn = $('#btn-copy-key');
    const orig = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  } catch (err) {
    alert('Chave copiada: ' + key);
  }
});



// Concluir no Sucesso
$('#btn-finish-success')?.addEventListener('click', () => {
  closeDialog();
});

// Submissão do Checkout PIX (Sem CPF e sem fricção)
$('#checkout-button')?.addEventListener('click', async () => {
  const name = ($('#payer-name')?.value || '').trim();
  const email = ($('#payer-email')?.value || '').trim();
  const planId = $('#plan-select').value;
  const statusEl = $('#checkout-status');

  if (navigator.cookieEnabled === false) {
    statusEl.textContent = 'Os cookies do seu navegador estão desativados. Ative os cookies para realizar o checkout seguro.';
    return;
  }

  if (!name || name.length < 2) {
    statusEl.textContent = 'Por favor, informe seu nome completo.';
    $('#payer-name')?.focus();
    return;
  }
  if (!email || !email.includes('@')) {
    statusEl.textContent = 'Por favor, informe um e-mail válido para entrega da chave.';
    $('#payer-email')?.focus();
    return;
  }

  statusEl.textContent = '';
  $('#checkout-button').disabled = true;
  $('#btn-text').textContent = 'Gerando PIX...';

  try {
    const res = await fetch(`${CHECKOUT_API_BASE}/checkout/pix`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        planId
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Falha ao gerar cobrança PIX');
    }

    showPixStep(data);
  } catch (err) {
    statusEl.textContent = 'Erro: ' + err.message;
    $('#checkout-button').disabled = false;
    $('#btn-text').textContent = 'Garantir Acesso Imediato';
  }
});

// Verificação de sessão salva (se recarregar página com pedido em andamento)
(async function checkExistingSession() {
  try {
    const savedKey = localStorage.getItem(STORAGE_KEY_DATA);
    if (savedKey) {
      currentKeyData = JSON.parse(savedKey);
    }
    const savedOrderStr = localStorage.getItem(STORAGE_ORDER_KEY);
    if (savedOrderStr) {
      const savedOrder = JSON.parse(savedOrderStr);
      if (Date.now() - (savedOrder.timestamp || 0) < 4 * 60 * 60 * 1000) {
        currentOrderId = savedOrder.orderId;
        const res = await fetch(`${CHECKOUT_API_BASE}/checkout/status/${savedOrder.orderId}`, {
          credentials: 'same-origin'
        });
        if (res.ok) {
          const statusData = await res.json();
          if (statusData.status === 'COMPLETO' && statusData.key) {
            currentKeyData = statusData;
            localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(statusData));
            localStorage.removeItem(STORAGE_ORDER_KEY);
          } else if (statusData.status === 'PENDENTE') {
            startPolling(savedOrder.orderId);
          }
        } else {
          // Se não autorizado ou expirado, remove o pedido local
          localStorage.removeItem(STORAGE_ORDER_KEY);
        }
      } else {
        localStorage.removeItem(STORAGE_ORDER_KEY);
      }
    }
  } catch (e) {}
})();

// ========================================================
// CONTROLE DE RECUPERAÇÃO DEFINITIVA DE ACESSO & REDEFINIÇÃO DE IP (ZDB ENGINE v2.5)
// ========================================================
const recoveryDialog = $('#recovery-dialog');
let currentRecoveredKeyData = null;
let currentRecoveryTool = 'Claude Code';
let currentRecoveryService = 'recover_key';

function showRecoveryView(viewName) {
  const formEl = $('#recovery-view-form');
  const detailEl = $('#recovery-view-detail');
  const resetSuccessEl = $('#recovery-view-reset-success');
  if (formEl) formEl.style.display = (viewName === 'form') ? 'block' : 'none';
  if (detailEl) detailEl.style.display = (viewName === 'detail') ? 'block' : 'none';
  if (resetSuccessEl) resetSuccessEl.style.display = (viewName === 'reset_success') ? 'block' : 'none';
}

function switchRecoveryService(service) {
  currentRecoveryService = service;
  const panelKey = $('#panel-recover-key');
  const panelReset = $('#panel-reset-ip');
  const tabKey = $('#tab-nav-recover-key');
  const tabReset = $('#tab-nav-reset-ip');

  if (service === 'reset_ip') {
    if (panelKey) panelKey.style.display = 'none';
    if (panelReset) panelReset.style.display = 'block';

    if (tabReset) {
      tabReset.style.background = '#252c2d';
      tabReset.style.color = '#fff';
      tabReset.style.border = '1px solid #ffffff20';
    }
    if (tabKey) {
      tabKey.style.background = 'transparent';
      tabKey.style.color = '#8c9790';
      tabKey.style.border = 'none';
    }

    fetchDetectedClientIp();
    setTimeout(() => $('#reset-ip-key-input')?.focus(), 50);
  } else {
    if (panelKey) panelKey.style.display = 'block';
    if (panelReset) panelReset.style.display = 'none';

    if (tabKey) {
      tabKey.style.background = '#252c2d';
      tabKey.style.color = '#fff';
      tabKey.style.border = '1px solid #ffffff20';
    }
    if (tabReset) {
      tabReset.style.background = 'transparent';
      tabReset.style.color = '#8c9790';
      tabReset.style.border = 'none';
    }

    setTimeout(() => $('#recovery-order-id-input')?.focus(), 50);
  }
}

async function fetchDetectedClientIp() {
  const el = $('#reset-ip-detected-val');
  if (!el) return;
  el.textContent = 'Detectando...';
  try {
    const res = await fetch(`${CHECKOUT_API_BASE}/recovery/my-ip`, {
      method: 'GET',
      credentials: 'same-origin'
    });
    const data = await res.json();
    if (data && data.ip) {
      el.textContent = data.ip;
      el.setAttribute('data-raw-ip', data.ip);
    } else {
      el.textContent = 'Conexão ativa';
    }
  } catch (e) {
    el.textContent = 'Conexão ativa';
  }
}

function openRecoveryModal(initialView = 'form', initialService = 'recover_key') {
  if (!recoveryDialog) return;
  showRecoveryView(initialView);
  switchRecoveryService(initialService);

  const statusEl = $('#recovery-form-status');
  if (statusEl) statusEl.textContent = '';
  const resetStatusEl = $('#reset-ip-status');
  if (resetStatusEl) resetStatusEl.textContent = '';

  if (recoveryDialog.showModal) recoveryDialog.showModal(); else recoveryDialog.setAttribute('open', '');
  document.body.style.overflow = 'hidden';
}

function closeRecoveryModal() {
  if (!recoveryDialog) return;
  // Limpeza estrita de memória da interface (higiene de segurança contra inspeção de DOM)
  const codeEl = $('#recovery-new-code-text');
  if (codeEl) codeEl.textContent = '';
  const keyEl = $('#recovery-key-code');
  if (keyEl) keyEl.textContent = '';
  const orderInput = $('#recovery-order-id-input');
  if (orderInput) orderInput.value = '';
  const recInput = $('#recovery-code-input');
  if (recInput) recInput.value = '';

  const resetKeyInput = $('#reset-ip-key-input');
  if (resetKeyInput) resetKeyInput.value = '';
  const resetCodeInput = $('#reset-ip-code-input');
  if (resetCodeInput) resetCodeInput.value = '';
  const resetSuccessCode = $('#reset-success-new-code');
  if (resetSuccessCode) resetSuccessCode.textContent = '';
  const resetSuccessIp = $('#reset-success-ip-text');
  if (resetSuccessIp) resetSuccessIp.textContent = '';
  const resetStatus = $('#reset-ip-status');
  if (resetStatus) resetStatus.textContent = '';

  currentRecoveredKeyData = null;

  if (recoveryDialog.close) recoveryDialog.close(); else recoveryDialog.removeAttribute('open');
  document.body.style.overflow = '';
}

// Triggers para alternar abas de autoatendimento
$('#tab-nav-recover-key')?.addEventListener('click', (e) => {
  e.preventDefault();
  switchRecoveryService('recover_key');
});

$('#tab-nav-reset-ip')?.addEventListener('click', (e) => {
  e.preventDefault();
  switchRecoveryService('reset_ip');
});

// Triggers para abrir o modal de recuperação
$('#nav-recovery-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openRecoveryModal('form', 'recover_key');
});

$('#nav-reset-ip-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openRecoveryModal('form', 'reset_ip');
});

$('#footer-recovery-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openRecoveryModal('form', 'recover_key');
});

$('#footer-reset-ip-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openRecoveryModal('form', 'reset_ip');
});

$('#form-recovery-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeDialog(true);
  openRecoveryModal('form', 'recover_key');
});

$('#close-recovery-dialog')?.addEventListener('click', closeRecoveryModal);

$('#btn-back-to-recovery-form')?.addEventListener('click', () => {
  const codeEl = $('#recovery-new-code-text');
  if (codeEl) codeEl.textContent = '';
  const keyEl = $('#recovery-key-code');
  if (keyEl) keyEl.textContent = '';
  currentRecoveredKeyData = null;
  showRecoveryView('form');
  switchRecoveryService('recover_key');
});

$('#btn-renew-expired-plan')?.addEventListener('click', () => {
  closeRecoveryModal();
  openModal('week_7d');
});

// Submissão do formulário de recuperação por código
$('#btn-submit-code-recovery')?.addEventListener('click', async () => {
  const orderIdInput = $('#recovery-order-id-input');
  const codeInput = $('#recovery-code-input');
  const statusEl = $('#recovery-form-status');
  const submitBtn = $('#btn-submit-code-recovery');
  const btnText = $('#btn-submit-code-recovery-text');

  const orderId = (orderIdInput?.value || '').trim();
  const code = (codeInput?.value || '').trim().toUpperCase();

  if (!orderId || orderId.length < 5) {
    if (statusEl) statusEl.textContent = 'Por favor, informe o identificador do pedido (ex: vg_ord_...).';
    orderIdInput?.focus();
    return;
  }

  if (!code || code.length < 10) {
    if (statusEl) statusEl.textContent = 'Por favor, informe seu código individual de recuperação.';
    codeInput?.focus();
    return;
  }

  if (statusEl) statusEl.textContent = '';
  submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Validando e recuperando...';

  try {
    const res = await fetch(`${CHECKOUT_API_BASE}/checkout/recover/by_code`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        recovery_code: code
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Identificador de pedido ou código inválido.');
    }

    currentRecoveredKeyData = data;
    $('#recovery-detail-plan-name').textContent = data.plan_name || 'Plano VibeGO Conect';

    // Apresenta o novo código rotacionado (MANDATÓRIO)
    const newCodeEl = $('#recovery-new-code-text');
    if (newCodeEl) newCodeEl.textContent = data.new_recovery_code || 'Novo código gerado com sucesso.';

    if (data.is_expired || data.is_revoked || !data.api_key) {
      // Assinatura expirada ou revogada: não reativa, mas entrega o novo código para histórico
      $('#recovery-detail-badge').style.background = 'rgba(239,68,68,0.15)';
      $('#recovery-detail-badge').style.borderColor = 'rgba(239,68,68,0.3)';
      $('#recovery-detail-badge').style.color = '#ef4444';
      $('#recovery-detail-status-text').textContent = data.is_revoked ? 'Acesso Revogado' : 'Assinatura Expirada';

      $('#recovery-key-active-block').style.display = 'none';
      $('#recovery-key-expired-block').style.display = 'block';
      const expDate = data.expires_at ? new Date(data.expires_at).toLocaleString('pt-BR') : '';
      $('#recovery-expired-msg').textContent = data.is_revoked
        ? 'Este acesso foi revogado pelo administrador. Contate o suporte para esclarecimentos.'
        : `Seu acesso terminou em ${expDate}. Nenhuma cobrança ou renovação automática foi gerada. Para continuar utilizando os modelos, contrate um novo período.`;

      $('#btn-download-recovered-txt').style.display = 'none';
    } else {
      // Chave ativa: exibe chave original preservada, IPs e validade
      $('#recovery-detail-badge').style.background = 'rgba(16,185,129,0.12)';
      $('#recovery-detail-badge').style.borderColor = 'rgba(16,185,129,0.3)';
      $('#recovery-detail-badge').style.color = '#10b981';
      $('#recovery-detail-status-text').textContent = 'Acesso Ativo';

      $('#recovery-key-active-block').style.display = 'block';
      $('#recovery-key-expired-block').style.display = 'none';
      $('#recovery-key-code').textContent = data.api_key;

      const expDate = data.expires_at ? new Date(data.expires_at).toLocaleDateString('pt-BR') : '';
      $('#recovery-expires-info').textContent = expDate ? `Expira em: ${expDate}` : '';
      $('#recovery-ips-info').textContent = `${(data.allowed_ips || []).length} IP(s) autorizado(s)`;

      $('#btn-download-recovered-txt').style.display = 'inline-flex';

      // Atualiza comandos do Claude Code / Codex
      updateRecoveryCliCmd(data.api_key);
    }

    showRecoveryView('detail');
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Recuperar Chave de Acesso';
  }
});

// Submissão do formulário de redefinição de IP
$('#btn-submit-reset-ip')?.addEventListener('click', async () => {
  const keyInput = $('#reset-ip-key-input');
  const codeInput = $('#reset-ip-code-input');
  const slotSelect = $('#reset-ip-slot-select');
  const statusEl = $('#reset-ip-status');
  const submitBtn = $('#btn-submit-reset-ip');
  const btnText = $('#btn-submit-reset-ip-text');

  const key = (keyInput?.value || '').trim();
  const code = (codeInput?.value || '').trim().toUpperCase();
  const slotIndex = slotSelect ? parseInt(slotSelect.value, 10) : 0;

  if (!key || !key.startsWith('vg_') || key.length < 8) {
    if (statusEl) statusEl.textContent = 'Por favor, informe uma chave de acesso válida (ex: vg_live_...).';
    keyInput?.focus();
    return;
  }

  if (!code || code.length < 10) {
    if (statusEl) statusEl.textContent = 'Por favor, informe seu código individual de recuperação (ex: VG-XXXX-XXXX-XXXX-XXXX).';
    codeInput?.focus();
    return;
  }

  if (statusEl) statusEl.textContent = '';
  submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Validando e liberando IP...';

  try {
    const res = await fetch(`${CHECKOUT_API_BASE}/recovery/reset-ip`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: key,
        recovery_code: code,
        target_slot_index: slotIndex
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Não foi possível redefinir o IP. Verifique os dados informados.');
    }

    // Exibe tela de sucesso
    const successIpEl = $('#reset-success-ip-text');
    if (successIpEl) {
      successIpEl.textContent = data.raw_ip_confirmed || data.new_ip || 'IP atualizado';
    }

    const newCodeEl = $('#reset-success-new-code');
    if (newCodeEl) {
      newCodeEl.textContent = data.new_recovery_code || 'Novo código emitido';
    }

    // Limpa campos confidenciais do form
    if (keyInput) keyInput.value = '';
    if (codeInput) codeInput.value = '';

    showRecoveryView('reset_success');
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Redefinir IP';
  }
});

// Ações da tela de sucesso de IP
$('#btn-copy-reset-new-code')?.addEventListener('click', async () => {
  const code = $('#reset-success-new-code')?.textContent || '';
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    const btn = $('#btn-copy-reset-new-code');
    if (btn) {
      btn.textContent = 'Copiado!';
      setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
    }
  } catch (e) {
    // fallback
  }
});

$('#btn-finish-reset-ip')?.addEventListener('click', () => {
  closeRecoveryModal();
});

function updateRecoveryCliCmd(key) {
  const pre = $('#recovery-cli-cmd');
  const desc = $('#recovery-cmd-desc');
  if (!pre || !key) return;

  if (currentRecoveryTool === 'Claude Code') {
    if (desc) desc.textContent = 'Cole no PowerShell para auto-instalar, configurar e iniciar:';
    pre.textContent = getClaudePowerShellScript(key);
  } else {
    if (desc) desc.textContent = 'Configure na sua extensão (Cursor/Roo Code/Cline) ou salve no Windows:';
    pre.textContent = getCodexConfigScript(key);
  }
}

// Abas de ferramenta no detalhe de recuperação
$('#tab-recovery-claude')?.addEventListener('click', () => {
  currentRecoveryTool = 'Claude Code';
  $('#tab-recovery-claude').classList.add('primary');
  $('#tab-recovery-claude').style.background = '';
  $('#tab-recovery-codex').classList.remove('primary');
  $('#tab-recovery-codex').style.background = '#252c2d';
  if (currentRecoveredKeyData?.api_key) updateRecoveryCliCmd(currentRecoveredKeyData.api_key);
});

$('#tab-recovery-codex')?.addEventListener('click', () => {
  currentRecoveryTool = 'Codex';
  $('#tab-recovery-codex').classList.add('primary');
  $('#tab-recovery-codex').style.background = '';
  $('#tab-recovery-claude').classList.remove('primary');
  $('#tab-recovery-claude').style.background = '#252c2d';
  if (currentRecoveredKeyData?.api_key) updateRecoveryCliCmd(currentRecoveredKeyData.api_key);
});

// Botão Copiar Nova Chave Recuperada
$('#btn-copy-recovered-key')?.addEventListener('click', () => {
  const key = $('#recovery-key-code')?.textContent;
  if (key) {
    navigator.clipboard.writeText(key).then(() => {
      const btn = $('#btn-copy-recovered-key');
      const old = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => btn.textContent = old, 1500);
    });
  }
});

// Botão Copiar Novo Código de Recuperação Rotacionado
$('#btn-copy-new-recovery-code')?.addEventListener('click', () => {
  const code = $('#recovery-new-code-text')?.textContent;
  if (code && !code.includes('Carregando')) {
    navigator.clipboard.writeText(code).then(() => {
      const btn = $('#btn-copy-new-recovery-code');
      const old = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => btn.textContent = old, 1500);
    });
  }
});

// Botão Copiar Comando CLI
$('#btn-copy-recovery-cmd')?.addEventListener('click', () => {
  const cmd = $('#recovery-cli-cmd')?.textContent;
  if (cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
      const btn = $('#btn-copy-recovery-cmd');
      const old = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => btn.textContent = old, 1500);
    });
  }
});

// Botão Salvar Arquivo TXT da Chave Recuperada com o Novo Código
$('#btn-download-recovered-txt')?.addEventListener('click', () => {
  if (!currentRecoveredKeyData || !currentRecoveredKeyData.api_key) return;
  const content = buildVibeGOReceipt({ order_id: currentRecoveredKeyData.order_id, key: currentRecoveredKeyData.api_key, plan: currentRecoveredKeyData.plan_name, expires: currentRecoveredKeyData.expires_at, recovery_code: currentRecoveredKeyData.new_recovery_code });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vibego_credencial_${(currentRecoveredKeyData.order_id || 'acesso').slice(-8)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches;let demoStep=0,demoPaused=false,demoVisible=false,demoTimer=0;
function paintDemo(){$('.demo-shell').dataset.step=demoStep;$$('.demo-steps li').forEach((li,i)=>li.classList.toggle('pending',i>demoStep));}
function stopDemo(){clearTimeout(demoTimer);demoTimer=0;}
function tickDemo(){stopDemo();if(reduced||demoPaused||!demoVisible||document.hidden||demoStep>=3)return;demoTimer=setTimeout(()=>{demoStep++;paintDemo();tickDemo();},1250);}
function replay(){demoStep=reduced?3:0;demoPaused=false;$('#pause-demo').textContent=reduced?'Movimento reduzido':'Pausar';paintDemo();tickDemo();}
$('#replay-demo').addEventListener('click',replay);
$('#pause-demo').addEventListener('click',()=>{demoPaused=!demoPaused;$('#pause-demo').textContent=demoPaused?'Continuar':'Pausar';demoPaused?stopDemo():tickDemo();});
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{demoVisible=entries[0].isIntersecting;demoVisible?tickDemo():stopDemo();},{threshold:.12}).observe($('.demo-shell'));else{demoVisible=true;tickDemo();}
function selectTool(name){$$('[role=tab]').forEach(b=>{const active=b.dataset.tool===name;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});$('#tool-name').textContent=name;$('#demo-context').textContent=`Fluxo ilustrativo · ${name}`;$('#demo-panel').setAttribute('aria-labelledby',name==='Codex'?'tab-codex':'tab-claude');selectRoute(name);const logo=$('#terminal-tool-logo');logo.src=name==='Codex'?'assets/brands/codex.svg':'assets/brands/claude.svg';logo.classList.toggle('brand-monochrome',name==='Codex');replay();}
$$('[role=tab]').forEach(b=>{b.addEventListener('click',()=>selectTool(b.dataset.tool));b.addEventListener('keydown',e=>{const tabs=$$('[role=tab]');let next;if(e.key==='ArrowRight'||e.key==='ArrowLeft')next=tabs.find(x=>x!==b);if(e.key==='Home')next=tabs[0];if(e.key==='End')next=tabs[1];if(next){e.preventDefault();selectTool(next.dataset.tool);next.focus();}});});
function selectRoute(name){$$('[data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===name)));$('#route-label').replaceChildren(document.createTextNode(name + ' '), document.createRange().createContextualFragment('<svg class="vg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>'), document.createTextNode(' VibeGO Conect'));}
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>selectRoute(b.dataset.route)));
let coreApi=null,corePinned=false,coreHovered=false,coreFocused=false,coreScrollOpen=false;
const coreStage=$('#interactive-core'),coreTrigger=$('.core-trigger');
function refreshCore(){const open=corePinned||coreHovered||coreFocused||coreScrollOpen;coreStage.classList.toggle('core-open',open);coreTrigger.setAttribute('aria-pressed',String(corePinned));coreApi?.setOpen(open);}
coreTrigger.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;coreHovered=true;refreshCore();});
coreStage.addEventListener('pointerleave',()=>{coreHovered=false;refreshCore();});
coreTrigger.addEventListener('focus',()=>{coreFocused=true;refreshCore();});
coreTrigger.addEventListener('blur',()=>{coreFocused=false;refreshCore();});
coreTrigger.addEventListener('click',()=>{corePinned=!corePinned;coreFocused=false;refreshCore();});
$$('[data-core-tool]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.coreTool;$$('[data-core-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('#core-tool-name').textContent=name;const logo=$('#core-tool-logo');logo.src=name==='Codex'?'assets/brands/codex.svg':'assets/brands/claude.svg';logo.classList.toggle('brand-monochrome',name==='Codex');corePinned=true;refreshCore();selectTool(name);}));
function storyEnabled(){return !reduced&&innerWidth>=1024&&innerHeight>=680;}
function syncMotionMode(){document.documentElement.classList.toggle('motion-story',storyEnabled());document.documentElement.classList.toggle('motion-ready',!reduced);}
function setReduced(value){reduced=value;document.documentElement.classList.toggle('motion-reduced',value);if(value){stopDemo();demoStep=3;paintDemo();$('#pause-demo').disabled=true;$('#pause-demo').textContent='Movimento reduzido';}else{$('#pause-demo').disabled=false;replay();}coreApi?.setReduced(value);syncMotionMode();scheduleStory();}
if(media.addEventListener)media.addEventListener('change',e=>setReduced(e.matches));else if(media.addListener)media.addListener(e=>setReduced(e.matches));
const journey=$('#continuidade'),demoShell=$('.demo-shell'),routeSection=$('#ferramentas');
const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revealObserver.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -30px 0px'}):null;
$$('.section-heading,.activation-steps article,.model-list').forEach(el=>{if(revealObserver)revealObserver.observe(el);else el.classList.add('revealed');});$$('.model-row').forEach((el,i)=>el.style.setProperty('--row',i));
$$('[data-journey-step]').forEach(button=>button.addEventListener('click',()=>{const step=Number(button.dataset.journeyStep);if(storyEnabled()){const rect=journey.getBoundingClientRect();const range=journey.offsetHeight-(innerHeight-82);window.scrollTo({top:scrollY+rect.top-82+range*[.04,.49,.97][step],behavior:reduced?'instant':'smooth'});}else{$$('.journey-screen')[step].scrollIntoView({block:'center',behavior:reduced?'instant':'smooth'});}}));
let scheduled=false;
function updateStory(){
 scheduled=false;const vh=innerHeight;const rect=journey.getBoundingClientRect();
 const raw=storyEnabled()?(82-rect.top)/Math.max(1,journey.offsetHeight-(vh-82)):(vh-rect.top)/(rect.height+vh);
 const state=journeyState(raw);const values={'journey':state.progress,'blocked':state.blocked,'access':state.access,'ready':state.ready,'door':state.door,'spread':state.spread,'blocked-y':`${state.blockedY}px`,'ready-y':`${state.readyY}px`,'blocked-scale':state.blockedScale,'access-scale':state.accessScale,'ready-scale':state.readyScale};
 Object.entries(values).forEach(([key,value])=>journey.style.setProperty(`--${key}`,value));
 $$('[data-journey-step]').forEach((b,i)=>{if(i===state.phase)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 const demo=$('#experiencia').getBoundingClientRect();const dp=reduced||innerWidth<768?1:clamp((vh-demo.top-120)/(vh*.74));
 demoShell.style.setProperty('--demo-tilt',`${(1-dp)*8}deg`);demoShell.style.setProperty('--demo-scale',.93+dp*.07);demoShell.style.setProperty('--demo-y',`${(1-dp)*38}px`);
 const route=routeSection.getBoundingClientRect();const rp=reduced?1:clamp((vh-route.top)/(vh*.7));routeSection.style.setProperty('--route-progress',rp);routeSection.style.setProperty('--route-turn',`${(1-rp)*-18}deg`);routeSection.style.setProperty('--route-scale',.88+rp*.12);
 const heroProgress=clamp(scrollY/(vh*.75));coreScrollOpen=!reduced&&heroProgress>.18&&heroProgress<1;coreApi?.setProgress(heroProgress);refreshCore();
}
function scheduleStory(){if(!scheduled){scheduled=true;requestAnimationFrame(updateStory);}}
addEventListener('scroll',scheduleStory,{passive:true});addEventListener('resize',()=>{syncMotionMode();scheduleStory();});document.addEventListener('visibilitychange',()=>{document.hidden?stopDemo():tickDemo();});
setReduced(reduced);paintDemo();
async function loadCore(){if(navigator.connection?.saveData)return;try{const {initCore}=await import('../js/core.js');coreApi=initCore($('#core-canvas'),$('.core-poster'),reduced);coreStage.classList.toggle('has-webgl',!!coreApi);refreshCore();scheduleStory();}catch{/* Static Core remains visible and every commercial control stays functional. */}}
if('requestIdleCallback' in window)requestIdleCallback(loadCore,{timeout:1800});else setTimeout(loadCore,250);
document.documentElement.dataset.vibegoReady='true';

})();
