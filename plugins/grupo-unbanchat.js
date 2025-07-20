let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!(m.chat in global.db.data.chats)) 
    return conn.reply(m.chat, '🔴 *¡ESTE CHAT NO ESTÁ REGISTRADO!*', m, rcanal);

  let chat = global.db.data.chats[m.chat];

const fetch = require("node-fetch");

const fkontak = {
  key: {
    participants: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "Halo"
  },
  message: {
    locationMessage: {
      name: "ADMIN",
      jpegThumbnail: await (await fetch('https://freeimage.host/i/FwU9EHQ')).buffer(),
      vcard:
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "N:;Unlimited;;;\n" +
        "FN:Unlimited\n" +
        "ORG:Unlimited\n" +
        "TITLE:\n" +
        "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
        "item1.X-ABLabel:Unlimited\n" +
        "X-WA-BIZ-DESCRIPTION:ofc\n" +
        "X-WA-BIZ-NAME:Unlimited\n" +
        "END:VCARD"
    }
  },
  participant: "0@s.whatsapp.net"
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
      return conn.reply(m.chat, '⚠️ *¡KIRITO-BOT HA SIDO DESACTIVADO EN ESTE CHAT!*', fkontak, rcanal);
    } else if (args[0] === 'on', '5') {
      if (!chat.isBanned) 
        return conn.reply(m.chat, '⭕ *¡KIRITO-BOT YA ESTABA ACTIVADO!*', m, rcanal);
      
      chat.isBanned = false;
      return conn.reply(m.chat, '✅ *¡KIRITO-BOT HA SIDO ACTIVADO EN ESTE CHAT!*', m, rcanal);
    }
  }
};

handler.help = ['kirito'];
handler.tags = ['grupo'];
handler.command = ['kirito'];
handler.admin = true;

export default handler;