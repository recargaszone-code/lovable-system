# ⚡ Quick Start: Deploy Render (5 minutos)

## Passo 1: Preparar Código (1 min)
```bash
# Executar script de ajuste
node adjust-for-render.js

# Verificar saída
✅ castle_bypass.js - Ajustado
✅ dashboard.js - Ajustado
```

---

## Passo 2: Fazer Commit (1 min)
```bash
git add .
git commit -m "chore: prepare for Render deployment

- Add Dockerfile with Alpine Linux
- Add render.yaml for Render deployment
- Adjust Chrome path for Linux
- Configure environment variables"
git push origin main
```

---

## Passo 3: Criar Serviço no Render (2 min)

### 3.1 Abrir Render
→ https://dashboard.render.com

### 3.2 Novo Serviço
Clicar: **New +** → **Web Service**

### 3.3 Conectar Repositório
- Selecionar seu repositório GitHub
- Permitir acesso

### 3.4 Configurar

| Campo | Valor |
|-------|-------|
| Name | `lovable-dashboard` |
| Environment | `Docker` |
| Region | `Oregon` |
| Branch | `main` |
| Plan | `Starter` ($7/mês) |

### 3.5 Adicionar Variáveis

Clicar em **"Advanced"** → **"Environment"**

Adicionar:
```
CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw
PROXY_URL=http://user:pass@proxy.com:10000
VPN_ROTATE=1
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_app
LOG_LEVEL=info
```

### 3.6 Deploy!
Clicar: **"Create Web Service"**

Render faz o resto! ✨

---

## Passo 4: Monitorar Deploy (1 min)

### Ver Progresso
→ Dashboard → **lovable-dashboard** → **Logs**

```
Build starting...
Building Docker image...
Installing dependencies...
✓ Build successful
Application started on port 3700
```

### URL do App
```
https://lovable-dashboard.onrender.com
```

---

## 📊 URLs Importantes

| O quê | Onde |
|------|------|
| Dashboard | https://dashboard.render.com |
| Meu Serviço | https://dashboard.render.com/services |
| Logs | Dashboard → lovable-dashboard → Logs |
| Settings | Dashboard → lovable-dashboard → Settings |
| Status | https://status.render.com |

---

## 🔧 Se Algo Deu Errado

### Build falhou?
```
Dashboard → lovable-dashboard → Logs
(ver mensagem de erro)
```

**Comum:**
- Chrome não instalou → Aumentar timeout
- npm install falhou → Verificar package.json
- Porta ocupada → Render usa PORT env var

### Aplicação offline?
1. Verificar logs: `Dashboard → Logs`
2. Health check falhou? Adicionar endpoint `/health`:
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

### Memória insuficiente?
Upgradear plano:
- Starter: 512MB
- Standard: 2GB (recomendado)
- Pro: 8GB

---

## ✅ Checklist

- [ ] Script `adjust-for-render.js` rodou OK
- [ ] Código fez push para GitHub
- [ ] Render conectou ao repositório
- [ ] Deploy iniciou
- [ ] URL gerada e acessível
- [ ] Logs visíveis
- [ ] Variáveis de ambiente salvas (com senha mascarada)
- [ ] Health check funcionando

---

## 🚀 Próximos Passos

### Se tudo OK:
1. ✅ App rodando em `https://lovable-dashboard.onrender.com`
2. 📊 Monitorar logs periodicamente
3. 🔐 Adicionar domínio customizado (opcional)
4. ⚙️ Configurar alertas no Slack (opcional)

### Se precisar mais poder:
1. Upgradear para **Standard** ($12/mês)
2. Adicionar **PostgreSQL** ($7/mês)
3. Adicionar **Background Worker** para criar contas em paralelo

---

## 💡 Dicas

### Auto-deploy
Toda vez que der `git push`, Render faz deploy automático automaticamente!

### Logs ao vivo
```bash
# Terminal - ver logs em tempo real
# (Render não oferece CLI, mas dashboard atualiza a cada segundo)
```

### Rollback
Se quebrar algo:
1. Dashboard → lovable-dashboard → Deployments
2. Clicar deploy anterior
3. Clicar "Redeploy"

### Variáveis sensíveis
Render criptografa automaticamente todas as env vars!

---

## 🆘 Suporte

- 📚 [Docs Render](https://render.com/docs)
- 🤖 [Puppeteer em Docker](https://github.com/browserless/chrome)
- 💬 [Community](https://render.com/support)

---

**Dúvidas? Leia `GUIA_DEPLOY_RENDER.md` para versão completa! 📖**
