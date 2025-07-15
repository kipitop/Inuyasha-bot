const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = text.split('|').map(v => v.trim());

  if (args.length < 3) {
    return m.reply(`⚠️ Debes ingresar el link del grupo, el mensaje y la cantidad de spam separados por "|".\n\n📌 Ejemplo:\n${usedPrefix + command} https://chat.whatsapp.com/SSSS | Hola, ¿cómo están? | 5`);
  }

  const [groupLink, message, countStr] = args;
  const count = parseInt(countStr, 10);

  if (!groupLink.includes('chat.whatsapp.com')) {
    return m.reply(`⚠️ Proporcione un enlace válido del grupo.`);
  }

  if (isNaN(count) || count <= 0) {
    return m.reply(`⚠️ Especifique una cantidad válida de mensajes (mayor a 0).`);
  }

  try {
    const code = groupLink.split('chat.whatsapp.com/')[1];
    if (!code || code.length < 20) {
      return m.reply(`⚠️ El enlace del grupo parece estar dañado o incompleto.`);
    }

    const groupId = await conn.groupAcceptInvite(code);
    m.reply(`✅ Solicitud enviada. Esperando aprobación si es necesaria...`);

    let approved = false;
    let retries = 0;

    while (!approved && retries < 30) {
      try {
        const metadata = await conn.groupMetadata(groupId);
        if (metadata.participants.some(p => p.id === conn.user.id)) {
          approved = true;
          break;
        }
      } catch (e) {
        if (e?.output?.statusCode !== 403) console.log(e);
      }
      await delay(1000);
      retries++;
    }

    if (!approved) {
      return m.reply(`❌ No se pudo acceder al grupo. Es probable que el bot aún no haya sido aprobado.`);
    }

    m.reply(`📨 Iniciando spam de ${count} mensajes...`);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, { text: message });
      await delay(1000);
    }

    m.reply(`✅ Mensajes enviados. Saliendo del grupo...`);
    await conn.groupLeave(groupId);

  } catch (error) {
    console.error(error);
    if (error?.message === 'bad-request') {
      m.reply('❌ El enlace del grupo es inválido o el bot no tiene permiso para unirse.');
    } else {
      m.reply(`⚠️ Error al intentar realizar la operación: ${error?.message || error}`);
    }
  }
};

handler.help = ['spam2'];
handler.tags = ['owner'];
handler.command = ['spam2'];
handler.owner = true;

export default handler;