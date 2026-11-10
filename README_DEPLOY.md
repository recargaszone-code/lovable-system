# 🚀 Lovable Assist - Deploy Guide

Deploy rápido e seguro no Render!

## 📋 Arquivos de Deploy

- **`Dockerfile`** - Container com Node.js + Chrome
- **`render.yaml`** - Configuração do Render (automática)
- **`.dockerignore`** - Otimizar tamanho da imagem
- **`.env.example`** - Template de variáveis
- **`DEPLOY_RENDER_QUICK_START.md`** - Guia rápido (⭐ comece aqui!)
- **`GUIA_DEPLOY_RENDER.md`** - Guia completo
- **`adjust-for-render.js`** - Script de ajuste

## ⚡ Quick Start (5 minutos)

### 1️⃣ Preparar
```bash
node adjust-for-render.js
```

### 2️⃣ Commit
```bash
git add .
git commit -m "chore: prepare for Render"
git push origin main
```

### 3️⃣ Deploy
1. Abrir https://dashboard.render.com
2. Clicar **New** → **Web Service**
3. Conectar repositório GitHub
4. Preencher variáveis de ambiente
5. Clicar **Create Web Service**

**Pronto! ✨ App rodando em ~5 minutos**

→ Leia **`DEPLOY_RENDER_QUICK_START.md`** para mais detalhes

## 📚 Documentação Completa

### Para iniciantes:
- **`DEPLOY_RENDER_QUICK_START.md`** (5 min)

### Para entender tudo:
- **`GUIA_DEPLOY_RENDER.md`** (completo)

### Para VPS tradicional:
- **`GUIA_MIGRACAO_VPS.md`** (Ubuntu/Linux)

## 🔧 Configuração

### Variáveis Obrigatórias
```
CASTLE_PK          # seu castle public key
FIREBASE_API_KEY   # seu firebase api key
PROXY_URL          # http://user:pass@proxy:port
GMAIL_USER         # seu gmail
GMAIL_APP_PASSWORD # gmail app password
```

### Variáveis Opcionais
```
VPN_ROTATE         # 1 ou 0 (rotacionar VPN)
LOG_LEVEL          # info, debug, error
NODE_ENV           # production
```

## 📊 Monitoramento

Após deploy:
1. Dashboard Render → lovable-dashboard
2. **Logs** - Ver erros e progresso
3. **Metrics** - CPU, RAM, requisições
4. **Alerts** - Configurar notificações

## 🆘 Troubleshooting

### Build falhou?
```
Dashboard → Logs
```
Verificar mensagem de erro.

### App offline?
1. Verificar health check: `/health`
2. Ver logs: `Dashboard → Logs`
3. Upgradear plano se falta memória

### Chrome não inicia?
Erro comum no build. Dockerfile já resolve!

## 💰 Custo

| Serviço | Preço |
|---------|-------|
| Web Service (Starter) | $7/mês |
| Web Service (Standard) | $12/mês |
| PostgreSQL (opcional) | $7/mês |

## 🎯 Status de Deploy

Após criar serviço no Render:

```
Building... → Build Success → Running
```

URL gerada: `https://lovable-dashboard.onrender.com`

## 📞 Links Úteis

- 🏠 [Render Dashboard](https://dashboard.render.com)
- 📖 [Render Docs](https://render.com/docs)
- 🐳 [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- 🤖 [Puppeteer Docker](https://github.com/browserless/chrome)

## ✅ Checklist Pré-Deploy

- [ ] `node adjust-for-render.js` passou OK
- [ ] Código em GitHub
- [ ] Conta Render criada
- [ ] Variáveis de ambiente prontas
- [ ] Proxy URL testado
- [ ] `package.json` com script start

## 🚀 Depois de Deployado

### Monitorar
- Logs: `Dashboard → Logs`
- Metrics: `Dashboard → Metrics`

### Atualizar
Simples! Basta fazer `git push`:
```bash
git commit -am "fix: bug"
git push origin main
```
Render faz deploy automático!

### Rollback
Se quebrar algo:
1. `Dashboard → Deployments`
2. Clicar deploy anterior
3. Clicar "Redeploy"

## 💡 Dicas

✅ Health check em `/health` já está configurado
✅ Dockerfile otimizado com Alpine Linux
✅ Variáveis sensíveis são criptografadas
✅ Auto-deploy a cada push para main
✅ Free tier tem limitações — consider Standard para produção

---

**Dúvidas? Comece por `DEPLOY_RENDER_QUICK_START.md`! 🚀**
