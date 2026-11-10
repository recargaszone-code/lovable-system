# 🚂 Guia Completo: Deploy no Railway

Railway é uma plataforma de deploy moderna, simples e extremamente barata!

---

## 1. COMPARAÇÃO: Railway vs Render vs VPS

| Aspecto | Railway | Render | VPS |
|---------|---------|--------|-----|
| Setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Custo | **$5/mês FREE** | $7/mês | $5-10/mês |
| Automação | ✅ Total | ✅ Total | ❌ Manual |
| Logs | ✅ Excelentes | ✅ Bons | ⚠️ Precisa setup |
| Uptime | 99% | 99% | 99.9% |
| Complexidade | Muito Fácil | Fácil | Média |
| Suporte | ✅ Comunidade | ✅ Comunidade | ❌ Self-service |

**Recomendação:** Railway para começar, depois migrar se necessário.

---

## 2. SETUP INICIAL (5 min)

### 2.1 Criar Conta
```
https://railway.app
```

Opções de login:
- GitHub
- GitLab
- Google

**Recomendação:** Use GitHub para deploy automático!

### 2.2 Verificar Email
Railway envia confirmação. Clique no link.

---

## 3. PREPARAR CÓDIGO

### 3.1 Rodar Script de Ajuste
```bash
cd "B:\Lovable - Copy"
node adjust-for-render.js
```

Isso ajusta:
- CHROME_PATH: Windows → Linux
- PORT: Variável de ambiente
- Outros detalhes

### 3.2 Fazer Commit
```bash
git add .
git commit -m "chore: prepare for Railway deployment"
git push origin main
```

---

## 4. CONECTAR GITHUB (AUTOMÁTICO)

### 4.1 Ir ao Dashboard
```
https://railway.app/dashboard
```

### 4.2 Novo Projeto
Clicar: **"New Project"**

Escolher: **"Deploy from GitHub"**

### 4.3 Autorizar
Railway pede acesso ao GitHub:
- ✅ Autorizar
- Railway consegue ler seu repo

### 4.4 Selecionar Repositório
Escolher seu repositório `lovable-assist`

Railway detecta automaticamente:
- ✅ Dockerfile presente
- ✅ package.json presente
- ✅ railway.json presente

### 4.5 Preencher Variáveis (Importante!)

No formulário de variáveis, adicionar:

```
CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw
PROXY_URL=http://user:pass@proxy.com:10000
VPN_ROTATE=1
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_app
LOG_LEVEL=info
NODE_ENV=production
```

**⚠️ SEGURANÇA:** Railway criptografa todas as variáveis!

### 4.6 Deploy
Clicar: **"Deploy"**

Railway automaticamente:
1. Clona seu repo
2. Detecta Dockerfile
3. Faz build
4. Inicia container
5. Valida health check
6. Vai LIVE

**Tempo:** ~2-3 minutos

---

## 5. MONITORAR DEPLOY

### 5.1 Ver Logs
```
Dashboard → seu projeto → "Logs"
```

Procure por:
```
✓ Build successful
✓ Deploying...
✓ Server running on port 3700
```

### 5.2 Ver Métrica de Saúde
```
Dashboard → seu projeto → "Deployments"
```

Status deve ser: **Running** (verde)

### 5.3 Acessar App
Railway gera URL automaticamente:
```
https://lovable-assist-production.up.railway.app
(ou similar)
```

---

## 6. CONECTAR DOMÍNIO CUSTOMIZADO (Opcional)

### 6.1 No Railway
```
Dashboard → seu projeto → Settings → Domain
```

Clicar: **"Add Domain"**

Opções:
- Railway domain (grátis): `meu-app.railway.app`
- Seu domínio: `app.seu_dominio.com`

### 6.2 Se Usar Seu Domínio
Configurar DNS no seu provider (CloudFlare, etc):

**CloudFlare:**
```
Type: CNAME
Name: app (ou seu_subdominio)
Content: seu-app.railway.app
Proxy: DNS only
```

Aguardar propagação (até 24h).

---

## 7. ENVIROMENT VARIABLES AVANÇADO

