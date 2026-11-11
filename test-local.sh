#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Teste Local do Fabricador em Docker                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Limpar
echo -e "${YELLOW}[1/5]${NC} Parando containers antigos..."
docker-compose down --remove-orphans 2>/dev/null || true
sleep 2

# Build
echo -e "${YELLOW}[2/5]${NC} Buildando imagem Docker (isto leva ~2-3 min)..."
docker-compose build --no-cache 2>&1 | grep -E "(^Step|^Successfully|ERROR|ERROR)" || true
echo ""

# Up
echo -e "${YELLOW}[3/5]${NC} Iniciando container..."
docker-compose up -d
sleep 5

# Check status
echo -e "${YELLOW}[4/5]${NC} Verificando status..."
docker-compose ps
echo ""

# Wait for health
echo -e "${YELLOW}[5/5]${NC} Aguardando servidor inicializar (máx 60s)..."
for i in {1..60}; do
  if docker-compose exec -T fabricador curl -s http://localhost:3700/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor pronto!${NC}"
    break
  fi
  echo -n "."
  sleep 1
done
echo ""

# Show logs
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Logs da inicialização:${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
docker-compose logs fabricador | tail -50
echo ""

# Ready to test
echo -e "${GREEN}┌────────────────────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│ Container pronto para teste!                              │${NC}"
echo -e "${GREEN}├────────────────────────────────────────────────────────────┤${NC}"
echo -e "${GREEN}│ Para iniciar o fabricador, rode:                          │${NC}"
echo -e "${GREEN}│                                                            │${NC}"
echo -e "${GREEN}│   curl -X POST http://localhost:3700/start                │${NC}"
echo -e "${GREEN}│                                                            │${NC}"
echo -e "${GREEN}│ Para monitorar logs em tempo real:                        │${NC}"
echo -e "${GREEN}│                                                            │${NC}"
echo -e "${GREEN}│   docker-compose logs -f fabricador                       │${NC}"
echo -e "${GREEN}│                                                            │${NC}"
echo -e "${GREEN}│ Para parar tudo:                                          │${NC}"
echo -e "${GREEN}│                                                            │${NC}"
echo -e "${GREEN}│   docker-compose down                                     │${NC}"
echo -e "${GREEN}└─────────────────────────────────────��──────────────────────┘${NC}"
echo ""

# Auto-start option
read -p "Iniciar fabricador agora? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo -e "${YELLOW}Iniciando fabricador...${NC}"
  curl -X POST http://localhost:3700/start
  echo ""
  echo -e "${YELLOW}Monitorando logs (Ctrl+C para sair)...${NC}"
  docker-compose logs -f fabricador
fi
