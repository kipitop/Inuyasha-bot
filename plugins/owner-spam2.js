const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = text.split('|').map(v => v.trim());

  if (args.length < 3) {
    return m.reply(`⚠︎ Debes ingresar el link del grupo, el mensaje y la cantidad de spam separados por "|".\n\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/SSSS | Hola, ¿cómo están? | 5`);
  }

  const [groupLink, message, countStr] = args;
  const count = parseInt(countStr, 10);

  if (!groupLink.includes('chat.whatsapp.com')) {
    return m.reply(`⚠︎ Proporcione un enlace válido del grupo.`);
  }
  if (isNaN(count) || count <= 0 || count > 6) {
    return m.reply(`⚠︎ Especifique una cantidad válida de mensajes entre 1 y 6.`);
  }

  const inviteCode = (groupLink.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/) || [])[1];
  if (!inviteCode) return m.reply(`⚠︎ Enlace de invitación inválido.`);

  try {
    let groupId;
    
    // Buscar si el grupo ya está en la lista de chats del bot
    const allGroups = Object.keys(conn.chats).filter(v => v.endsWith('@g.us'));
    for (let jid of allGroups) {
      const metadata = await conn.groupMetadata(jid).catch(() => null);
      if (metadata?.inviteCode === inviteCode || metadata?.id?.includes(inviteCode)) {
        groupId = metadata.id;
        break;
      }
    }

    // Si no está ya unido, intentar unirse
    if (!groupId) {
      groupId = await conn.groupAcceptInvite(inviteCode);
      m.reply(`✅ Me uní al grupo con éxito. Iniciando spam de ${count} mensajes...`);
    } else {
      m.reply(`🔄 Ya soy miembro del grupo. Enviando ${count} mensaje(s)...`);
    }

    // Enviar los mensajes con estilo enriquecido
    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, {
        text: message,
        contextInfo: {
          externalAdReply: {
            title: "📢 Anuncio del bot",
            body: "KiritoBot Notifier",
            thumbnailUrl: icono,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: redes
          }
        }
      });
      await delay(1500);
    }

    await delay(3000);
    m.reply(`🚪 Saliendo del grupo...`);
    await conn.groupLeave(groupId);
  } catch (error) {
    console.error(error);
    if (error?.message?.toLowerCase()?.includes('conflict')) {
      m.reply(`⚠︎ Ya soy miembro del grupo y no necesito aceptar la invitación. Intenta nuevamente.`);
    } else if (error?.message?.toLowerCase()?.includes('not-authorized')) {
      m.reply('❗ No tengo permiso para unirme a este grupo (probablemente requiere aprobación). Esperando 10 minutos como máximo...');
      await delay(600000); // 10 minutos
    } else {
      m.reply(`⚠︎ Error al intentar realizar la operación ⚠︎: ${error?.message || error}`);
    }
  }
};

handler.help = ['spam2'];
handler.tags = ['owner'];
handler.command = ['spam2'];
handler.owner = true;
export default handler;