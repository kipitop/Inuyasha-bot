let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

let handler = async (m, { conn }) => {
    const res = await fetch('https://files.catbox.moe/69o0eq.jpg');
const thumb2 = Buffer.from(await res.arrayBuffer());

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '𝗦𝗘 𝗖𝗔𝗠𝗕𝗜𝗢́ 𝗔 𝗖𝗢𝗡𝗧𝗘𝗡𝗜𝗗𝗢 𝗣𝗨́𝗕𝗟𝗜𝗖𝗢',
        jpegThumbnail: thumb2
      }
    },
    participant: "0@s.whatsapp.net"
  };

if (!m.quoted) return conn.reply(m.chat, `👑 Responde a una imagen ViewOnce.`, m, fake)
if (!m?.quoted || !m?.quoted?.viewOnce) return conn.reply(m.chat, `👑 Responde a una imagen ViewOnce.`, m, fake)
let buffer = await m.quoted.download(false);
if (/videoMessage/.test(m.quoted.mtype)) {
return conn.sendFile(m.chat, buffer, 'media.mp4', m.quoted.caption || '', fkontak)
} else if (/imageMessage/.test(m.quoted.mtype)) {
return conn.sendFile(m.chat, buffer, 'media.jpg', m.quoted?.caption || '', fkontak)
}}
handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'readvo', 'ver'] 
handler.register = true 

export default handler