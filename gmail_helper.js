const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

async function testarConexaoGmail(user, appPassword) {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: user,
      pass: appPassword.replace(/\s+/g, '')
    },
    logger: false
  });

  try {
    await client.connect();
    await client.logout();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Obtém o estado inicial da caixa antes do envio do formulário:
// Registra o maior UID geral e o maior UID do e-mail da conta (se já existir)
async function obterEstadoAntes(user, appPassword, emailDestino) {
  const cleanPassword = appPassword.replace(/\s+/g, '');
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass: cleanPassword },
    logger: false
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    // 1. Maior UID geral de mensagens da Lovable
    const uidsGerais = await client.search({ from: 'lovable.dev' }, { uid: true });
    const maxUidGeral = uidsGerais.length > 0 ? Math.max(...uidsGerais) : 0;

    // 2. Maior UID de mensagens enviadas especificamente para este e-mail (se houver)
    let maxUidDestino = 0;
    if (emailDestino) {
      const uidsDestino = await client.search({ from: 'lovable.dev', to: emailDestino.toLowerCase().trim() }, { uid: true });
      maxUidDestino = uidsDestino.length > 0 ? Math.max(...uidsDestino) : 0;
    }

    lock.release();
    await client.logout();

    return {
      maxUidGeral,
      maxUidDestino,
      timestampCaptura: Date.now()
    };
  } catch (err) {
    try { await client.logout(); } catch(e) {}
    return { maxUidGeral: 0, maxUidDestino: 0, timestampCaptura: Date.now() };
  }
}

// Compatibilidade retroativa se chamado isoladamente
async function obterUltimoCodigoLovable(user, appPassword) {
  const estado = await obterEstadoAntes(user, appPassword, null);
  return estado.maxUidGeral ? String(estado.maxUidGeral) : null;
}

