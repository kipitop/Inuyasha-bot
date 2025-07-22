const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = text.split('|').map(v => v.trim());

  if (args.length < 3) {
    return m.reply(`⚠︎ Debes ingresar el link del grupo, el mensaje y la cantidad de spam separados por "|".\n\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/SSSS | Hola, ¿cómo están? | 5`);
  }

  const [groupLink, message, countStr] = args;
  const count = parseInt(countStr, 10);

  if (!groupLink.includes('chat.whatsapp.com')) {
    return m.reply(`❌ Proporcione un enlace válido del grupo.`);
  }

  if (isNaN(count) || count <= 0) {
    return m.reply(`❌ Especifique una cantidad válida de mensajes (mayor a 0).`);
  }

  const code = groupLink.split('chat.whatsapp.com/')[1];
  let groupId;

  try {
    // Intentar unirse al grupo
    groupId = await conn.groupAcceptInvite(code);
    m.reply(`✅ Unido al grupo con éxito. Iniciando spam de ${count} mensajes...`);
  } catch (e) {
    // Si ya está en el grupo
    if (e?.message?.toLowerCase().includes('conflict')) {
      try {
        // Obtener el ID real del grupo si ya está unido
        const metadata = await conn.groupGetInviteInfo(code);
        groupId = metadata.id;
        m.reply(`⚠︎ Ya soy miembro del grupo. Enviando los ${count} mensajes...`);
      } catch (err) {
        console.error(err);
        return m.reply(`⚠︎ Error al obtener la información del grupo: ${err.message}`);
      }
    } else {
      console.error(e);
      return m.reply(`⚠︎ Error al intentar unirse al grupo: ${e.message}`);
    }
  }

  try {
    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, { text: message });
      await delay(1000);
    }

    m.reply(`✅ Mensajes enviados correctamente. Saliendo del grupo...`);
    await conn.groupLeave(groupId);
  } catch (error) {
    console.error(error);
    m.reply(`⚠︎ Error al intentar enviar los mensajes: ${error.message}`);
  }
};

handler.help = ['spam2'];
handler.tags = ['owner'];
handler.command = ['spam2'];
handler.owner = true;

export default handler;