// vibego clone - frontend mock backend using localStorage. No real payments, no real proxy.
const DB_KEY = "vibego_orders";

function loadDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || {}; }
  catch { return {}; }
}
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const PLANS = {
  trial: { label: "Trial — 1 hora", price: "R$ 19,90", ms: 60 * 60 * 1000, ips: 1 },
  "7d":  { label: "7 dias",          price: "R$ 67,90", ms: 7 * 24 * 3600 * 1000, ips: 1 },
  "14d": { label: "14 dias",         price: "R$ 127,90", ms: 14 * 24 * 3600 * 1000, ips: 1 },
  max:   { label: "Max — 30 dias",   price: "R$ 247,90", ms: 30 * 24 * 3600 * 1000, ips: 2 },
};

function randToken(len, alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789") {
  let out = "";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}
function genOrderId() { return "VBG-" + randToken(7); }
function genKey() { return "VBG-KEY-" + randToken(6) + "-" + randToken(6); }
function genRecovery() { return randToken(4) + "-" + randToken(4) + "-" + randToken(4); }
function genPixPayload(plan) {
  // visually representative EMV-like payload, not a real BR Code
  return `00020126580014BR.GOV.BCB.PIX0136${randToken(32,"0123456789abcdef")}5204000053039865406${PLANS[plan].price.replace(/\D/g,"")}5802BR5916VIBEGO CONECT6009SAOPAULO62070503***6304`;
}

// ---------- modal plumbing ----------
function openModal(id) {
  document.getElementById("modal-" + id).classList.add("active");
}
function closeModal(el) {
  el.closest(".modal-overlay").classList.remove("active");
}
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => {
    openModal(btn.dataset.open);
    const plan = btn.dataset.plan;
    if (plan) {
      const radio = document.querySelector(`input[name="plan"][value="${plan}"]`);
      if (radio) radio.checked = true;
    }
  });
});
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn));
});
document.querySelectorAll(".modal-overlay").forEach(ov => {
  ov.addEventListener("click", e => { if (e.target === ov) ov.classList.remove("active"); });
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.querySelectorAll(".modal-overlay.active").forEach(ov => ov.classList.remove("active"));
});

// ---------- copy buttons ----------
function copyFrom(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  navigator.clipboard.writeText(el.value !== undefined ? el.value : el.textContent).catch(() => {});
}
document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", () => {
    copyFrom(btn.dataset.copy);
    const old = btn.textContent;
    btn.textContent = "copiado!";
    setTimeout(() => (btn.textContent = old), 1200);
  });
});

// ---------- accordion ----------
document.querySelectorAll(".acc-head").forEach(head => {
  head.addEventListener("click", () => {
    const item = head.closest(".acc-item");
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".acc-item").forEach(i => {
      i.classList.remove("open");
      i.querySelector(".acc-ic").textContent = "+";
    });
    if (!wasOpen) {
      item.classList.add("open");
      item.querySelector(".acc-ic").textContent = "—";
    }
  });
});

// ---------- checkout flow ----------
const checkoutSteps = {
  plan: document.querySelector('[data-step="plan"]'),
  pix: document.querySelector('[data-step="pix"]'),
  done: document.querySelector('[data-step="done"]'),
};
function showStep(name) {
  Object.values(checkoutSteps).forEach(s => s.classList.add("hidden"));
  checkoutSteps[name].classList.remove("hidden");
}

let pixPollTimer = null;
let currentOrder = null;

document.getElementById("btn-gen-pix").addEventListener("click", () => {
  const plan = document.querySelector('input[name="plan"]:checked').value;
  const orderId = genOrderId();
  const payload = genPixPayload(plan);
  currentOrder = { orderId, plan, status: "pending", createdAt: Date.now() };

  document.getElementById("pix-copia-cola").value = payload;
  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), { text: payload, width: 180, height: 180 });

  showStep("pix");

  let dots = 0;
  clearInterval(pixPollTimer);
  pixPollTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    document.getElementById("pix-dots").textContent = ".".repeat(dots);
  }, 3000);
});

document.getElementById("btn-copy-pix").addEventListener("click", () => copyFrom("pix-copia-cola"));

