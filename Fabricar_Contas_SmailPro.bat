@echo off
chcp 65001 >nul
title Fabricador & Apropriador de Contas Lovable (SmailPro)
cls

cd /d "B:\Lovable - Copy"

echo ============================================================
echo   FABRICADOR E APROPRIADOR DE CONTAS (SMAILPRO + PROXY)
echo ============================================================
echo.
echo  [1] Usar OUTLOOK (@outlook.com) - Mais estavel
echo  [2] Usar GMAIL (@gmail.com)
echo.
set /p prov="Escolha o provedor (1 ou 2, padrao 1): "

set TIPO=outlook
if "%prov%"=="2" set TIPO=gmail

echo.
set /p qtd="Quantas contas deseja processar no lote? (ex: 1, 3, 5, 10): "
if "%qtd%"=="" set qtd=1

cls
echo ============================================================
echo  Iniciando lote de %qtd% conta(s) com %TIPO%...
echo ============================================================
echo.

node fabricador_contas_smailpro.js %qtd% %TIPO%

echo.
echo Lote finalizado!
pause
