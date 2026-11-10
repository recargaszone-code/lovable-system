# 🚀 Guia Completo: Deploy no Render

## 1. PRÉ-REQUISITOS

- [x] Conta GitHub, GitLab ou Bitbucket com seu código
- [x] Conta no [Render.com](https://render.com)
- [x] Código Node.js com `package.json`

---

## 2. PREPARAR CÓDIGO PARA RENDER

### 2.1 Criar `Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    wqy-zenhei \
    font-noto-emoji

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar código
COPY . .

# Expor porta
EXPOSE 3700

# Variável de ambiente para Chrome
ENV CHROME_PATH=/usr/bin/chromium-browser

# Iniciar aplicação
CMD ["npm", "start"]
```

### 2.2 Ajustar `package.json` com script de start
```json
{
  "name": "lovable-assist",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node dashboard.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "type": "commonjs",
  "dependencies": {
    "@castleio/castle-js": "^2.8.5",
    "express": "^5.3.0",
    "imapflow": "^2.0.2",
    "mailparser": "^3.9.26",
    "puppeteer-core": "^25.16.0",
    "ws": "^8.14.0"
  }
}
```

### 2.3 Criar `render.yaml` (opcional, recomendado)
```yaml
services:
  - type: web
    name: lovable-dashboard
    env: docker
    dockerfilePath: ./Dockerfile
    dockerContext: ./
    plan: starter
    region: oregon
    envVars:
      - key: PORT
        value: 3700
      - key: NODE_ENV
        value: production
      - key: CHROME_PATH
        value: /usr/bin/chromium-browser
      - key: CASTLE_PK
        sync: false
```

### 2.4 Atualizar `castle_bypass.js` para Render
```javascript
// Mudar linha 42:
const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/chromium-browser';

// Adicionar opções de browser:
const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--window-size=1920,1080',
    '--disable-web-resources',
  ]
});
```

### 2.5 Atualizar `dashboard.js` para ler da porta de ambiente
```javascript
// Mudar linha 7:
const PORT = process.env.PORT || 3700;
```

---

## 3. FAZER COMMIT E PUSH

```bash
git add Dockerfile render.yaml package.json castle_bypass.js dashboard.js
git commit -m "chore: prepare for Render deployment"
git push origin main
```

---

## 4. CRIAR SERVIÇO NO RENDER

### Passo 4.1: Acessar Dashboard
1. Ir para [dashboard.render.com](https://dashboard.render.com)
2. Clicar em **"New +"** → **"Web Service"**

### Passo 4.2: Conectar Repositório
- Conectar GitHub/GitLab
- Selecionar repositório `lovable-assist`
- Autorizar acesso

### Passo 4.3: Configurar Serviço
| Campo | Valor |
|-------|-------|
| **Name** | `lovable-dashboard` |
| **Environment** | `Docker` |
| **Region** | `Oregon` (mais barato) |
| **Branch** | `main` |
| **Dockerfile Path** | `./Dockerfile` |

### Passo 4.4: Selecionar Plano
- **Starter** ($7/mês): Para testes
- **Standard** ($12/mês): Recomendado
- **Pro** ($19+/mês): Alta carga

### Passo 4.5: Variáveis de Ambiente

Clicar em **"Environment"** e adicionar:

```
PORT=3700
NODE_ENV=production
CHROME_PATH=/usr/bin/chromium-browser
CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw
PROXY_URL=http://user:pass@proxy.com:10000
VPN_ROTATE=1
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_app
LOG_LEVEL=info
```

**⚠️ SEGURANÇA**: Render criptografa essas variáveis!

---

## 5. DEPLOY

### Opção A: Deploy Automático (Recomendado)
1. Render detecta automaticamente mudanças no GitHub
2. A cada `git push`, faz deploy automático
3. Sem downtime com blue-green deployment

### Opção B: Deploy Manual
1. No dashboard Render, clicar **"Deploy latest"**
2. Ou esperar trigger automático

### Visualizar Deploy
```
Dashboard → lovable-dashboard → Logs
```

---

## 6. ACESSAR APLICAÇÃO

Após deploy bem-sucedido, Render gera URL automaticamente:

```
https://lovable-dashboard.onrender.com
```

Ou seu domínio customizado (vê seção 8).

---

## 7. TIPOS DE SERVIÇOS NO RENDER

### 7.1 Web Service (Dashboard)
```yaml
type: web
cmd: npm start
plan: starter
```

### 7.2 Background Worker (Criar contas)
Se quiser processos separados:
```yaml
type: background_worker
cmd: node castle_bypass.js
plan: starter
```

### 7.3 Cron Job (Executar tarefa periódica)
```yaml
type: cron_job
schedule: "0 3 * * *"  # 3AM diariamente
cmd: node backup.js
```

---

## 8. DOMÍNIO CUSTOMIZADO

### 8.1 Via Render
1. Dashboard → lovable-dashboard → Settings
2. Clicar **"Custom Domain"**
3. Adicionar `lovable.seu_dominio.com` ou `app.seu_dominio.com`

### 8.2 Configurar DNS (CloudFlare)
Se seu domínio está na CloudFlare:

1. CloudFlare → DNS
2. Adicionar registro CNAME:
   - **Name**: `lovable` (ou `app`)
   - **Content**: `lovable-dashboard.onrender.com`
   - **Proxy Status**: DNS only (não proxiar Render)

3. Aguardar propagação (até 24h)

---

## 9. MONITORAMENTO E LOGS

### 9.1 Ver Logs em Tempo Real
```
Dashboard → lovable-dashboard → Logs
```

### 9.2 Configurar Alertas
```
Dashboard → lovable-dashboard → Alerts
```

Adicionar alertas para:
- Service Down
- Build Failed
- High Memory Usage
- High CPU Usage

### 9.3 Conectar Slack (Opcional)
1. Render → Account Settings → Notifications
2. Conectar Slack workspace
3. Receber notificações de deploy

---

## 10. AUMENTAR RECURSOS

Se precisar mais RAM/CPU:

1. Dashboard → lovable-dashboard → Plan
2. Upgradear plano:
   - Starter: 512MB RAM, shared CPU ($7)
   - Standard: 2GB RAM, 1 vCPU ($12)
   - Pro: 8GB RAM, 2 vCPU ($19)

---

## 11. CONFIGURAR PROXY NA VPS DO RENDER

### 11.1 Atualizar arquivo de proxy
```javascript
// dashboard.js ou castle_bypass.js
const PROXY_URL = process.env.PROXY_URL || 'http://user:pass@proxy.com:10000';
```

### 11.2 Pool de Proxies
Criar `proxies.json`:
```json
{
  "proxies": [
    "http://user1:pass1@proxy1.com:10000",
    "http://user2:pass2@proxy2.com:10000",
    "http://user3:pass3@proxy3.com:10000"
  ]
}
```

Usar no código:
```javascript
const proxiesConfig = require('./proxies.json');
const currentProxy = proxiesConfig.proxies[Math.floor(Math.random() * proxiesConfig.proxies.length)];
```

---

## 12. PERSISTÊNCIA DE DADOS (Opcional)

Render não oferece armazenamento persistente direto. Opções:

### 12.1 PostgreSQL Gerenciado
```yaml
databases:
  - name: lovable_db
    databaseName: lovable_db
    user: lovable_user
    plan: starter