function approvePayment() {
  clearInterval(pixPollTimer);
  const plan = currentOrder.plan;
  const key = genKey();
  const recovery = genRecovery();
  const expiresAt = Date.now() + PLANS[plan].ms;

  const db = loadDB();
  db[currentOrder.orderId] = {
    plan, key, recovery, expiresAt,
    ips: Array(PLANS[plan].ips).fill(null),
    createdAt: Date.now(),
  };
  saveDB(db);

  document.getElementById("out-key").value = key;
  document.getElementById("out-recovery").value = recovery;
  document.getElementById("out-order").value = currentOrder.orderId;
  showStep("done");
}
document.getElementById("btn-force-pay").addEventListener("click", approvePayment);

document.getElementById("btn-to-connect").addEventListener("click", () => {
  closeModal(document.querySelector("#modal-checkout .modal-close"));
  document.getElementById("modal-checkout").classList.remove("active");
  document.getElementById("manual-key").value = document.getElementById("out-key").value;
  openModal("connect");
});

// reset plan modal to step 1 whenever reopened
document.querySelector('[data-open="checkout"]').addEventListener("click", () => {
  showStep("plan");
});

// ---------- recover access ----------
document.getElementById("btn-do-recover").addEventListener("click", () => {
  const orderId = document.getElementById("rec-order").value.trim().toUpperCase();
  const code = document.getElementById("rec-code").value.trim().toUpperCase();
  const box = document.getElementById("recover-result");
  box.classList.remove("hidden", "ok", "err");

  const db = loadDB();
  const order = db[orderId];
  if (!order || order.recovery !== code) {
    box.classList.add("err");
    box.textContent = "pedido ou código inválido. Confira os dados ou fale com o suporte.";
    return;
  }
  if (order.expiresAt < Date.now()) {
    box.classList.add("err");
    box.textContent = "este acesso já expirou. Compre um novo período.";
    return;
  }
  box.classList.add("ok");
  box.textContent = `chave recuperada: ${order.key} — válida até ${new Date(order.expiresAt).toLocaleString("pt-BR")}`;
});

// ---------- reset IP ----------
document.querySelectorAll('[data-open="reset-ip"]').forEach(b => {}); // handled by generic listener
document.getElementById("btn-do-reset").addEventListener("click", () => {
  const key = document.getElementById("reset-key").value.trim();
  const code = document.getElementById("reset-code").value.trim().toUpperCase();
  const box = document.getElementById("reset-result");
  box.classList.remove("hidden", "ok", "err");

  const db = loadDB();
  const entry = Object.entries(db).find(([, o]) => o.key === key && o.recovery === code);
  if (!entry) {
    box.classList.add("err");
    box.textContent = "chave ou código de recuperação inválido.";
    return;
  }
  const [orderId, order] = entry;
  if (order.expiresAt < Date.now()) {
    box.classList.add("err");
    box.textContent = "este acesso já expirou.";
    return;
  }

  const slotWrap = document.getElementById("reset-slot-wrap");
  if (PLANS[order.plan].ips > 1) slotWrap.classList.remove("hidden");

  const newRecovery = genRecovery();
  order.recovery = newRecovery;
  order.ips = order.ips.map(() => null); // force re-bind on next use
  db[orderId] = order;
  saveDB(db);

  box.classList.add("ok");
  box.textContent = `ip redefinido. novo código de recuperação: ${newRecovery} (o anterior foi invalidado — guarde este agora)`;
});

// ---------- connect tool modal ----------
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll("[data-tab-body]").forEach(b => b.classList.add("hidden"));
    btn.classList.add("active");
    document.querySelector(`[data-tab-body="${btn.dataset.tab}"]`).classList.remove("hidden");
  });
});

document.getElementById("btn-download-msi").addEventListener("click", () => {
  const key = document.getElementById("manual-key").value || "SUA_CHAVE_AQUI";
  const ps1 = `# vibego-connect setup (mock installer output)\n$env:ANTHROPIC_BASE_URL="https://paglovers.com.br"\n$env:ANTHROPIC_API_KEY="${key}"\nWrite-Host "vibego conect configurado. Rode 'claude' normalmente."\n`;
  const blob = new Blob([ps1], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vibego-connect-setup.ps1";
  a.click();
  URL.revokeObjectURL(a.href);
});
