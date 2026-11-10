const crypto = require('crypto');

// Posição física viva do cursor
let mouseState = {
  x: crypto.randomInt(120, 450),
  y: crypto.randomInt(100, 350),
  velocidadeAtual: 0
};

// Gera caminho multi-ponto com física e inércia real (Spline/Bézier de alta ordem)
function gerarCurvaBiologica(p0, p3) {
  const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  
  // 1 ou 2 pontos intermediários dinâmicos que simulam a curva natural do braço
  const curvatura = (Math.random() - 0.5) * Math.min(200, dist * 0.45);
  const angulo = Math.atan2(p3.y - p0.y, p3.x - p0.x) + (Math.PI / 2);

  const midX = (p0.x + p3.x) / 2 + Math.cos(angulo) * curvatura;
  const midY = (p0.y + p3.y) / 2 + Math.sin(angulo) * curvatura;

  const p1 = {
    x: p0.x * 0.6 + midX * 0.4 + (Math.random() - 0.5) * 30,
    y: p0.y * 0.6 + midY * 0.4 + (Math.random() - 0.5) * 30
  };

  const p2 = {
    x: midX * 0.4 + p3.x * 0.6 + (Math.random() - 0.5) * 20,
    y: midY * 0.4 + p3.y * 0.6 + (Math.random() - 0.5) * 20
  };

  return { p0, p1, p2, p3 };
}

function calcularPontoBezier(t, c) {
  const u = 1 - t;
  return {
    x: u * u * u * c.p0.x + 3 * u * u * t * c.p1.x + 3 * u * t * t * c.p2.x + t * t * t * c.p3.x,
    y: u * u * u * c.p0.y + 3 * u * u * t * c.p1.y + 3 * u * t * t * c.p2.y + t * t * t * c.p3.y
  };
}

/**
 * Movimento de mouse indistinguível de humano:
 * - Aceleração com perfil biológico (lei de Fitts)
 * - Micro-pausas fisiológicas no meio do movimento (hesitação visual)
 * - Jitter biométrico não-uniforme
 * - Correção de overshoot real
 */
async function moverMouseUltraHumano(page, destino) {
  const origem = { x: mouseState.x, y: mouseState.y };
  const dist = Math.hypot(destino.x - origem.x, destino.y - origem.y);
  const curva = gerarCurvaBiologica(origem, destino);

  // Quantidade de passos baseada na distância + variação aleatória
  const passos = Math.max(30, Math.min(85, Math.floor(dist / 8) + crypto.randomInt(15, 30)));
  const pontoPausaHesitacao = Math.random() < 0.35 ? Math.floor(passos * (0.4 + Math.random() * 0.3)) : -1;

  for (let i = 1; i <= passos; i++) {
    const t = i / passos;
    // Curva de velocidade biológica: acelera no começo, desacelera suavemente no alvo
    const tBiologico = Math.sin((t * Math.PI) / 2);
    const ponto = calcularPontoBezier(tBiologico, curva);

    // Ruído muscular de tremor em sub-pixels (±1.4px)
    const ruídoTremorX = (Math.random() - 0.5) * 1.6;
    const ruídoTremorY = (Math.random() - 0.5) * 1.6;

    await page.mouse.move(ponto.x + ruídoTremorX, ponto.y + ruídoTremorY);

    // Hesitação biológica momentânea no meio do movimento (humano recalculando a rota do olho)
    if (i === pontoPausaHesitacao) {
      await new Promise(r => setTimeout(r, crypto.randomInt(60, 160)));
    } else {
      await new Promise(r => setTimeout(r, crypto.randomInt(5, 16)));
    }
  }

  // Overshoot fisiológico em ~45% dos casos (o ponteiro passa 3 a 8 pixels do alvo e volta)
  if (Math.random() < 0.45 && dist > 80) {
    const dx = (destino.x - origem.x) / dist;
    const dy = (destino.y - origem.y) / dist;
    const overshootDist = crypto.randomInt(3, 9);
    
    await page.mouse.move(destino.x + dx * overshootDist, destino.y + dy * overshootDist);
    await new Promise(r => setTimeout(r, crypto.randomInt(70, 150)));
    await page.mouse.move(destino.x, destino.y);
    await new Promise(r => setTimeout(r, crypto.randomInt(40, 90)));
  }

  mouseState.x = destino.x;
  mouseState.y = destino.y;
}

/**
 * Exploração espontânea do usuário ao carregar a página:
 * Movimentos caóticos de leitura, rolagens orgânicas com pausas realistas
 */
async function presencaOrganicaTotal(page) {
  try {
    const totalAcoes = crypto.randomInt(3, 6);
    for (let a = 0; a < totalAcoes; a++) {
      const p = {
        x: crypto.randomInt(100, 850),
        y: crypto.randomInt(100, 600)
      };
      await moverMouseUltraHumano(page, p);
      await new Promise(r => setTimeout(r, crypto.randomInt(300, 800)));

      // Rola a página como alguém conferindo o layout
      if (Math.random() < 0.45) {
        const delta = (Math.random() < 0.5 ? 1 : -1) * crypto.randomInt(70, 200);
        await page.mouse.wheel({ deltaY: delta });
        await new Promise(r => setTimeout(r, crypto.randomInt(350, 750)));
      }
    }
  } catch(e) {}
}

