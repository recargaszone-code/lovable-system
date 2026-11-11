#!/usr/bin/env pwsh
Set-StrictMode -Version 3.0
$ErrorActionPreference = "Continue"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Teste Local do Fabricador em Docker                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Limpar
Write-Host "[1/5] Parando containers antigos..." -ForegroundColor Yellow
docker compose down --remove-orphans 2>$null
Start-Sleep -Seconds 2

# Build
Write-Host "[2/5] Buildando imagem Docker (isto leva ~2-3 min)..." -ForegroundColor Yellow
docker compose build --no-cache 2>&1 | Where-Object { $_ -match "(^Step|Successfully|ERROR)" }
Write-Host ""

# Up
Write-Host "[3/5] Iniciando container..." -ForegroundColor Yellow
docker compose up -d
Start-Sleep -Seconds 5

# Check status
Write-Host "[4/5] Verificando status..." -ForegroundColor Yellow
docker compose ps
Write-Host ""

# Wait for health
Write-Host "[5/5] Aguardando servidor inicializar (máx 60s)..." -ForegroundColor Yellow
$success = $false
for ($i = 1; $i -le 60; $i++) {
  try {
    $response = docker compose exec -T fabricador curl -s http://localhost:3700/health 2>$null
    if ($response) {
      Write-Host "`n✅ Servidor pronto!" -ForegroundColor Green
      $success = $true
      break
    }
  } catch { }
  Write-Host -NoNewline "."
  Start-Sleep -Seconds 1
}

if (-not $success) {
  Write-Host "`n⚠️  Timeout aguardando servidor" -ForegroundColor Yellow
}
Write-Host ""

# Show logs
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Logs da inicialização:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
docker compose logs fabricador --tail=50
Write-Host ""

# Ready to test
Write-Host "┌────────────────────────────────────────────────────────────┐" -ForegroundColor Green
Write-Host "│ Container pronto para teste!                              │" -ForegroundColor Green
Write-Host "├────────────────────────────────────────────────────────────┤" -ForegroundColor Green
Write-Host "│ Para iniciar o fabricador, rode:                          │" -ForegroundColor Green
Write-Host "│                                                            │" -ForegroundColor Green
Write-Host "│   curl -X POST http://localhost:3700/start                │" -ForegroundColor Green
Write-Host "│                                                            │" -ForegroundColor Green
Write-Host "│ Para monitorar logs em tempo real:                        │" -ForegroundColor Green
Write-Host "│                                                            │" -ForegroundColor Green
Write-Host "│   docker compose logs -f fabricador                       │" -ForegroundColor Green
Write-Host "│                                                            │" -ForegroundColor Green
Write-Host "│ Para parar tudo:                                          │" -ForegroundColor Green
Write-Host "│                                                            │" -ForegroundColor Green
Write-Host "│   docker compose down                                     │" -ForegroundColor Green
Write-Host "└────────────────────────────────────────────────────────────┘" -ForegroundColor Green
Write-Host ""

# Auto-start option
$response = Read-Host "Iniciar fabricador agora? (s/n)"
if ($response -eq 's' -or $response -eq 'S') {
  Write-Host "Iniciando fabricador..." -ForegroundColor Yellow
  curl -X POST http://localhost:3700/start
  Write-Host ""
  Write-Host "Monitorando logs (Ctrl+C para sair)..." -ForegroundColor Yellow
  docker compose logs -f fabricador
}
