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
    const groupId = await conn.groupAcceptInvite(code);

    m.reply(`✅ Unido al grupo con éxito. Verificando permisos...`);

    // Esperar aprobación si es necesario
    let approved = false;
    let retries = 0;

    while (!approved && retries < 15) { // espera hasta 15 segundos
      try {
        const metadata = await conn.groupMetadata(groupId);
        if (metadata.participants.some(p => p.id === conn.user.id)) {
          approved = true;
        }
      } catch (e) {
        // probablemente aún no está aprobado
      }
      if (!approved) await delay(1000);
      retries++;
    }

    if (!approved) {
      return m.reply(`⚠️ El bot aún no ha sido aprobado en el grupo. No se puede continuar con el spam.`);
    }

    m.reply(`📨 Iniciando spam de ${count} mensajes...`);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, { text: message });
      await delay(1000); 
    }

    m.reply(`✅ Spam completado. Saliendo del grupo...`);
    await conn.groupLeave(groupId);

  } catch (error) {
    console.error(error);
    m.reply(`⚠️ Error al intentar realizar la operación: ${error.message}`);
  }
};

handler.help = ['spam2'];
handler.tags = ['owner'];
handler.command = ['spam2'];
handler.owner = true;

export default handler;