# 🚂 Railway Deploy — Passo a Passo

## 📋 Pré-requisitos
- GitHub account com este repo
- Railway account (grátis em railway.app)

---

## 🎯 3 Passos (10 minutos)

### **Passo 1: Conectar GitHub no Railway**

1. Abra https://railway.app
2. Login com GitHub
3. Clique: **New Project**
4. Clique: **Deploy from GitHub**
5. Autorize Railway a acessar seus repos
6. Selecione o repo `Lovable - Copy`

---

### **Passo 2: Configurar Variáveis de Ambiente**

Railway vai pedir as **Environment Variables**. Cole exatamente:

```
PORT=3700
NODE_ENV=production
CHROME_PATH=/usr/bin/chromium-browser

CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw

PROXY_LIST=45.38.107.97:6014:vxikkfjt:0gmdhnvcgzx3|64.137.96.74:6641:vxikkfjt:0gmdhnvcgzx3|198.23.243.226:6361:vxikkfjt:0gmdhnvcgzx3|38.154.185.97:6370:vxikkfjt:0gmdhnvcgzx3|84.247.60.125:6095:vxikkfjt:0gmdhnvcgzx3|191.96.254.138:6185:vxikkfjt:0gmdhnvcgzx3|198.46.161.42:5092:vxikkfjt:0gmdhnvcgzx3|64.137.10.153:5803:vxikkfjt:0gmdhnvcgzx3|104.164.49.38:7693:vxikkfjt:0gmdhnvcgzx3|23.26.71.145:5628:vxikkfjt:0gmdhnvcgzx3

VPN_ROTATE=1
VPN_ROTATE_EVERY=3

GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_app_google

LOG_LEVEL=info
```

**⚠️ Importante:** 
- `PROXY_LIST` é um pipe `|` separando proxies
- Cada proxy é `host:port:user:pass`
- Sem espaços!

---

### **Passo 3: Deploy**

1. Clique: **Deploy**
2. Aguarde ~2-3 minutos
3. Veja logs em tempo real
4. Status verde ✅ = pronto

---

## ✅ Resultado Final

Seu app estará em:
```
https://<seu-projeto>.up.railway.app
```

Acesso ao dashboard:
```
https://<seu-projeto>.up.railway.app/
```

---

## 📊 O que o sistema faz

- **Dashboard WebSocket** — Stats em tempo real (contas criadas, keys, tempos)
- **Fabricador de contas** — Cria Lovable accounts via API + Castle bypass
- **Proxy rotation** — Rotaciona IPs a cada N contas
- **Castle token minting** — Local HTTPS com DNS override para bypass
- **Key extraction** — Extrai chaves via Chromium/Puppeteer

---

## 🔧 Monitoramento

### Logs do Railway:
```
Railway → Deployments → [seu deploy] → Logs
```

### WebSocket Stats:
```
https://<seu-projeto>.up.railway.app/stats
```

---

## 💰 Custo

- **Crédito grátis:** $5/mês
- **Seu app usando:** ~$2-3/mês (Chromium + Node)
- **Resultado:** GRÁTIS por pelo menos 2 meses

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `castle SDK not found` | npm ci já é feito no Dockerfile |
| `chromium-browser: not found` | Alpine já tem no Dockerfile |
| `PROXY_LIST malformed` | Sem espaços, pipe `\|` separando |
| `Port 3700 não responde` | Railway leva 2-3 min pra iniciar |

---

## 📞 Suporte

- **Railway Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway
- **Status Page:** https://status.railway.app

---

**Deploy agora! 🚀**