/**
 * Digitação totalmente não-linear com ritmo humano:
 * Pausas em pontuações, variações de velocidade e erros de digitação corrigidos
 */
async function digitarHumanoReal(page, texto) {
  for (let idx = 0; idx < texto.length; idx++) {
    const char = texto[idx];

    // 4% de chance de errar uma letra vizinha e dar Backspace (como um humano real)
    if (Math.random() < 0.04 && idx > 2 && idx < texto.length - 2 && char !== '@' && char !== '.') {
      const charErrado = String.fromCharCode(char.charCodeAt(0) + (Math.random() < 0.5 ? 1 : -1));
      await page.keyboard.sendCharacter(charErrado);
      await new Promise(r => setTimeout(r, crypto.randomInt(180, 380)));
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, crypto.randomInt(120, 260)));
    }

    await page.keyboard.sendCharacter(char);

    // Cadência dinâmica: pausas para pensar em caracteres especiais e intervalos aleatórios
    let tempoEspera = crypto.randomInt(50, 130);
    if (char === '@' || char === '.' || idx === 0 || idx === Math.floor(texto.length / 2)) {
      tempoEspera += crypto.randomInt(180, 480);
    } else if (Math.random() < 0.15) {
      tempoEspera += crypto.randomInt(90, 220);
    }
    await new Promise(r => setTimeout(r, tempoEspera));
  }
}

/**
 * Clique humano descentralizado com hesitação física realista
 */
async function clicarHumano(page, elementHandle) {
  if (!elementHandle) return false;
  const box = await elementHandle.boundingBox();
  if (!box) return false;

  // Clica num ponto orgânico disperso (nunca no meio exato)
  const destino = {
    x: box.x + box.width * (0.20 + Math.random() * 0.60),
    y: box.y + box.height * (0.25 + Math.random() * 0.50)
  };

  await moverMouseUltraHumano(page, destino);
  // Hesitação visual pré-clique
  await new Promise(r => setTimeout(r, crypto.randomInt(180, 420)));
  await page.mouse.down();
  // Tempo de contato físico do dedo na tecla do mouse
  await new Promise(r => setTimeout(r, crypto.randomInt(65, 150)));
  await page.mouse.up();
  await new Promise(r => setTimeout(r, crypto.randomInt(120, 280)));
  return true;
}

async function clicarHumanoPorSeletor(page, seletor) {
  try {
    const el = await page.$(seletor);
    return await clicarHumano(page, el);
  } catch (e) {
    return false;
  }
}

async function clicarHumanoPorTexto(page, textos) {
  try {
    const handle = await page.evaluateHandle((textosAlvo) => {
      const alvos = textosAlvo.map(t => t.toLowerCase());
      const els = Array.from(document.querySelectorAll('button, div[role="button"], span, div, p'));
      return els.find(el => {
        const txt = (el.innerText || el.textContent || '').trim().toLowerCase();
        return alvos.some(a => txt === a) && !el.disabled;
      }) || null;
    }, textos);
    const el = handle.asElement();
    if (!el) { await handle.dispose(); return false; }
    const ok = await clicarHumano(page, el);
    await handle.dispose();
    return ok;
  } catch (e) {
    return false;
  }
}

const SELETOR_NOME = 'input[name="fullName"], input[name="name"], input[placeholder*="name" i], input[autocomplete="name"], input[type="text"]';

async function preencherNomeComConfirmacao(page, nome, tentativas = 3) {
  for (let t = 1; t <= tentativas; t++) {
    try {
      await page.waitForSelector(SELETOR_NOME, { timeout: 10000, visible: true });
      const inputNome = await page.$(SELETOR_NOME);
      if (!inputNome) throw new Error('Campo de nome não encontrado');

      await clicarHumano(page, inputNome);
      await inputNome.click({ clickCount: 3 });
      await page.keyboard.press('Backspace').catch(() => {});
      await digitarHumanoReal(page, nome);

      const val = await inputNome.evaluate(el => el.value);
      if (val && val.trim().length > 0) return val;
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      await new Promise(r => setTimeout(r, 1200));
    }
  }
  return null;
}

async function aguardarEClicarPorTexto(page, textos, timeoutMs = 15000) {
  const inicio = Date.now();
  while (Date.now() - inicio < timeoutMs) {
    const ok = await clicarHumanoPorTexto(page, textos);
    if (ok) return true;
    await new Promise(r => setTimeout(r, 550));
  }
  return false;
}

module.exports = {
  moverMouseHumano: moverMouseUltraHumano,
  simularPresencaHumanaInicial: presencaOrganicaTotal,
  digitarHumanoAleatorio: digitarHumanoReal,
  clicarHumano,
  clicarHumanoPorSeletor,
  clicarHumanoPorTexto,
  preencherNomeComConfirmacao,
  aguardarEClicarPorTexto
};
