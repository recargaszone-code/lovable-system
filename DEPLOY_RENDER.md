# 🚀 Deploy no Render (SEM VPN)

**Status:** ✅ Pronto para deploy

---

## 🎯 3 Passos (15 min)

### **1. Conectar GitHub**

```bash
git remote add origin https://github.com/SEU_USER/lovable-system.git
git branch -M main
git push -u origin main
```

### **2. Render Dashboard**

1. Abrir: https://dashboard.render.com
2. Login com GitHub
3. "New +" → "Web Service"
4. Conectar repo
5. Preencher:

```
Name: lovable-fabricador
Runtime: Docker
Build Command: (deixar vazio)
Start Command: node dashboard.js
Plan: Free (ou Starter)
```

### **3. Environment Variables**

Preencher exatamente:

```
PORT=3700
NODE_ENV=production
CHROME_PATH=/usr/bin/chromium-browser

CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw

PROXY_LIST=45.38.107.97:6014:vxikkfjt:0gmdhnvcgzx3|64.137.96.74:6641:vxikkfjt:0gmdhnvcgzx3|198.23.243.226:6361:vxikkfjt:0gmdhnvcgzx3|38.154.185.97:6370:vxikkfjt:0gmdhnvcgzx3|84.247.60.125:6095:vxikkfjt:0gmdhnvcgzx3|191.96.254.138:6185:vxikkfjt:0gmdhnvcgzx3|198.46.161.42:5092:vxikkfjt:0gmdhnvcgzx3|64.137.10.153:5803:vxikkfjt:0gmdhnvcgzx3|104.164.49.38:7693:vxikkfjt:0gmdhnvcgzx3|23.26.71.145:5628:vxikkfjt:0gmdhnvcgzx3

VPN_ROTATE=0
VPN_ROTATE_EVERY=3
LOG_LEVEL=info
```

### **4. Deploy**

Clique "Create Web Service" → Aguarde ~3-5 min

---

## ✅ Resultado

```
https://lovable-fabricador.onrender.com/
```

---

## 📝 Usar via API

```bash
# Dashboard WebSocket
ws://lovable-fabricador.onrender.com/

# Health check
curl https://lovable-fabricador.onrender.com/health

# Stats
https://lovable-fabricador.onrender.com/stats
```

---

## 🔄 Criar Contas

Via SSH/terminal (local):

```bash
# Vai usar os proxies do .env.railway
PROXY_LIST="..." node fabricador_api.js 5
```

---

## 💰 Custo

| Plan | Preço | Storage | CPU |
|------|-------|---------|-----|
| Free | $0 | 0.5GB | Shared |
| Starter | $7/mês | 1GB | 0.5 CPU |

---

## 📖 Documentação

- Render Docs: https://render.com/docs
- Docker: https://docs.docker.com
- Node.js: https://nodejs.org/docs

---

**Tá tudo pronto. Bora fazer deploy!** 🚀
