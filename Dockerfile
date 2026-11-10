FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema (Chrome + fontes)
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    wqy-zenhei \
    font-noto-emoji \
    ca-certificates

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências Node
RUN npm install --omit=dev

# Copiar código inteiro
COPY . .

# Expor porta
EXPOSE 3700

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV CHROME_PATH=/usr/bin/chromium-browser
ENV PORT=3700

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3700/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Criar 5 contas com proxies rotacionados
CMD ["node", "fabricador_api.js", "5"]
