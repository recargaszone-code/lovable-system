# 📋 Guia Completo: Migração para VPS

## 1. PREPARAÇÃO DA VPS

### Passo 1.1: Escolher e Configurar VPS
Recomendações:
- **Providers**: Contabo, Linode, DigitalOcean, Vultr, AWS EC2
- **Specs mínimas**: 
  - 4GB RAM (8GB recomendado)
  - 2+ vCPU
  - 50GB SSD
  - Ubuntu 22.04 LTS ou 24.04 LTS

### Passo 1.2: Conectar à VPS via SSH
```bash
ssh root@SEU_IP_VPS
```

### Passo 1.3: Atualizar Sistema
```bash
apt update && apt upgrade -y
apt install -y curl wget git build-essential
```

---

## 2. INSTALAR DEPENDÊNCIAS

### 2.1 Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm
node -v && npm -v
```

### 2.2 Google Chrome (para Puppeteer)
```bash
apt install -y wget
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb
apt install -y -f
google-chrome --version
```

**Dependências de runtime do Chrome:**
```bash
apt install -y libxss1 libappindicator1 libindicator7 fonts-liberation xdg-utils
```

### 2.3 PM2 (Gerenciador de Processos)
```bash
npm install -g pm2
pm2 startup
pm2 save
```

### 2.4 Firewall
```bash
ufw allow 22/tcp    # SSH
ufw allow 3700/tcp  # Dashboard (ou sua porta)
ufw enable
```

---

## 3. TRANSFERIR CÓDIGO PARA VPS

### Opção A: Via Git (Recomendado)
```bash
cd /opt
git clone SEU_REPO_URL lovable-assist
cd lovable-assist
npm install
```

### Opção B: Via SCP (Se não tiver Git)
```bash
# Do seu PC local:
scp -r "B:\Lovable - Copy\*" root@SEU_IP_VPS:/opt/lovable-assist/
```

### Opção C: Via rsync (Mais rápido para arquivos grandes)
```bash
# Do seu PC local:
rsync -avz -e ssh "B:\Lovable - Copy\" root@SEU_IP_VPS:/opt/lovable-assist/
```

---

## 4. CONFIGURAR VARIÁVEIS DE AMBIENTE

Na VPS, criar arquivo de configuração:

```bash
cd /opt/lovable-assist
cat > .env << 'EOF'
PORT=3700
NODE_ENV=production
CHROME_PATH=/usr/bin/google-chrome
CASTLE_PK=pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M
FIREBASE_API_KEY=AIzaSyBQNjlw9Vp4tP4VVeANzyPJnqbG2wLbYPw
PROXY_URL=http://user:pass@proxy:port
VPN_ROTATE=1
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_app
LOG_LEVEL=info
EOF
```

---

## 5. AJUSTES PARA PUPPETEER NO SERVIDOR

### 5.1 Modificar castle_bypass.js
Mudar linha 42:
```javascript
// Antes (Windows):
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Depois (Linux):
const CHROME_PATH = '/usr/bin/google-chrome';
```

### 5.2 Ajustar opções do Puppeteer
Garantir que o código use `--no-sandbox` em Linux:

```javascript
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: false, // Manter false para capturar CAPTCHA
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage', // Importante em VPS com pouca RAM
    '--window-size=1920,1080',
  ]
});
```

### 5.3 Configurar Display para Headless (Xvfb)
Se quiser rodar em background sem X11:
```bash
apt install -y xvfb x11-utils
# Depois rodar com:
xvfb-run -a --server-args='-screen 0 1920x1080x24' node seu_arquivo.js
```

Ou usar no PM2:
```bash
pm2 start ecosystem.config.js
```

---

## 6. CONFIGURAR PROXY

### 6.1 Atualizar URL de Proxy no Código
No `dashboard.js` e `castle_bypass.js`:

```javascript
const PROXY_URL = process.env.PROXY_URL || 'http://user:pass@proxy.com:10000';
```

### 6.2 Testar Conexão com Proxy
```bash
curl -x http://user:pass@proxy:10000 https://api.lovable.dev
```

### 6.3 Configurar Pool de Proxies (Opcional)
Se tiver múltiplos proxies, criar arquivo `proxies.json`:
```json
{
  "proxies": [
    "http://user1:pass1@proxy1:10000",
    "http://user2:pass2@proxy2:10000",
    "http://user3:pass3@proxy3:10000"
  ]
}
```

Depois ler em seu código:
```javascript
const proxiesConfig = require('./proxies.json');
const rotateProxy = () => {
  return proxiesConfig.proxies[Math.floor(Math.random() * proxiesConfig.proxies.length)];
};
```

---

## 7. INICIAR APLICAÇÃO COM PM2

### 7.1 Criar arquivo `ecosystem.config.js`
```javascript
module.exports = {
  apps: [
    {
      name: 'lovable-dashboard',
      script: 'dashboard.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3700,
        CHROME_PATH: '/usr/bin/google-chrome'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'lovable-worker',
      script: 'castle_bypass.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        CHROME_PATH: '/usr/bin/google-chrome',
        VPN_ROTATE: '1'
      },
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log'
    }
  ]
};
```

### 7.2 Iniciar com PM2
```bash
mkdir -p /opt/lovable-assist/logs
cd /opt/lovable-assist
pm2 start ecosystem.config.js
pm2 logs  # Ver logs em tempo real
pm2 monit # Monitorar uso de CPU/RAM
```

---

## 8. REVERSE PROXY COM NGINX

### 8.1 Instalar Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 8.2 Configurar Nginx
```bash
cat > /etc/nginx/sites-available/lovable << 'EOF'
upstream lovable_backend {
    server 127.0.0.1:3700;
}