// Extrai o link limpo de verificação a partir do corpo do e-mail
function extrairLinkVerificacao(texto) {
  if (!texto) return null;
  const match = texto.match(/https:\/\/lovable\.dev\/auth\/action\?mode=verifyEmail[^\s"'>\\]+/i);
  if (!match) return null;
  let link = match[0].replace(/&amp;/g, '&');
  link = link.replace(/[\.\,\;\)]+$/, '');
  return link;
}

// Aguarda e captura estritamente o ÚLTIMO e-mail de verificação recebido
async function aguardarLinkVerificacao(user, appPassword, emailDestino, estadoAntes = {}, timeoutSegundos = 120) {
  const cleanPassword = appPassword.replace(/\s+/g, '');
  const emailAlvo = (emailDestino || '').toLowerCase().trim();
  const maxUidGeralAntes = estadoAntes.maxUidGeral || 0;
  const maxUidDestinoAntes = estadoAntes.maxUidDestino || 0;

  console.log('\n' + '='.repeat(60));
  console.log(`[IMAP] MONITORANDO CHEGADA DO NOVO E-MAIL DE VERIFICAÇÃO`);
  console.log(`[IMAP] Conta Alvo: ${emailAlvo}`);
  console.log(`[IMAP] UID Anterior Geral: ${maxUidGeralAntes} | UID Anterior Conta: ${maxUidDestinoAntes}`);
  console.log(`[IMAP] Tempo Limite: ${timeoutSegundos}s`);
  console.log('='.repeat(60));

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass: cleanPassword },
    logger: false
  });

  await client.connect();
  const lock = await client.getMailboxLock('INBOX');

  const tempoInicio = Date.now();

  try {
    while ((Date.now() - tempoInicio) < (timeoutSegundos * 1000)) {
      try {
        await client.noop();
      } catch (e) {}

      // ESTRATÉGIA 1: Buscar especificamente e-mails da Lovable para o e-mail da conta (mais preciso e direto)
      if (emailAlvo) {
        try {
          const uidsDestino = await client.search({ from: 'lovable.dev', to: emailAlvo }, { uid: true });
          if (uidsDestino && uidsDestino.length > 0) {
            // Filtra por mensagens que chegaram DEPOIS do snapshot inicial
            const novos = uidsDestino.filter(uid => uid > maxUidDestinoAntes);
            if (novos.length > 0) {
              const ultimoUid = Math.max(...novos);
              const msg = await client.fetchOne(String(ultimoUid), { source: true, envelope: true }, { uid: true });
              if (msg && msg.source) {
                const parsed = await simpleParser(msg.source);
                const corpo = (parsed.text || '') + ' ' + (parsed.html || '');
                const link = extrairLinkVerificacao(corpo);
                if (link) {
                  console.log('\n\n[IMAP] >>> SUCESSO! ÚLTIMA MENSAGEM RECEBIDA IDENTIFICADA POR DESTINATÁRIO!');
                  console.log(`[IMAP] UID da Mensagem: ${ultimoUid}`);
                  console.log(`[IMAP] Destinatário: ${emailAlvo}`);
                  console.log(`[IMAP] Assunto: ${parsed.subject}`);
                  console.log(`[IMAP] Data de Envio: ${parsed.date}`);
                  console.log(`[IMAP] Link de Ativação: ${link}\n`);
                  return link;
                }
              }
            }
          }
        } catch (errSearchTo) {}
      }

      // ESTRATÉGIA 2: Buscar novas mensagens gerais da Lovable com UID maior que o anterior geral
      try {
        const uidsGerais = await client.search({ from: 'lovable.dev' }, { uid: true });
        if (uidsGerais && uidsGerais.length > 0) {
          const novosGerais = uidsGerais.filter(uid => uid > maxUidGeralAntes);
          if (novosGerais.length > 0) {
            // Ordena do mais recente para o mais antigo entre os novos
            novosGerais.sort((a, b) => b - a);

            for (const uid of novosGerais) {
              const msg = await client.fetchOne(String(uid), { source: true, envelope: true }, { uid: true });
              if (msg && msg.source) {
                const parsed = await simpleParser(msg.source);
                const corpo = (parsed.text || '') + ' ' + (parsed.html || '');
                const link = extrairLinkVerificacao(corpo);

                if (link) {
                  // Confirma se o e-mail pertence a esta conta ou ao domínio obsidien
                  const paraEnvelope = (msg.envelope?.to?.[0]?.address || '').toLowerCase();
                  const paraParsed = (parsed.to?.text || '').toLowerCase();
                  const destinatarioBate = !emailAlvo ||
                                           paraEnvelope.includes(emailAlvo) ||
                                           paraParsed.includes(emailAlvo) ||
                                           corpo.toLowerCase().includes(emailAlvo);

                  if (destinatarioBate || novosGerais.length === 1) {
                    console.log('\n\n[IMAP] >>> SUCESSO! ÚLTIMA MENSAGEM RECEBIDA IDENTIFICADA POR NOVO UID!');
                    console.log(`[IMAP] UID da Mensagem: ${uid}`);
                    console.log(`[IMAP] Destinatário no Cabeçalho: ${paraEnvelope || paraParsed}`);
                    console.log(`[IMAP] Assunto: ${parsed.subject}`);
                    console.log(`[IMAP] Link de Ativação: ${link}\n`);
                    return link;
                  }
                }
              }
            }
          }
        }
      } catch (errSearchGeneral) {}

      // Aguarda 2 segundos com indicador visual no terminal
      const decorrido = Math.round((Date.now() - tempoInicio) / 1000);
      process.stdout.write(`\r[IMAP] Aguardando a ÚLTIMA mensagem de verificação para ${emailAlvo || 'a conta'}... (${decorrido}s / ${timeoutSegundos}s) `);
      await new Promise(r => setTimeout(r, 2000));
    }

    // FALLBACK SE EXCEDER O TEMPO: Captura a ÚLTIMA mensagem recebida absoluta da Lovable no inbox
    console.log('\n[IMAP] Tempo de espera excedido. Buscando a ÚLTIMA mensagem absoluta da Lovable no inbox...');
    try {
      const uids = await client.search({ from: 'lovable.dev' }, { uid: true });
      if (uids && uids.length > 0) {
        const ultimoUidAbsoluto = Math.max(...uids);
        const msg = await client.fetchOne(String(ultimoUidAbsoluto), { source: true, envelope: true }, { uid: true });
        if (msg && msg.source) {
          const parsed = await simpleParser(msg.source);
          const corpo = (parsed.text || '') + ' ' + (parsed.html || '');
          const link = extrairLinkVerificacao(corpo);
          if (link) {
            console.log(`[IMAP] Utilizando a última mensagem absoluta encontrada (UID: ${ultimoUidAbsoluto})`);
            return link;
          }
        }
      }
    } catch (errFallback) {}

    return null;
  } finally {
    try {
      lock.release();
      await client.logout();
    } catch (e) {}
  }
}

module.exports = {
  testarConexaoGmail,
  obterEstadoAntes,
  obterUltimoCodigoLovable,
  extrairLinkVerificacao,
  aguardarLinkVerificacao
};
