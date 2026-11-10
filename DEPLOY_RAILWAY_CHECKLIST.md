# ✅ Railway Deploy - Checklist Passo-a-Passo

Simples, rápido e fácil!

---

## 📋 FASE 1: Preparação (5 min)

### Git & Código
```bash
# Verificar status
git status

# Ter código em GitHub/GitLab/Bitbucket
# Ter branch principal = "main"
```

- [ ] Código em Git
- [ ] Branch é "main"
- [ ] package.json tem "start" script
- [ ] npm install rodou OK

### Executar Script de Ajuste
```bash
node adjust-for-render.js
```

Esperado:
```
✅ castle_bypass.js - Ajustado
✅ dashboard.js - Ajustado
```

- [ ] Script rodou sem erros
- [ ] Arquivos foram ajustados

### Fazer Commit
```bash
git add .
git commit -m "chore: prepare for Railway deployment"
git push origin main
```

- [ ] Commits aparecem no GitHub
- [ ] Nenhum arquivo .env commitado

---

## 🚀 FASE 2: Criar Conta Railway (5 min)

### Criar Conta
```
https://railway.app
```

Login com:
- [ ] GitHub (recomendado)
- [ ] GitLab
- [ ] Google

### Verificar Email
- [ ] Clique no link de confirmação

### Dashboard Acessível
```
https://railway.app/dashboard
```

- [ ] Dashboard carrega OK
- [ ] Seu nome aparece

---

## 🔗 FASE 3: Conectar GitHub (5 min)

### Novo Projeto
```
Dashboard → "New Project" → "Deploy from GitHub"
```

- [ ] Clicou em "New Project"
- [ ] Escolheu "Deploy from GitHub"

### Autorizar GitHub
Railway pede permissão:
- [ ] Clicou "Authorize"
- [ ] GitHub conectado

### Selecionar Repo
```
Escolher: seu repositório lovable-assist
```

- [ ] Repositório selecionado
- [ ] Railway detectou Dockerfile
- [ ] railway.json foi detectado

---

## 📝 FASE 4: Configurar Variáveis (5 min)

### Adicionar Variáveis de Ambiente

Clicar: **"Variables"** e adicionar cada uma:

```
CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
```
- [ ] Adicionada

```
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw
```
- [ ] Adicionada

```
PROXY_URL=http://user:pass@proxy.com:10000
```
- [ ] Adicionada
- [ ] Testada localmente: `curl -x URL`

```
VPN_ROTATE=1
```
- [ ] Adicionada

```
GMAIL_USER=seu_email@gmail.com
```
- [ ] Adicionada

```
GMAIL_APP_PASSWORD=sua_senha
```
- [ ] Adicionada

```
LOG_LEVEL=info
```
- [ ] Adicionada

### Verificar Segurança
- [ ] Todas as variáveis sensíveis marcadas como "Secret"
- [ ] Nenhuma variável visível em logs

---

## 🚀 FASE 5: Deploy (10 min)

### Iniciar Deploy
```
Clicar: "Deploy"
```

**Railway automaticamente:**
1. Clona repo do GitHub
2. Detecta Dockerfile
3. Faz build (2-3 min)
4. Inicia container
5. Vai LIVE

- [ ] Clicou "Deploy"
- [ ] Build iniciou (ver progresso)

### Monitorar Build
```
Dashboard → seu projeto → "Deployments"
```

Procure por status:
```
Building → Build successful → Deploying → Running
```

- [ ] Status: "Building" (esperado no início)
- [ ] Sem erros aparentes (check logs se houver)

### Esperar Conclusão
- [ ] Status muda para "Running" (verde)
- [ ] Build demorou ~2-3 min

---

## ✅ FASE 6: Verificar Deploy (5 min)

### Ver URL Gerada
```
Dashboard → seu projeto → "Domains"
```

Railway mostra:
```
Gerado: lovable-assist-production.up.railway.app
(ou similar)
```

- [ ] URL foi gerada
- [ ] URL tem .railway.app no final

### Testar Health Check
```bash
curl https://SEU_URL.railway.app/health

# Esperado:
# {"status":"ok","uptime":123.45,...}
```

