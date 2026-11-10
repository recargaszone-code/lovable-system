'use strict';

/**
 * Gera e aplica um fingerprint de navegador diferente por conta/sessão.
 * Tudo via injeção de JS (Page.addScriptToEvaluateOnNewDocument), nunca via
 * Emulation.setDeviceMetricsOverride — isso resize a janela real do Chrome e
 * causa letterboxing (barras cinzas), problema já resolvido antes neste projeto.
 *
 * Escopo deliberadamente limitado: NÃO mexe em UA, platform nem timezone.
 * O Chrome é real, então a UA já bate com a stack TLS/JA3 negociada de verdade;
 * trocar a UA via Network.setUserAgentOverride cria uma inconsistência
 * UA-vs-TLS que detectores avançados (Cloudflare, DataDome) checam. Timezone
 * também fica intocado porque sem rotação de IP/proxy, timezone != geoloc do
 * IP é em si um sinal de bot mais forte do que o ganho de variar.
 *
 * O que varia por sessão: hardwareConcurrency, deviceMemory, vendor/renderer
 * WebGL, ruído determinístico em canvas e AudioContext, screen.width/height
 * "lógico" (só o valor reportado por JS, não o viewport real).
 */

const RESOLUCOES_LOGICAS = [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 1600, height: 900 },
  { width: 1280, height: 720 },
  { width: 1680, height: 1050 }
];

const NUCLEOS_CPU = [4, 6, 8, 12, 16];
const MEMORIA_RAM = [4, 8, 16];

// Pares vendor/renderer de GPUs reais e comuns em máquinas Windows — mantém
// coerência entre si (não mistura vendor Intel com renderer NVIDIA).
const PERFIS_GPU = [
  { vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 580 Series Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon(TM) Vega 8 Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)' }
];

