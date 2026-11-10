# ✅ Deploy Render - Checklist Interativo

Use este checklist para garantir que tudo está pronto!

---

## 📋 FASE 1: Preparação Local (15 min)

### Verificar Código
```bash
# Está em um repositório Git?
git status
# Esperado: "On branch main"
```
- [ ] Código está em Git (GitHub/GitLab/Bitbucket)
- [ ] Branch principal é `main` (não `master`)

### Verificar package.json
```bash
# Tem o campo "type": "commonjs"?
grep "type" package.json
# Tem script "start"?
grep "start" package.json
```
- [ ] `package.json` tem `"type": "commonjs"`
- [ ] `package.json` tem script `"start": "node dashboard.js"`
- [ ] `package.json` tem dependências instaladas (`npm install` rodou OK)

### Executar Script de Ajuste
```bash
node adjust-for-render.js
```

**Esperado:**
```
✅ castle_bypass.js - Ajustado
✅ dashboard.js - Ajustado (ou já estava)
✨ Pronto! Arquivos ajustados para Render.
```

- [ ] Script rodou sem erros
- [ ] Castle_bypass.js foi ajustado
- [ ] Dashboard.js tem health check

### Verificar Arquivos Criados
```bash
ls -la Dockerfile render.yaml .dockerignore .env.example
```

- [ ] `Dockerfile` existe
- [ ] `render.yaml` existe
- [ ] `.dockerignore` existe
- [ ] `.env.example` existe

---

## 📝 FASE 2: Commit e Push (5 min)

### Verificar Mudanças
```bash
git status
```

Deve mostrar:
```
Dockerfile
render.yaml
.dockerignore
.env.example
adjust-for-render.js
dashboard.js (MODIFIED)
```

- [ ] Todos os arquivos aparecem em `git status`
- [ ] Nenhum arquivo sensível (`.env`, senhas) no commit

### Fazer Commit
```bash
git add .
git commit -m "chore: prepare for Render deployment

- Add Dockerfile with Alpine Linux
- Add render.yaml for Render deployment
- Add health check endpoint
- Adjust Chrome path for Linux"
git log --oneline -1
```

- [ ] Commit foi criado com mensagem descritiva
- [ ] `git log` mostra seu commit

### Fazer Push
```bash
git push origin main
```

**Esperado:**
```
Enumerating objects: ...
Writing objects: ...
remote: Create a pull request for 'main' by visiting:
```

- [ ] Push foi bem-sucedido
- [ ] GitHub/GitLab mostra seus commits

---

## 🎯 FASE 3: Configurar no Render (10 min)

### Criar Conta Render
```
https://dashboard.render.com
```

- [ ] Conta Render criada
- [ ] Email verificado
- [ ] Dashboard acessível

### Conectar Repositório
```
Dashboard → Account Settings → Connected Services → GitHub
```

- [ ] GitHub conectado ao Render
- [ ] Permissão concedida
- [ ] Repositório aparece na lista

### Criar Web Service
```
Dashboard → New + → Web Service
```

Preencher:
| Campo | Valor |
|-------|-------|
| Name | `lovable-dashboard` |
| Repository | seu repositório |
| Branch | `main` |
| Environment | `Docker` |
| Region | `Oregon` |
| Plan | `Starter` ou `Standard` |

- [ ] Nome preenchido: `lovable-dashboard`
- [ ] Repositório correto selecionado
- [ ] Branch é `main`
- [ ] Environment é `Docker`
- [ ] Region é `Oregon` (mais barato)
- [ ] Plano selecionado (Starter = $7/mês)

---

## 🔐 FASE 4: Variáveis de Ambiente (10 min)

### Encontrar Valores
Abra seus arquivos locais e pegue:

```bash
# CASTLE_PK
grep -r "CASTLE_PK\|pk_" . --include="*.js" | head -1

# FIREBASE_API_KEY
grep -r "FIREBASE_API_KEY\|AIzaSy" . --include="*.js" | head -1

# PROXY_URL
grep -r "PROXY_URL\|proxy-seller" . --include="*.js" | head -1

# GMAIL
grep -r "GMAIL_USER\|@gmail" config.json
```

### Adicionar no Render
Clicar **Environment** e adicionar:

```
CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw
PROXY_URL=http://user:pass@proxy.com:10000
VPN_ROTATE=1
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_app
LOG_LEVEL=info
```

- [ ] CASTLE_PK adicionado
- [ ] FIREBASE_API_KEY adicionado
- [ ] PROXY_URL adicionado (testar: `curl -x URL`)
- [ ] VPN_ROTATE = 1
- [ ] GMAIL_USER adicionado
- [ ] GMAIL_APP_PASSWORD adicionado
- [ ] LOG_LEVEL = info
- [ ] Todos marcados como "Secret" (não aparecem em logs)

### Testar Proxy (Opcional mas Recomendado)
```bash
# No seu PC local:
curl -x http://user:pass@proxy.com:10000 https://api.lovable.dev

# Esperado: Resposta 200 ou 404 (não erro de proxy)
```

- [ ] Proxy URL testado e funciona
- [ ] Proxy responde sem autenticação errada

---

## 🚀 FASE 5: Deploy (2 min)

### Iniciar Deploy
```
Render Dashboard → "Create Web Service"
```

**Procure:**
```
Building... → Build successful → Deploying → Live
```

