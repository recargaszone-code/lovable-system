#!/bin/bash
set -e

echo "🐳 Iniciando teste local do fabricador em Docker..."
echo ""

# Limpar containers antigos
echo "Limpando containers antigos..."
docker-compose down --remove-orphans 2>/dev/null || true

# Build da imagem
echo "Buildando imagem Docker..."
docker-compose build --no-cache

echo ""
echo "🚀 Iniciando container..."
docker-compose up -d

echo ""
echo "⏳ Aguardando container inicializar (30s)..."
sleep 30

echo ""
echo "📊 Status do container:"
docker-compose ps

echo ""
echo "📝 Logs (últimas 50 linhas):"
docker-compose logs --tail=50 fabricador

echo ""
echo "🔍 Verificando saúde do container..."
if docker-compose exec fabricador curl http://localhost:3700/health 2>/dev/null; then
  echo "✅ Container respondendo no /health"
else
  echo "⚠️  /health ainda não respondendo - Chrome pode estar inicializando"
fi

echo ""
echo "📋 Monitorando logs em tempo real (Ctrl+C para sair)..."
docker-compose logs -f fabricador