```

### 12.2 Backup para S3/GCS
```javascript
// backup.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

async function backupToS3() {
  const data = fs.readFileSync('data.json');
  await s3.putObject({
    Bucket: 'meu-bucket',
    Key: `backup-${Date.now()}.json`,
    Body: data
  }).promise();
}
```

---

## 13. TROUBLESHOOTING

### Problema: Build falha
**Solução:**
```bash
# Verificar logs
Dashboard → lovable-dashboard → Logs

# Problemas comuns:
# 1. Chrome não instala: Aumentar timeout no Dockerfile
# 2. npm install falha: Limpar cache
```

### Problema: Aplicação fica lenta após 15 min
**Solução:**
```javascript
// Adicionar health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
```

Render mata processos inativos. Health check mantém ativo.

### Problema: Memória insuficiente
**Solução:**
1. Upgradear plano
2. Ou otimizar código (limpar cache, fechar conexões)

### Problema: Proxy não funciona
**Solução:**
```bash
# Testar proxy manualmente:
curl -x http://user:pass@proxy:10000 https://api.lovable.dev
```

---

## 14. COST ESTIMADO

| Recurso | Custo | Notas |
|---------|-------|-------|
| Web Service (Standard) | $12/mês | 2GB RAM, 1 vCPU |
| PostgreSQL (Starter) | $7/mês | Opcional |
| Domain customizado | Grátis | Seu próprio domínio |
| **Total** | **$12/mês** | Muito barato! |

---

## 15. CHECKLIST FINAL

- [ ] Código em GitHub/GitLab/Bitbucket
- [ ] `Dockerfile` criado e testado localmente
- [ ] `package.json` com script `start`
- [ ] `CHROME_PATH` ajustado para `/usr/bin/chromium-browser`
- [ ] Variáveis de ambiente configuradas no Render
- [ ] Primeiro deploy realizado
- [ ] URL gerada e acessível
- [ ] Logs visíveis no dashboard
- [ ] Proxy testado e funcionando
- [ ] Domínio customizado (opcional)
- [ ] Alertas configurados
- [ ] Backup automático (opcional)

---

## 16. PRÓXIMOS PASSOS

1. **Testar deploy**: Acessar `https://lovable-dashboard.onrender.com`
2. **Monitorar logs**: `Dashboard → Logs`
3. **Configurar domínio**: Adicionar CNAME no DNS
4. **Adicionar mais workers**: Se precisar paralelizar tarefas
5. **Conectar banco de dados**: Se precisar persistência

---

## Links Úteis

- 📚 [Docs Render](https://render.com/docs)
- 🐳 [Docker Hub - Node](https://hub.docker.com/_/node)
- 🤖 [Puppeteer Alpine Docker](https://github.com/browserless/chrome)
- 🔐 [Environment Variables Security](https://render.com/docs/environment-variables)