- [ ] Build iniciou
- [ ] Build passou sem erros
- [ ] Deploy iniciou
- [ ] Serviço está "Live" (verde)

### Verificar URL
```
https://lovable-dashboard.onrender.com
```

Deve mostrar dashboard ou erro (mas site respondendo).

- [ ] URL gerada: `https://lovable-dashboard.onrender.com`
- [ ] URL acessível (abrir no navegador)
- [ ] Não dá erro de conexão

### Verificar Logs
```
Dashboard → lovable-dashboard → Logs
```

Procure por:
```
Server running on port 3700
Application started
```

NÃO deve ter:
```
Error
Failed
Cannot find module
ENOENT
```

- [ ] Logs visíveis
- [ ] Logs mostram "port 3700" ou similar
- [ ] Nenhum erro aparente nos logs

---

## 🧪 FASE 6: Testes (5 min)

### Teste 1: Health Check
```bash
curl https://lovable-dashboard.onrender.com/health

# Esperado:
# {"status":"ok","uptime":123.456,"timestamp":"2024-..."}
```

- [ ] `/health` retorna 200
- [ ] Resposta tem `"status":"ok"`

### Teste 2: Dashboard
```
Abrir: https://lovable-dashboard.onrender.com
```

Deve mostrar:
- Título "Lovable Fabricador"
- Botões (Start/Stop)
- Stats (Total, Success, Errors)

- [ ] Dashboard carrega
- [ ] Elementos visíveis
- [ ] Sem erro JavaScript (F12 → Console)

### Teste 3: Stats API
```bash
curl https://lovable-dashboard.onrender.com/api/stats

# Esperado:
# {"total":0,"success":0,"errors":0,"running":false,...}
```

- [ ] `/api/stats` retorna JSON
- [ ] Dados estão lá

### Teste 4: WebSocket (Opcional)
Se quiser testar WebSocket (mais avançado):
```bash
# Usar wscat ou similar para testar
# Render Logs deve mostrar: "WebSocket connected"
```

- [ ] [ ] WebSocket conecta (se teste rodou)

---

## 🎉 FASE 7: Pós-Deploy (Manutenção)

### Monitoramento
```
Dashboard → lovable-dashboard → Metrics
```

Verificar a cada dia:
- [ ] CPU < 50%
- [ ] RAM < 300MB (se Starter)
- [ ] Nenhuma reinicialização inesperada

### Logs
```
Dashboard → Logs
```

Verificar em:
- [ ] Nenhum erro de Chrome
- [ ] Nenhum erro de rede
- [ ] Nenhum erro de Proxy

### Auto-Deploy
Configurar:
- [ ] Sempre que fazer `git push`, Render faz deploy automático
- [ ] Sem downtime (blue-green deployment)

### Backup de Credenciais
⚠️ **IMPORTANTE:**
```bash
# Guardar em local seguro:
- CASTLE_PK
- FIREBASE_API_KEY  
- PROXY_URL
- GMAIL_APP_PASSWORD
```

- [ ] Credenciais salvas em local seguro (ex: 1Password)
- [ ] Senhas NÃO em Git
- [ ] `.env` adicionado ao `.gitignore`

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Se Build Falhar
```
1. Dashboard → Logs
2. Procure por "Error"
3. Google a mensagem de erro
```

**Erros comuns:**
- `Cannot find module` → Falta `npm install`
- `Chrome not found` → Dockerfile ok, mas check permissions
- `Port 3700 already in use` → Usar PORT env var

### Se App Offline
```
1. Check `/health` endpoint
2. Ver Restart Count (Dashboard)
3. Se restarting muito, memória insuficiente → Upgradear
```

### Se Proxy Não Funciona
```
1. Testar proxy local: curl -x URL
2. Verificar PROXY_URL em Render (sem typo)
3. Testar em castle_bypass.js se usa PROXY_URL
```

---

## 📞 Suporte

| Problema | Onde Procurar |
|----------|---------------|
| Build falhou | `Dashboard → Logs` |
| App offline | `Dashboard → Logs` + `Dashboard → Metrics` |
| Chrome erro | `Dashboard → Logs` |
| Proxy erro | Testar URL local + `Dashboard → Logs` |
| Memória | `Dashboard → Metrics` → Upgradear plano |
| WebSocket | Browser Console (F12) |
| Geral | `GUIA_DEPLOY_RENDER.md` → Troubleshooting |

---

## ✅ CHECKLIST FINAL

- [ ] FASE 1: Preparação Local ✓
- [ ] FASE 2: Commit e Push ✓
- [ ] FASE 3: Configuração Render ✓
- [ ] FASE 4: Variáveis de Ambiente ✓
- [ ] FASE 5: Deploy ✓
- [ ] FASE 6: Testes ✓
- [ ] FASE 7: Pós-Deploy ✓

---

## 🎯 Próximos Passos

### Hoje
- [x] Deploy funcionando
- [ ] Testar com dados reais

### Semana que vem
- [ ] Monitorar logs
- [ ] Otimizar performance
- [ ] Configurar alertas Slack

### Mês que vem
- [ ] Considerar upgradear plano
- [ ] Adicionar banco de dados (se precisar)
- [ ] Configurar domínio customizado

---

**🎉 Parabéns! Seu app está no ar no Render!**

Dúvidas? Leia `DEPLOY_RENDER_QUICK_START.md` ou `GUIA_DEPLOY_RENDER.md`

---

_Checklist version 1.0 — Última atualização: Nov 2024_
