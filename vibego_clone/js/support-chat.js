/**
 * VibeGO Conect — Widget de Atendimento Inteligente Oficial
 * Arquitetura: Vanilla JS, Isolamento de DOM, Persistência via sessionStorage
 * Desenvolvido por: Zé do Black (ZDB) para o Marketeiro
 */

(function () {
  'use strict';

  // Chave de armazenamento de sessão
  const STORAGE_KEY = 'vibego_chat_history_v1';
  const WHATSAPP_URL = 'https://wa.me/5599984699061';
  const API_ENDPOINT = '/v1/support/chat';
  const MASCOT_URL = new URL('../assets/img/vibego-support.webp', document.currentScript.src).href;
  const ARROW = '<svg class="vg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
  const EXTERNAL = '<svg class="vg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg>';

  // Mensagem inicial oficial
  const WELCOME_TEXT = 'Olá! Sou o assistente VibeGO. Precisa de ajuda para conectar sua ferramenta ou acessar seu plano?';

  // Sugestões rápidas de suporte
  const QUICK_PROMPTS = [
    'Como configurar o Claude Code?',
    'Como configurar o Codex CLI?',
    'Erro de IP não autorizado',
    'Como recuperar meu acesso?'
  ];

  // Estado local do componente
  let chatHistory = [];
  let isSending = false;
  let isOpen = false;
  let launcherFrame = 0;

  function fitSupport() {
    const panel = document.getElementById('vibego-chat-window');
    const trigger = document.getElementById('vibego-chat-trigger');
    if (!panel || !trigger) return;
    if (window.innerWidth > 767) {
      panel.style.removeProperty('top');
      panel.style.removeProperty('height');
      panel.style.removeProperty('bottom');
      trigger.style.removeProperty('--vb-launcher-lift');
      return;
    }
    if (isOpen) {
      const viewport = window.visualViewport;
      panel.style.top = `${(viewport?.offsetTop || 0) + 10}px`;
      panel.style.height = `${Math.max(200, (viewport?.height || innerHeight) - 20)}px`;
      panel.style.bottom = 'auto';
      return;
    }
    const box = trigger.getBoundingClientRect();
    const previousLift = parseFloat(trigger.style.getPropertyValue('--vb-launcher-lift')) || 0;
    const baseTop = box.top + previousLift;
    let top = baseTop;
    // Keep the prominent assistant clear of purchase buttons while scrolling.
    const controls = document.querySelectorAll(document.body.classList.contains('connect-guide')
      ? '.actions .button, select, input, summary, .screenshot, .manual-shortcut'
      : '.actions .button, [data-plan]');
    for (let pass = 0; pass < controls.length + 1; pass++) {
      const previousTop = top;
      for (const button of controls) {
        const rect = button.getBoundingClientRect();
        if (rect.width > 0 && rect.right > box.left && rect.left < box.right && rect.top < top + box.height + 8 && rect.bottom > top - 8) {
          const nextTop = rect.top - box.height - 16;
          if (nextTop >= 88) top = Math.min(top, nextTop);
        }
      }
      if (previousTop === top) break;
    }
    trigger.style.setProperty('--vb-launcher-lift', `${Math.max(0, baseTop - top)}px`);
  }

  function scheduleSupportFit() {
    if (launcherFrame) return;
    launcherFrame = requestAnimationFrame(() => { launcherFrame = 0; fitSupport(); });
  }

  // Carrega histórico do sessionStorage
  function loadHistory() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').slice(-30);
        }
      }
    } catch (e) {
      console.warn('[VibeGO Conect Support] Falha na leitura do sessionStorage:', e);
    }
    return [
      {
        role: 'assistant',
        content: WELCOME_TEXT,
        timestamp: Date.now(),
        isInitial: true
      }
    ];
  }

  // Salva histórico no sessionStorage
  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.warn('[VibeGO Conect Support] Falha na persistência do sessionStorage:', e);
    }
  }

  // Sanitizador seguro contra XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Parser de Markdown Seguro para Mensagens do Assistente
  function renderSafeMarkdown(text) {
    if (!text) return '';

    // 1. Extrair e proteger blocos de código com delimitadores especiais
    const codeBlocks = [];
    let processed = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
      const index = codeBlocks.length;
      codeBlocks.push({
        lang: lang || 'code',
        code: code.trim()
      });
      return `@@VB_CODE_BLOCK_${index}@@`;
    });

    // 2. Extrair e proteger código inline
    const inlineCodes = [];
    processed = processed.replace(/`([^`\n]+)`/g, function (match, code) {
      const index = inlineCodes.length;
      inlineCodes.push(code);
      return `@@VB_INLINE_CODE_${index}@@`;
    });

    // 3. Escapar HTML em todo o texto circundante
    processed = escapeHtml(processed);

    // 4. Formatar negrito (**texto**)
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 5. Formatar links explicitamente permitidos
    processed = processed.replace(/(https:\/\/(?:paglovers\.com\.br|wa\.me)[^\s<>"')]+)/g, function (match) {
      const cleanUrl = match.replace(/[.,;:]+$/, '');
      try { if (!['paglovers.com.br', 'www.paglovers.com.br', 'vibegoconect.com', 'www.vibegoconect.com', 'api.vibegoconect.com', 'wa.me'].includes(new URL(cleanUrl).hostname)) return match; } catch { return match; }
      const label = cleanUrl.includes('wa.me') ? 'WhatsApp Oficial' : cleanUrl.replace('https://paglovers.com.br', '');
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    // 6. Formatar quebras de linha
    processed = processed.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
    processed = `<p>${processed}</p>`;

    // 7. Reconstituir blocos de código de forma segura
    codeBlocks.forEach(function (block, idx) {
      const escapedCode = escapeHtml(block.code);
      const codeHtml = `
        <div class="vb-code-container">
          <div class="vb-code-header">
            <span>${escapeHtml(block.lang)}</span>
            <button type="button" class="vb-code-copy-btn" data-code="${escapeHtml(block.code)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copiar
            </button>
          </div>
          <pre><code>${escapedCode}</code></pre>
        </div>
      `;
      processed = processed.replace(`@@VB_CODE_BLOCK_${idx}@@`, codeHtml);
    });

    // 8. Reconstituir código inline
    inlineCodes.forEach(function (code, idx) {
      processed = processed.replace(`@@VB_INLINE_CODE_${idx}@@`, `<code>${escapeHtml(code)}</code>`);
    });

    return processed;
  }

  // Criação dos elementos da interface no DOM
  function createChatUI() {
    // 1. Botão Flutuante (Trigger)
    const trigger = document.createElement('button');
    trigger.id = 'vibego-chat-trigger';
    trigger.setAttribute('type', 'button');
    trigger.setAttribute('aria-label', 'Abrir Assistente VibeGO Conect');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'vibego-chat-window');
    trigger.innerHTML = `
      <span class="vb-launcher-copy"><strong>Atendimento</strong><span>Como podemos ajudar?</span></span>
      <img class="vb-launcher-mascot" src="${MASCOT_URL}" alt="" width="100" height="100">
    `;

    // 2. Janela de Conversa (Modal/Drawer)
    const windowEl = document.createElement('div');
    windowEl.id = 'vibego-chat-window';
    windowEl.setAttribute('role', 'dialog');
    windowEl.setAttribute('aria-modal', 'false');
    windowEl.setAttribute('aria-hidden', 'true');
    windowEl.inert = true;
    windowEl.setAttribute('aria-labelledby', 'vb-chat-title-text');
    windowEl.innerHTML = `
      <div class="vb-chat-header">
        <img class="vb-header-mascot" src="${MASCOT_URL}" alt="" width="56" height="56">
        <div class="vb-chat-header-info">
          <h2 id="vb-chat-title-text" class="vb-chat-title">Assistente VibeGO Conect</h2>
          <span class="vb-chat-status">Atendimento com IA</span>
        </div>
        <div class="vb-chat-header-actions">
          <button type="button" class="vb-chat-header-btn" id="vb-chat-clear-btn" title="Limpar conversa" aria-label="Limpar histórico">
            <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          </button>
          <button type="button" class="vb-chat-header-btn" id="vb-chat-close-btn" title="Fechar atendimento" aria-label="Fechar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div class="vb-chat-body" id="vb-chat-body-messages" role="log" aria-live="polite">
        <!-- Mensagens renderizadas dinamicamente -->
      </div>

      <div class="vb-chat-footer">
        <form class="vb-chat-form" id="vb-chat-form">
          <input 
            type="text" 
            id="vb-chat-input" 
            class="vb-chat-input" 
            placeholder="Digite sua dúvida sobre o VibeGO..." 
            autocomplete="off" 
            maxlength="600"
            aria-label="Mensagem para o assistente"
          />
          <button type="submit" id="vb-chat-send" class="vb-chat-send-btn" aria-label="Enviar mensagem">
            <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
        <div class="vb-chat-human-option">
          <span>Prefere falar com a equipe?</span>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="vb-chat-human-link">
            Falar no WhatsApp ${EXTERNAL}
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(windowEl);

    // Eventos de Abertura / Fechamento
    trigger.addEventListener('click', toggleChat);
    document.getElementById('vb-chat-close-btn').addEventListener('click', closeChat);
    document.getElementById('vb-chat-clear-btn').addEventListener('click', clearChat);

    // Envio do Formulário
    const form = document.getElementById('vb-chat-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendMessage();
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });

    // Delegação de eventos para botões de copiar código e pills de sugestão
    windowEl.addEventListener('click', function (e) {
      // 1. Botão de Copiar Código
      const copyBtn = e.target.closest('.vb-code-copy-btn');
      if (copyBtn) {
        const codeToCopy = copyBtn.getAttribute('data-code');
        if (codeToCopy && navigator.clipboard) {
          navigator.clipboard.writeText(codeToCopy).then(function () {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.textContent = 'Copiado';
            setTimeout(function () {
              copyBtn.innerHTML = originalHtml;
            }, 1800);
          }).catch(function () {
            copyBtn.innerText = 'Falha';
          });
        }
        return;
      }

      // 2. Pills de Sugestões Rápidas
      const pill = e.target.closest('.vb-chat-pill');
      if (pill) {
        const query = pill.getAttribute('data-query');
        if (query) {
          const inputEl = document.getElementById('vb-chat-input');
          if (inputEl) {
            inputEl.value = query;
            sendMessage();
          }
        }
      }
    });

    renderMessages();
    addEventListener('scroll', scheduleSupportFit, { passive: true });
    addEventListener('resize', scheduleSupportFit);
    window.visualViewport?.addEventListener('resize', scheduleSupportFit);
    window.visualViewport?.addEventListener('scroll', scheduleSupportFit);
    document.fonts?.ready.then(scheduleSupportFit);
    fitSupport();
  }

  // Alterna visibilidade da janela
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    isOpen = true;
    const windowEl = document.getElementById('vibego-chat-window');
    const trigger = document.getElementById('vibego-chat-trigger');
    if (windowEl) { windowEl.inert = false; windowEl.setAttribute('aria-hidden', 'false'); windowEl.classList.add('vb-open'); }
    document.body.classList.add('vb-support-open');
    fitSupport();
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    scrollToBottom();
    const input = document.getElementById('vb-chat-input');
    if (input && window.innerWidth > 767) {
      setTimeout(() => input.focus(), 150);
    }
  }

  function closeChat() {
    isOpen = false;
    const windowEl = document.getElementById('vibego-chat-window');
    const trigger = document.getElementById('vibego-chat-trigger');
    if (windowEl) { windowEl.classList.remove('vb-open'); windowEl.setAttribute('aria-hidden', 'true'); windowEl.inert = true; }
    document.body.classList.remove('vb-support-open');
    fitSupport();
    trigger?.focus({ preventScroll: true });
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  // Limpa histórico
  function clearChat() {
    if (isSending) return;
    chatHistory = [
      {
        role: 'assistant',
        content: WELCOME_TEXT,
        timestamp: Date.now(),
        isInitial: true
      }
    ];
    saveHistory();
    renderMessages();
  }

  // Rola o scroll para o fim da conversa
  function scrollToBottom() {
    const body = document.getElementById('vb-chat-body-messages');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  // Renderiza todas as mensagens da conversa
  function renderMessages() {
    const container = document.getElementById('vb-chat-body-messages');
    if (!container) return;

    container.innerHTML = '';

    chatHistory.forEach(function (msg, idx) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `vb-msg ${msg.role === 'user' ? 'vb-user' : 'vb-bot'}`;

      if (msg.role === 'user') {
        msgDiv.innerHTML = `<p>${escapeHtml(msg.content)}</p>`;
      } else {
        msgDiv.innerHTML = renderSafeMarkdown(msg.content);

        // Se for a mensagem inicial de boas-vindas, anexa as pills de sugestões
        if (msg.isInitial && idx === 0) {
          const pillsDiv = document.createElement('div');
          pillsDiv.className = 'vb-chat-pills';
          pillsDiv.innerHTML = QUICK_PROMPTS.map(function (p) {
            return `
              <button type="button" class="vb-chat-pill" data-query="${escapeHtml(p)}">
                <span>${escapeHtml(p)}</span>
                <span class="vb-chat-pill-arrow" aria-hidden="true">${ARROW}</span>
              </button>
            `;
          }).join('');
          msgDiv.appendChild(pillsDiv);
        }
      }

      container.appendChild(msgDiv);
    });

    scrollToBottom();
  }

  // Exibe indicador de digitação
  function showTypingIndicator() {
    const container = document.getElementById('vb-chat-body-messages');
    if (!container) return;

    removeTypingIndicator();

    const typingDiv = document.createElement('div');
    typingDiv.id = 'vb-typing-indicator';
    typingDiv.className = 'vb-typing-indicator';
    typingDiv.setAttribute('aria-label', 'Assistente digitando...');
    typingDiv.innerHTML = `
      <span class="vb-typing-dot"></span>
      <span class="vb-typing-dot"></span>
      <span class="vb-typing-dot"></span>
    `;
    container.appendChild(typingDiv);
    scrollToBottom();
  }

  // Remove indicador de digitação
  function removeTypingIndicator() {
    const el = document.getElementById('vb-typing-indicator');
    if (el) el.remove();
  }

  // Envia a mensagem do usuário
  async function sendMessage() {
    if (isSending) return;

    const input = document.getElementById('vb-chat-input');
    const sendBtn = document.getElementById('vb-chat-send');
    if (!input) return;

    const text = input.value.trim();
    if (!text || text.length < 2) return;

    // Adiciona mensagem do usuário ao histórico local
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    chatHistory.push(userMsg);
    saveHistory();
    renderMessages();

    // Limpa campo de entrada e desabilita temporariamente
    input.value = '';
    isSending = true;
    if (sendBtn) sendBtn.disabled = true;
    showTypingIndicator();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    document.getElementById('vb-chat-clear-btn').disabled = true;
    try {
      // Prepara histórico contextual para envio (máx 6 mensagens anteriores)
      const contextHistory = chatHistory
        .filter(function (m) { return !m.isInitial; })
        .slice(-7, -1)
        .map(function (m) {
          return { role: m.role, content: m.content };
        });

      const response = await fetch(API_ENDPOINT, {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: contextHistory
        })
      });

      const data = await response.json();
      removeTypingIndicator();

      if (response.ok && data.success && data.reply) {
        chatHistory.push({
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now()
        });
      } else {
        const errorMsg = data && data.error 
          ? data.error 
          : 'Não foi possível completar a resposta agora. Para assistência imediata, acesse o WhatsApp oficial: https://wa.me/5599984699061';
        chatHistory.push({
          role: 'assistant',
          content: errorMsg,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('[VibeGO Conect Support] Erro na requisição do chat:', err);
      removeTypingIndicator();
      chatHistory.push({
        role: 'assistant',
        content: 'Houve uma oscilação na conexão com o servidor. Por favor, tente novamente ou fale com nosso suporte humano no WhatsApp: https://wa.me/5599984699061',
        timestamp: Date.now()
      });
    } finally {
      clearTimeout(timeout);
      document.getElementById('vb-chat-clear-btn').disabled = false;
      isSending = false;
      if (sendBtn) sendBtn.disabled = false;
      saveHistory();
      renderMessages();
      if (isOpen && window.innerWidth > 767) {
        input.focus();
      }
    }
  }

  // Inicialização no DOM
  function init() {
    chatHistory = loadHistory();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createChatUI);
    } else {
      createChatUI();
    }
  }

  init();
})();