- [ ] `/health` retorna 200
- [ ] JSON com "status":"ok"

### Acessar Dashboard
```
https://SEU_URL.railway.app
```

Deve mostrar:
- Título "Lovable Fabricador"
- Botões (Start/Stop)
- Stats com números

- [ ] Dashboard carrega
- [ ] Sem erro de conexão
- [ ] Elementos visíveis

### Verificar Logs
```
Dashboard → seu projeto → "Logs"
```

Procure por:
```
✓ Server running on port 3700
✓ Application started
✗ (não deve ter ERROR ou FAILED)
```

- [ ] Logs visíveis
- [ ] "port 3700" aparece
- [ ] Sem erros de Chrome
- [ ] Sem erros de rede

---

## 🎉 FASE 7: Pronto! (Pós-Deploy)

### Funciona?
- [ ] URL acessível
- [ ] Health check 200
- [ ] Dashboard carrega
- [ ] Logs sem erros

### Próximos Passos
- [ ] Guarde a URL (você vai precisar)
- [ ] Teste com dados reais
- [ ] Monitore logs periodicamente
- [ ] Configure domínio customizado (opcional)

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Build Falhou?
```
Dashboard → Logs
Procure por: ERROR
Google a mensagem
```

**Comum:**
- `npm install error` → Check package.json
- `Chrome not found` → Dockerfile OK, aguarde
- `Cannot find module` → Falta dependência

**Ação:** Corrigir, `git push`, Railway faz deploy automático

### App Não Sobe?
```
Dashboard → Logs
Procure por: Application started
```

Se não ver:
1. Check `/health` endpoint
2. Ver `NODE_ENV=production`
3. Ver `PORT=3700`

### Proxy Não Funciona?
```bash
# Testar local:
curl -x http://user:pass@proxy:10000 https://api.lovable.dev

# Em Railway:
1. Verify PROXY_URL no dashboard
2. Check typos
3. Ver logs pra erro de proxy
```

### Memória Insuficiente?
```
Dashboard → Metrics
Se Memory ~100%:
1. Upgrade plano
2. Ou otimizar código
```

---

## 💰 Custo Verificado

**FREE Tier Railway:**
```
$5/mês de crédito
Suficiente pra 1-2 serviços pequenos
Perfeito pra começar
```

- [ ] Verificou custos
- [ ] OK com $0-5/mês

---

## ✨ Status Final

- [ ] FASE 1: Preparação ✓
- [ ] FASE 2: Conta Railway ✓
- [ ] FASE 3: GitHub Conectado ✓
- [ ] FASE 4: Variáveis Configuradas ✓
- [ ] FASE 5: Deploy Iniciado ✓
- [ ] FASE 6: Deploy Verificado ✓
- [ ] FASE 7: Tudo Funcionando ✓

---

## 🎯 Resumo

```
✅ Deploy live em Railway
��� URL pública gerada
✅ Health check OK
✅ Dashboard acessível
✅ Logs sem erros
✅ Proxy funcionando
✅ Custo: $0-5/mês
```

---

## 🚀 Próximo Passo

### Imediatamente
- Testar app em produção
- Monitorar logs
- Verificar proxy está funcionando

### Semana que vem
- Adicionar domínio customizado (opcional)
- Otimizar performance se necessário
- Configurar alertas Slack (opcional)

### Mês que vem
- Considerar upgradear plano se crescer
- Adicionar banco de dados se precisar
- Migrar para VPS/Render se escalar muito

---

## 📞 Precisa de Ajuda?

| Problema | Solução |
|----------|---------|
| Deploy falhou | `GUIA_DEPLOY_RAILWAY.md` → Troubleshooting |
| Como configurar domínio? | `GUIA_DEPLOY_RAILWAY.md` → Seção 6 |
| Como aumentar recursos? | `GUIA_DEPLOY_RAILWAY.md` → Seção 9 |
| Como fazer rollback? | `GUIA_DEPLOY_RAILWAY.md` → Seção 12 |

---

**🎉 Parabéns! Seu app está no ar em Railway!**

**Tempo total: ~30 minutos** ⏱️

🚂 Railway está pronto para escalar com você! 🚀
