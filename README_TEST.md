# 🧪 Testes Locais — Antes do Railway

Executar os testes em ordem pra validar cada componente.

---

## **1. Teste Rápido (2 min)**

Valida configuração, dependências e arquivos críticos — sem Chrome.

```bash
node test-quick.js
```

**Esperado:** ✅ Sistema pronto para deploy

---

## **2. Teste Castle Bypass (3 min)**

Testa token minting local com DNS override e proxy parsing.

```bash
node test-bypass.js
```

**Esperado:**
- ✅ Token gerado
- ✅ 10 proxies carregados
- ✅ Credenciais API validadas

---

## **3. Teste Dashboard WebSocket (2 min)**

Inicia o servidor Express + WebSocket e testa health check.

```bash
node test-dashboard.js
```

**Esperado:**
- ✅ Health check OK
- ✅ Página carregada
- ✅ WebSocket conectado

---

## **4. Teste Completo de Conta (30-60 min - longo!)**

Cria email real no SmailPro → signup → login → extrai key.

```bash
node test-account-creation.js
```

⚠️ **Longo e requer Chrome real + SmailPro ativo**

**Esperado:**
- ✅ Email criado
- ✅ Account criada
- ✅ Key extraída

---

## ✅ Ordem Recomendada

1. `test-quick.js` — rápido, sem surpresas
2. `test-bypass.js` — valida Castle + proxies
3. `test-dashboard.js` — valida servidor
4. `test-account-creation.js` — se os 3 acima passarem

---

## 🚀 Se Tudo Passar

```bash
git add .
git commit -m "chore: all tests passed"
git push origin main
```

Depois → Railway deploy

---

## 🐛 Troubleshooting

| Teste | Erro | Solução |
|-------|------|---------|
| quick | Falta dependência | `npm install` |
| bypass | Chrome não encontrado | Instale Chrome / use --no-sandbox |
| dashboard | Porta em uso | Mude PORT=3700 em .env |
| account | SmailPro timeout | Cookies expirados — renove manualmente |

---

**Bora testar! 🚀**