server {
    listen 80;
    server_name seu_dominio.com www.seu_dominio.com;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu_dominio.com www.seu_dominio.com;

    # Certificado SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu_dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu_dominio.com/privkey.pem;

    # Segurança SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://lovable_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    location /ws {
        proxy_pass http://lovable_backend/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
EOF

# Ativar configuração
ln -s /etc/nginx/sites-available/lovable /etc/nginx/sites-enabled/
nginx -t  # Testar configuração
systemctl restart nginx
```

### 8.3 Certificado SSL (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot certonly --nginx -d seu_dominio.com -d www.seu_dominio.com
# Renovação automática:
certbot renew --dry-run
```

---

## 9. MONITORAMENTO E LOGS

### 9.1 Ver Logs com PM2
```bash
pm2 logs lovable-dashboard  # Dashboard logs
pm2 logs lovable-worker     # Worker logs
pm2 logs --err              # Apenas erros
```

### 9.2 Monitorar Sistema
```bash
# CPU/RAM em tempo real
pm2 monit

# Ou usar htop
apt install -y htop
htop
```

### 9.3 Configurar Rotação de Logs
```bash
apt install -y logrotate

cat > /etc/logrotate.d/lovable << 'EOF'
/opt/lovable-assist/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
EOF
```

---

## 10. BACKUP E RECUPERAÇÃO

### 10.1 Backup Automático
```bash
cat > /usr/local/bin/backup-lovable.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/lovable-assist"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/lovable-$(date +%Y%m%d_%H%M%S).tar.gz /opt/lovable-assist
# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-lovable.sh

# Agendar com cron (diariamente às 3AM)
crontab -e
# Adicionar:
# 0 3 * * * /usr/local/bin/backup-lovable.sh
```

---

## 11. TROUBLESHOOTING

### Problema: Chrome não inicia
```bash
# Verificar se Chrome está instalado:
google-chrome --version

# Testar Chrome:
google-chrome --headless --dump-dom https://google.com

# Se falta libXss1:
apt install -y libxss1
```

### Problema: Porta 3700 já está em uso
```bash
# Encontrar processo usando a porta:
lsof -i :3700

# Matar processo:
kill -9 <PID>

# Ou mudar porta no .env e ecosystem.config.js
```

### Problema: WebSocket não conecta
Garantir que Nginx está com configuração correta para upgrade:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
```

### Problema: Memória insuficiente
```bash
# Aumentar tamanho do swap:
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Persistir (adicionar ao /etc/fstab):
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 12. CHECKLIST FINAL

- [ ] VPS criada e SSH funcionando
- [ ] Node.js v18+ instalado
- [ ] Google Chrome instalado
- [ ] PM2 instalado globalmente
- [ ] Código transferido e npm install rodado
- [ ] .env configurado com credenciais
- [ ] CHROME_PATH ajustado para `/usr/bin/google-chrome`
- [ ] Proxy URL configurado em .env
- [ ] Firewall aberto para portas necessárias
- [ ] PM2 ecosystem.config.js criado
- [ ] Aplicação inicia com `pm2 start ecosystem.config.js`
- [ ] Nginx configurado (opcional, mas recomendado)
- [ ] SSL/TLS ativo (Let's Encrypt)
- [ ] Logs e monitoramento configurados
- [ ] Backup automático ativo

---

## 13. ACESSAR DASHBOARD REMOTO

Após configurar Nginx:
```
https://seu_dominio.com
```

Se sem domínio, acessar direto:
```
http://SEU_IP_VPS:3700
```

**Importante**: Proteger com autenticação básica (opcional):
```nginx
auth_basic "Lovable Admin";
auth_basic_user_file /etc/nginx/.htpasswd;
```

Gerar arquivo de senha:
```bash
apt install -y apache2-utils
htpasswd -c /etc/nginx/.htpasswd admin
```

---

## Próximos Passos

1. **Testar conta factory**: `pm2 start castle_bypass.js --name test`
2. **Monitorar recursos**: `pm2 monit`
3. **Verificar erros**: `pm2 logs --err`
4. **Configurar alertas**: Integrar com Slack/Email