### 7.1 Adicionar Secrets
Railway tem suporte para secrets (mais seguro):

```
Dashboard → seu projeto → Variables
```

Para cada variável sensível:
- Clicar: "New Variable"
- Marcar: "Secret" (encriptado)
- Valores: CASTLE_PK, PROXY_URL, etc

### 7.2 Reference Variables
Se precisar usar uma variável em outra:

```
FULL_URL=${{ Railway.public_domain }}
```

---

## 8. CONFIGURAÇÕES AVANÇADAS

### 8.1 Auto-Deploy
Railroad automaticamente faz deploy a cada `git push`.

Se quiser desabilitar:
```
Dashboard → seu projeto → Settings → 
Disable Auto Deploy
```

### 8.2 Deploy Preview
Para branches (pull requests):

```
Settings → "Deploy on PR"
```

Cada PR gera preview URL!

### 8.3 Custom Healthcheck
Railway já detecta `/health` endpoint.

Se quiser customizar:
```
Settings → Healthcheck Path
```

### 8.4 Persistent Storage (Opcional)
Se precisar guardar arquivos entre deploys:

```
Dashboard → Storage → "Add Storage"
Mount Path: /data
Capacity: 1GB
```

Depois no código:
```javascript
const dataDir = '/data'; // Persiste entre deploys
```

---

## 9. AUMENTAR RECURSOS

Se app ficar lento ou com memória insuficiente:

### 9.1 Opções de Plano
```
Dashboard → seu projeto → Settings → Plan
```

**FREE Tier:**
- $5/mês crédito (1 pequeno serviço)
- OK pra testes

**Pay-as-you-go:**
- CPU: $0.00013/hora
- RAM: $0.00036/hora
- Storage: $0.10/GB/mês

**Exemplo:**
- 2GB RAM, 0.5 CPU, 10GB storage = ~$20/mês

---

## 10. MONITORAMENTO CONTÍNUO

### 10.1 Logs
```
Dashboard → seu projeto → Logs
```

Filtrar por:
- Level: error, warn, info
- Service: seu projeto
- Time range

### 10.2 Métricas
```
Dashboard → seu projeto → Metrics
```

Ver:
- CPU usage
- Memory usage
- Network I/O
- Request count

### 10.3 Alertas (Pago)
Com plano Pro:
```
Settings → Alerts
```

Configurar notificações:
- Email
- Webhook
- Discord (via webhook)

---

## 11. ATUALIZAR APP

### 11.1 Fazer Mudanças Locais
```bash
# Editar código
code dashboard.js

# Testar
npm start

# Commit
git add .
git commit -m "fix: seu bug"
git push origin main
```

### 11.2 Railway Faz Deploy Automaticamente!
- Detecta push
- Faz build
- Deploy automático
- Sem downtime

**Tempo:** ~2 minutos

### 11.3 Ver Deploy no Dashboard
```
Dashboard → seu projeto → Deployments
```

Mostra histórico de todos os deploys com timestamps.

---

## 12. ROLLBACK (Voltar Versão Anterior)

Se quebrar algo:

```
Dashboard → seu projeto → Deployments
```

1. Achar deployment anterior que funcionava
2. Clicar em "Redeploy"
3. Pronto! Voltou!

---

## 13. BACKUP & DADOS

### 13.1 Sem Banco de Dados
Se só tem logs/cache em memória:

Não precisa fazer nada (tudo volta com deploy).

### 13.2 Com PostgreSQL/MySQL
Railway oferece databases gerenciados!

```
Dashboard → "Add Database" → PostgreSQL/MySQL
```

Depois no código:
```javascript
const db = new Database(process.env.DATABASE_URL);
```

---

## 14. TROUBLESHOOTING

### Build Falha
```
Dashboard → seu projeto → Logs

Procure por: ERROR ou FAILED
Google a mensagem
```

**Comum:**
- `npm install error` → Check package.json
- `Chrome not found` → Dockerfile OK, Railtway resolve
- `Cannot find module` → Falta dependência

