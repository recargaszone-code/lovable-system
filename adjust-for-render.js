#!/usr/bin/env node

/**
 * Script para ajustar código para executar no Render
 * Executa: node adjust-for-render.js
 */

const fs = require('fs');
const path = require('path');

const files = [
  { file: 'castle_bypass.js', search: "const CHROME_PATH = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';", replace: "const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/chromium-browser';" },
  { file: 'dashboard.js', search: 'const PORT = 3700;', replace: "const PORT = process.env.PORT || 3700;" },
];

console.log('🔧 Ajustando código para Render...\n');

files.forEach(({ file, search, replace }) => {
  const filepath = path.join(__dirname, file);

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filepath, 'utf8');

  if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ ${file} - Ajustado`);
  } else if (content.includes(replace)) {
    console.log(`⏭️  ${file} - Já estava ajustado`);
  } else {
    console.log(`❌ ${file} - Não encontrou padrão esperado. Verifique manualmente.`);
  }
});

console.log('\n✨ Pronto! Arquivos ajustados para Render.');
console.log('📝 Próximas ações:');
console.log('   1. git add .');
console.log('   2. git commit -m "chore: prepare for Render deployment"');
console.log('   3. git push origin main');
console.log('   4. Criar serviço no render.com');
