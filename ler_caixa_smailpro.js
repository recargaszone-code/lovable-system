const { verificarMensagens } = require('./smailpro_auto_helper');

// Exemplo para consultar qualquer email gerado pelo script
async function checar(email, timestamp, key, domain = 'gmail.com') {
  const dados = { email, timestamp, key, domain };
  console.log(`[SMAILPRO] Consultando mensagens recebidas para: ${email}...`);
  const msgs = await verificarMensagens(dados);
  console.log(`[SMAILPRO] Total de mensagens: ${msgs.length}`);
  if (msgs.length > 0) {
    msgs.forEach((m, i) => {
      console.log(`\n--- Mensagem #${i+1} ---`);
      console.log('De:', m.from || m.sender);
      console.log('Assunto:', m.subject);
      console.log('Link detectado:', (m.body || '').match(/https?:\/\/[^\s"'<>]+/g));
    });
  } else {
    console.log('Nenhuma mensagem recebida ainda.');
  }
}

// Se rodar direto: node ler_caixa_smailpro.js <email> <key> <timestamp>
const [,, email, key, ts, dom] = process.argv;
if (email && key) {
  checar(email, parseInt(ts || Date.now() / 1000, 10), key, dom || 'gmail.com');
} else {
  module.exports = { checar };
}
