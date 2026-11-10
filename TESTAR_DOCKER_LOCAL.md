# 🐳 Testar Docker Localmente (Opcional)

Se quiser testar a imagem Docker antes de fazer deploy no Render, siga este guia.

## ⚙️ Pré-requisitos

- Docker Desktop instalado: https://www.docker.com/products/docker-desktop
- WSL2 habilitado (Windows)

---

## 1️⃣ Construir Imagem Localmente

```bash
cd "B:\Lovable - Copy"

# Build da imagem
docker build -t lovable-local:latest .

# Esperado:
# Successfully tagged lovable-local:latest
```

**Tempo:** 3-5 minutos na primeira vez

---

## 2️⃣ Testar a Imagem

### Opção A: Sem Variáveis
```bash
docker run -p 3700:3700 lovable-local:latest

# Esperado:
# Server running on port 3700
# Application started
```

Depois acesse: `http://localhost:3700`

### Opção B: Com Variáveis
```bash
docker run -p 3700:3700 \
  -e CASTLE_PK="pk_..." \
  -e FIREBASE_API_KEY="AIzaSy..." \
  -e PROXY_URL="http://user:pass@proxy:10000" \
  lovable-local:latest

# Esperado: Igual ao anterior
```

### Opção C: Com .env
Criar arquivo `.env.local`:
```
CASTLE_PK=pk_...
FIREBASE_API_KEY=AIzaSy...
PROXY_URL=http://user:pass@proxy:10000
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha
```

Depois rodar:
```bash
docker run -p 3700:3700 --env-file .env.local lovable-local:latest
```

---

## 3️⃣ Testar Endpoints

### Health Check
```bash
curl http://localhost:3700/health

# Esperado:
# {"status":"ok","uptime":123.456,"timestamp":"2024-..."}
```

### Dashboard
```bash
# Abrir no navegador:
http://localhost:3700
```

Deve mostrar:
- Título "Lovable Fabricador"
- Botões Start/Stop
- Stats com números

### Stats API
```bash
curl http://localhost:3700/api/stats

# Esperado:
# {"total":0,"success":0,"errors":0,"running":false,...}
```

---

## 4️⃣ Limpar Depois

### Parar o Container
```bash
# Ver containers rodando
docker ps

# Parar
docker stop CONTAINER_ID

# Ou terminar com Ctrl+C no terminal
```

### Remover Imagem (Opcional)
```bash
docker rmi lovable-local:latest
```

---

## 🔧 Troubleshooting

### Erro: Port já em uso
```bash
# Se porta 3700 já tá ocupada:
docker run -p 8080:3700 lovable-local:latest

# Depois acessar: http://localhost:8080
```

### Erro: Chrome não encontrado
```bash
# Se app começar mas Chrome não achar:
# Isso é normal em containers sem display
# Render cuida disso automaticamente
```

### Erro: Cannot find module
```bash
# Se npm não instalou dependências:
docker build --no-cache -t lovable-local:latest .
```

### Ver Logs do Container
```bash
# Em outro terminal enquanto container roda:
docker logs CONTAINER_ID -f

# -f para seguir logs em tempo real
```

---

## 📊 Verificar Tamanho da Imagem

```bash
docker images lovable-local

# Esperado:
# REPOSITORY         TAG      SIZE
# lovable-local      latest   300-400MB
```

Se tamanho > 500MB, o `.dockerignore` não funcionou.

---

## ✅ Checklist Teste Local

- [ ] Docker Desktop instalado e rodando
- [ ] `docker build` passou sem erros
- [ ] Container inicia: `docker run`
- [ ] `/health` retorna 200
- [ ] `/api/stats` retorna JSON
- [ ] Dashboard carrega no navegador
- [ ] Logs visíveis (sem erros de Chrome)
- [ ] Container para com Ctrl+C

---

## 🎯 Depois do Teste

Se tudo funcionou localmente:

1. ✅ Código pronto para Render
2. ✅ Dockerfile validado
3. ✅ Sem surpresas no deploy

**Próximo passo:** Fazer push para GitHub e deploy no Render!

---

## 💡 Dicas Avançadas

### Build Multi-Stage (Reduzir tamanho)
Dockerfile já é otimizado com Alpine Linux (não precisa mudar).

### Push para Docker Hub (Opcional)
```bash
# Se quiser guardar imagem na nuvem:
docker tag lovable-local:latest seu_usuario/lovable:latest
docker push seu_usuario/lovable:latest
```

### Ambiente Diferente
```bash
# Testar com variáveis de staging:
docker run -p 3700:3700 \
  -e NODE_ENV=staging \
  -e LOG_LEVEL=debug \
  lovable-local:latest
```

---

**Dúvidas? Leia `GUIA_DEPLOY_RENDER.md` seção Docker! 🐳**
