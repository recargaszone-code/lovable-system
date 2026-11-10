const { criarEmailReal, verificarMensagens } = require('./smailpro_auto_helper');

async function testarMonitorCompleto() {
  console.log('============================================================');
  console.log('    TESTE DE INBOX TOTAL: SMAILPRO CONTA PAGA (QUALQUER E-MAIL)');
  console.log('============================================================\n');

  console.log('[1/3] Gerando e-mail real do Outlook no SmailPro...');
  const emailData = await criarEmailReal('outlook');
  console.log('\n' + '='.repeat(60));
  console.log(`📬 E-MAIL GERADO: ${emailData.email}`);
  console.log('='.repeat(60));

  console.log('\n[2/3] AGORA É SUA VEZ:');
  console.log(`👉 Abra seu Gmail pessoal e envie um e-mail para: ${emailData.email}`);
  console.log('👉 Pode colocar qualquer assunto e qualquer texto no corpo.');

  console.log('\n[3/3] Monitorando a caixa a cada 4 segundos...');
  console.log('      (Qualquer e-mail que cair vai ser exibido completo aqui na tela!)\n');

  const inicio = Date.now();
  const timeoutMs = 300000; // 5 minutos de monitoramento
  const mensagensExibidas = new Set();

  while (Date.now() - inicio < timeoutMs) {
    try {
      const mensagens = await verificarMensagens(emailData);
      if (mensagens && mensagens.length > 0) {
        for (const msg of mensagens) {
          const msgId = msg.id || msg.mid || (msg.subject + '_' + msg.date);
          if (!mensagensExibidas.has(msgId)) {
            mensagensExibidas.add(msgId);

            console.log('\n' + '*'.repeat(60));
            console.log('🎉 NOVO E-MAIL RECEBIDO COM SUCESSO!');
            console.log('*'.repeat(60));
            console.log(`👤 De (Remetente):  ${msg.from || msg.sender || 'Desconhecido'}`);
            console.log(`📌 Assunto:         ${msg.subject || '(Sem assunto)'}`);
            console.log(`🕒 Data/Hora:       ${msg.date || new Date().toLocaleTimeString()}`);
            console.log('-'.repeat(60));
            console.log('📄 Conteúdo / Mensagem:');
            console.log(msg.body || msg.snippet || JSON.stringify(msg, null, 2));
            console.log('*'.repeat(60) + '\n');
          }
        }
      }
    } catch (err) {
      // Ignora oscilação passageira de rede
    }

    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log('\n[FIM] Tempo de monitoramento de 5 minutos finalizado.');
}

testarMonitorCompleto().catch(err => {
  console.error('[ERRO CRÍTICO]', err.message);
});