### App Não Sobe
```
Dashboard → Logs
Procure por: Application started ou Server running

Se não ver:
1. Check /health endpoint
2. Checar NODE_ENV=production
3. Checar PORT (deve ser 3700)
```

### Memória Insuficiente
```
Dashboard → Metrics
Se Memory ~100%:

1. Aumentar plano
2. Ou otimizar código (fechar conexões, limpar cache)
```

### Proxy Não Funciona
```bash
# Testar local:
curl -x http://user:pass@proxy:10000 https://api.lovable.dev

# Se OK local mas não em Railway:
1. Check PROXY_URL no Railway
2. Verificar se proxy permite conexões de fora
3. Testar DNS do proxy
```

---

## 15. SEGURANÇA

### 15.1 Secrets Management
✅ Railway criptografa variáveis
✅ Não aparecem em logs
✅ Seguro para produção

### 15.2 Não Faça
❌ Commit .env (usar .env.example)
❌ Colocar secrets em código
❌ Usar secrets em logs

### 15.3 Audit
```
Dashboard → Project Settings → Audit Logs
```

Ver quem fez o quê, quando.

---

## 16. INTEGRAÇÃO COM SLACK (Opcional)

Se quiser notificações de deploy:

### 16.1 Criar Webhook Slack
No Slack workspace:
```
Apps → Incoming Webhooks → Create
Copiar URL
```

### 16.2 No Railway
```
Dashboard → seu projeto → Settings → Webhooks
Adicionar URL do Slack
```

### 16.3 Receber Notificações
A cada deploy:
```
🚀 Deployment successful
App: lovable-dashboard
Time: 2024-11-09 14:30:00
```

---

## 17. PRÓXIMOS PASSOS

### Hoje
- [x] Deploy live em Railway
- [x] URL acessível
- [x] Variáveis configuradas

### Semana que vem
- [ ] Monitorar logs
- [ ] Testar com dados reais
- [ ] Otimizar performance

### Mês que vem
- [ ] Adicionar domínio customizado
- [ ] Configurar alertas Slack
- [ ] Considerar PostgreSQL se precisar dados persistentes

---

## 18. CUSTO ESTIMADO

### Scenario 1: Pequeno (Testes)
- FREE tier Railway: $0
- Total: **$0/mês** (ou $5 crédito)

### Scenario 2: Médio (Produção)
- Pay-as-you-go: ~$15-20/mês
- Com banco dados: +$7-10/mês
- Total: **$20-30/mês**

### Scenario 3: Grande (Alta Carga)
- Múltiplas instâncias: $30-50+/mês
- Database + backup: +$15/mês
- Total: **$50+/mês**

---

## 19. MIGRAR DEPOIS?

Railway → Render:
- ✅ Código já em Docker
- ✅ Mesmas env vars
- ✅ 5 min para migrar

Railway → VPS:
- ✅ Mesma imagem Docker
- ✅ Só mudar host
- ✅ 1h para setup

**Flexibilidade garantida!**

---

## 20. CHECKLIST FINAL

- [ ] Código em GitHub
- [ ] `node adjust-for-render.js` rodou OK
- [ ] Conta Railway criada
- [ ] GitHub conectado
- [ ] Variáveis de ambiente preenchidas
- [ ] Deploy iniciou
- [ ] Build bem-sucedido
- [ ] App Running (verde)
- [ ] URL acessível
- [ ] `/health` retorna 200
- [ ] Logs sem erros

---

## 📞 LINKS ÚTEIS

- Railway: https://railway.app
- Docs: https://docs.railway.app
- Dashboard: https://railway.app/dashboard
- Discord Community: https://discord.gg/railway
- Twitter: @Railway

---

## 💡 DICAS FINAIS

✅ Railway é MUITO mais fácil que VPS
✅ Auto-deploy com git push
✅ Custo super baixo ($5/mês FREE tier)
✅ Escalável se precisar depois
✅ Comunidade ativa e suportiva

**Railway é a melhor escolha pra começar!** 🚂✨

---

**Status: Production Ready ✅**

Deploy seu app agora em: https://railway.app 🚀
