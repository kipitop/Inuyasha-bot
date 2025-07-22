const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Emojis definidos
const emoji = '⚠️';
const emoji2 = '❌';
const done = '✅';
const msm = '🚫';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = text.split('|').map(v => v.trim());

  if (args.length < 3) {
    return m.reply(`${emoji} Debes ingresar el link del grupo, el mensaje y la cantidad de spam separados por "|".\n\nEjemplo:\n${usedPrefix + command} https://chat.whatsapp.com/SSSS | Hola, ¿cómo están? | 5`);
  }

  const [groupLink, message, countStr] = args;
  const count = Math.min(parseInt(countStr, 10), 6); // Límite de 6

  if (!groupLink.includes('chat.whatsapp.com/')) {
    return m.reply(`${emoji2} Proporcione un enlace válido del grupo.`);
  }
  if (isNaN(count) || count <= 0) {
    return m.reply(`${emoji2} Especifique una cantidad válida de mensajes (mayor a 0).`);
  }

  try {
    const code = groupLink.split('chat.whatsapp.com/')[1].split('?')[0];
    let groupId = `${code}@g.us`;

    // Verificar si ya está en el grupo
    let isInGroup = false;
    try {
      await conn.groupMetadata(groupId);
      isInGroup = true;
    } catch (e) {
      isInGroup = false;
    }

    // Si no está en el grupo, intentar unirse
    if (!isInGroup) {
      groupId = await conn.groupAcceptInvite(code).catch(() => null);

      if (!groupId) {
        m.reply('⏳ Grupo privado, esperando aceptación del admin (máx. 10 min)...');
        for (let i = 0; i < 20; i++) {
          await delay(30000); // Espera 30 segundos
          groupId = await conn.groupAcceptInvite(code).catch(() => null);
          if (groupId) break;
        }
        if (!groupId) return m.reply(`${emoji2} No fue aceptado al grupo en 10 minutos.`);
      }
    }

    m.reply(`${done} Enviando ${count} mensajes al grupo...`);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, { text: message });
      await delay(1500);
    }

    await conn.groupLeave(groupId);
    m.reply(`${done} Mensajes enviados y bot salió del grupo.`);

  } catch (error) {
    console.error(error);
    m.reply(`${msm} Error al intentar realizar la operación: ${error.message}`);
  }
};

handler.help = ['spam2 <enlace>|<mensaje>|<veces>'];
handler.tags = ['owner'];
handler.command = ['spam2'];
handler.owner = true;

export default handler;