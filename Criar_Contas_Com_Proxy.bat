@echo off
chcp 65001 >nul
title Criador de Contas Lovable com Proxies Residenciais
cls

cd /d "B:\Lovable - Copy"

echo ============================================================
echo   CRIADOR DE CONTAS LOVABLE (CHROME REAL + PROXY POOL)
echo ============================================================
echo.
echo  Quantas contas aleatorias deseja criar agora?
echo.
set /p qtd="Digite a quantidade (ex: 1, 3, 5) ou aperte ENTER para menu manual: "

if "%qtd%"=="" (
  node assistente_lovable.js
) else (
  node assistente_lovable.js --opcao 7 --qtd %qtd%
)

echo.
echo Finalizado.
pause
