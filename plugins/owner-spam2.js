const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = text.split('|').map(v => v.trim());

  if (args.length < 3) {
    return m.reply(`${emoji} Formato incorrecto. Debes proporcionar el enlace del grupo, el mensaje y la cantidad de veces que deseas enviarlo, separados por "|".\n\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/SSSS | Hola, ¿cómo están? | 5`, m, rcanal);
  }

  const [groupLink, message, countStr] = args;
  const count = parseInt(countStr, 10);

  if (!groupLink.includes('chat.whatsapp.com')) {
    return m.reply(`${emoji} Enlace inválido. Asegúrate de proporcionar un enlace válido de grupo de WhatsApp.`, m, rcanal);
  }
  if (isNaN(count) || count <= 0) {
    return m.reply(`${emoji} Cantidad inválida. Debes especificar un número válido mayor a 0 para la cantidad de mensajes.`, m, rcanal);
  }

  try {
    const code = groupLink.split('chat.whatsapp.com/')[1];
    const groupId = await conn.groupAcceptInvite(code);

    m.reply(`${emoji} Unido con éxito al grupo. Comenzando a enviar ${count} mensajes...`, m, rcanal);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, { text: message });
      await delay(1000); 
    }

    m.reply(`${emoji} Mensajes enviados con éxito. Saliendo del grupo...`, rcanal);
    await conn.groupLeave(groupId);
  } catch (error) {
    console.error(error);
    m.reply(`${emoji} Ocurrió un error: ${error.message}`, m, rcanal);
  }
};

handler.help = ['spam2'];
handler.tags = ['owner'];
handler.command = ['spam2'];
handler.owner = true;
export default handler;