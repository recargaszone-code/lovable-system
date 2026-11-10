@echo off
chcp 65001 >nul
title GERADOR DE TOKENS JWT LOVABLE (REST API + PROXY POOL)
cls

echo ============================================================
echo    GERADOR AUTOMATIZADO DE TOKENS JWT (REST + PROXY POOL)
echo ============================================================
echo.
echo  [1] Gerar tokens para as primeiras 5 contas (Teste rapido)
echo  [2] Gerar tokens para as primeiras 15 contas
echo  [3] Gerar tokens para TODAS as contas do arquivo
echo  [0] Sair
echo.
set /p opcao="Escolha uma opcao (1 a 3 ou 0): "

if "%opcao%"=="1" (
    cls
    node gerar_tokens_jwt.js --count 5
    pause
    exit /b
)

if "%opcao%"=="2" (
    cls
    node gerar_tokens_jwt.js --count 15
    pause
    exit /b
)

if "%opcao%"=="3" (
    cls
    node gerar_tokens_jwt.js
    pause
    exit /b
)

if "%opcao%"=="0" (
    exit /b
)

echo Opcao invalida.
pause
