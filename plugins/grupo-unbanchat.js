let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!(m.chat in global.db.data.chats))
    return conn.reply(m.chat, '🔴 *¡ESTE CHAT NO ESTÁ REGISTRADO!*', m, rcanal);

  let chat = global.db.data.chats[m.chat];
  const fetch = (await import('node-fetch')).default;

  const estadoBot = async (estado = 'off') => {
    const res = await fetch('https://files.catbox.moe/cstxnc.png'); // tu imagen personalizada
    const thumb = await res.buffer();

    return {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: estado === 'on' ? '𝗘𝗡𝗖𝗘𝗡𝗗𝗜𝗗𝗢' : '𝗔𝗣𝗔𝗚𝗔𝗗𝗢',
          jpegThumbnail: thumb
        }
      },
      participant: "0@s.whatsapp.net"
    };
  };

  if (command === 'kirito') {
    if (args.length === 0) {
      const estado = chat.isBanned ? '⚠️ *DESACTIVADO*' : '✅ *ACTIVADO*';
      const info = `👑 *KIRITO-BOT CONTROL*  
╭━━━━━━━━━━━━━╮  
┃ *🔥 COMANDOS DISPONIBLES:*  
┃ ✦ *${usedPrefix}kirito on* – ⚡ 𝗔𝗰𝘁𝗶𝘃𝗮𝗿  
┃ ✦ *${usedPrefix}kirito off* – ⚡ 𝗗𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗮𝗿  
╰━━━━━━━━━━━━━╯  
🌟 *Estado actual:* ${estado}`;

      return conn.reply(m.chat, info, m, rcanal);
    }

    if (args[0] === 'off') {
      if (chat.isBanned)
        return conn.reply(m.chat, '⭕ *¡KIRITO-BOT YA ESTABA DESACTIVADO!*', m, rcanal);

      chat.isBanned = true;
      return conn.reply(m.chat, '⚠️ *¡KIRITO-BOT HA SIDO DESACTIVADO EN ESTE CHAT!*', await estadoBot('off'), rcanal);
    } else if (args[0] === 'on') {
      if (!chat.isBanned)
        return conn.reply(m.chat, '⭕ *¡KIRITO-BOT YA ESTABA ACTIVADO!*', m, rcanal);

      chat.isBanned = false;
      return conn.reply(m.chat, '✅ *¡KIRITO-BOT HA SIDO ACTIVADO EN ESTE CHAT!*', await estadoBot('on'), rcanal);
    }
  }
};

handler.help = ['kirito'];
handler.tags = ['grupo'];
handler.command = ['kirito'];
handler.admin = true;

export default handler;