function escolher(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function gerarPerfilFingerprint() {
  return {
    resolucao: escolher(RESOLUCOES_LOGICAS),
    nucleos: escolher(NUCLEOS_CPU),
    memoria: escolher(MEMORIA_RAM),
    gpu: escolher(PERFIS_GPU),
    // seeds determinísticos por sessão: mesmo valor em todas as chamadas de
    // canvas/audio DESSA conta (consistência interna), mas diferente entre contas
    canvasSeed: Math.floor(Math.random() * 2 ** 31),
    audioSeed: Math.floor(Math.random() * 2 ** 31),
    colorDepth: escolher([24, 30]),
    sessaoId: Math.random().toString(36).slice(2, 10)
  };
}

// Script injetado roda ANTES de qualquer JS da página (addScriptToEvaluateOnNewDocument),
// então os overrides já existem no momento em que o site tenta ler esses valores.
function montarScriptInjecao(perfil) {
  return `(() => {
    try {
      // Hash determinístico por (seed, índice) — SEM estado entre chamadas.
      // Essencial: duas leituras do MESMO canvas/audio buffer têm que dar o
      // MESMO ruído, senão o output varia sozinho entre chamadas repetidas,
      // o que é uma assinatura de spoofing ainda mais forte que não mascarar
      // nada (FingerprintJS/CreepJS desenham 2x e comparam byte a byte).
      function hashRuido(seed, i) {
        let h = (seed ^ Math.imul(i, 0x9E3779B1)) >>> 0;
        h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
        h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
        h = (h ^ (h >>> 16)) >>> 0;
        return h / 4294967296;
      }
      const canvasSeed = ${perfil.canvasSeed};
      const audioSeed = ${perfil.audioSeed};

      // --- CPU / RAM ---
      Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', { get: () => ${perfil.nucleos}, configurable: true });
      if ('deviceMemory' in Navigator.prototype) {
        Object.defineProperty(Navigator.prototype, 'deviceMemory', { get: () => ${perfil.memoria}, configurable: true });
      }

      // screen.width/height spoof removido: mismatch com window.innerWidth/outerWidth
      // reais (a janela não é redimensionada de fato) podia derrubar o Turnstile pro
      // modo interativo. Tela fica real, sem spoof nessa camada.

      // --- WebGL vendor/renderer (técnica clássica de spoof; derrota fingerprint
      // via UNMASKED_VENDOR_WEBGL/UNMASKED_RENDERER_WEBGL; NÃO derrota detectores
      // que fazem readback de pixel pós-render de um shader conhecido e comparam
      // contra o perfil de GPU declarado — esse nível de checagem é raro fora de
      // antifraude bancário/pagamento) ---
      const gpuVendor = '${perfil.gpu.vendor}';
      const gpuRenderer = '${perfil.gpu.renderer}';
      function patchGetParameter(proto) {
        const orig = proto.getParameter;
        proto.getParameter = function(param) {
          if (param === 37445) return gpuVendor;   // UNMASKED_VENDOR_WEBGL
          if (param === 37446) return gpuRenderer;  // UNMASKED_RENDERER_WEBGL
          return orig.call(this, param);
        };
      }
      try { patchGetParameter(WebGLRenderingContext.prototype); } catch(e) {}
      try { patchGetParameter(WebGL2RenderingContext.prototype); } catch(e) {}

      // --- Ruído de canvas (defeat: fingerprint via toDataURL/getImageData hash;
      // caught by: comparação estatística entre múltiplos frames da mesma sessão
      // — por isso o ruído aqui é puramente f(seed, índice), nunca muda entre
      // chamadas repetidas no mesmo conteúdo) ---
      function aplicarRuidoImageData(imageData) {
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 97) { // passo primo evita padrão visível
          const delta = Math.floor(hashRuido(canvasSeed, i) * 3) - 1; // -1, 0 ou +1
          d[i] = Math.min(255, Math.max(0, d[i] + delta));
        }
        return imageData;
      }
      const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function(...args) {
        const data = origGetImageData.apply(this, args);
        return aplicarRuidoImageData(data);
      };
      const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(...args) {
        // Nunca escreve de volta no canvas original (putImageData nele seria
        // destrutivo e faria chamadas repetidas acumularem ruído sobre ruído).
        // Copia pra um canvas offscreen, aplica o ruído só na cópia, e serializa
        // a cópia — o canvas original e o resto da página ficam intocados.
        try {
          const w = this.width, h = this.height;
          const off = document.createElement('canvas');
          off.width = w; off.height = h;
          const octx = off.getContext('2d');
          octx.drawImage(this, 0, 0);
          const imgData = origGetImageData.call(octx, 0, 0, w, h);
          aplicarRuidoImageData(imgData);
          octx.putImageData(imgData, 0, 0);
          return origToDataURL.apply(off, args);
        } catch (e) {
          return origToDataURL.apply(this, args);
        }
      };

      // --- Ruído de AudioContext (defeat: fingerprint via análise do espectro
      // gerado por OscillatorNode/AnalyserNode; mesmo princípio de hash sem estado) ---
      if (window.AudioBuffer) {
        const origGetChannelData = AudioBuffer.prototype.getChannelData;
        AudioBuffer.prototype.getChannelData = function(...args) {
          const data = origGetChannelData.apply(this, args);
          for (let i = 0; i < data.length; i += 100) {
            data[i] += (hashRuido(audioSeed, i) - 0.5) * 0.0000001;
          }
          return data;
        };
      }
    } catch (e) {}
  })();`;
}

/**
 * Aplica o perfil numa page via CDP. Chamar logo após criar a page, antes de
 * qualquer page.goto(). Reaplicar em cada nova aba/page do mesmo "lote de conta"
 * com o MESMO perfil (reaproveitar o objeto retornado por gerarPerfilFingerprint)
 * pra manter consistência interna da sessão.
 */
async function aplicarFingerprint(page, perfil) {
  // page.evaluateOnNewDocument (API oficial do puppeteer-core) em vez de mandar
  // Page.addScriptToEvaluateOnNewDocument via CDP raw numa sessão paralela: a
  // sessão paralela criada por page.target().createCDPSession() não compartilha
  // o mesmo binding de frame/world que o puppeteer usa internamente pra navegar,
  // então o script registrado nela nunca disparava na prática.
  await page.evaluateOnNewDocument(montarScriptInjecao(perfil));
}

module.exports = { gerarPerfilFingerprint, aplicarFingerprint };
