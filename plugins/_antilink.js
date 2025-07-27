let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return 
  if (isAdmin || isOwner || m.fromMe || isROwner) return

  const res = await fetch('https://files.catbox.moe/4y8cg8.jpg');
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
        name: '𝗟𝗜𝗡𝗞 - 𝗗𝗘𝗧𝗘𝗖𝗧𝗔𝗗𝗢',
        jpegThumbnail: thumb2
      }
    },
    participant: "0@s.whatsapp.net"
  };

  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  const user = `@${m.sender.split`@`[0]}`;
  const groupAdmins = participants.filter(p => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');
  let bot = global.db.data.settings[this.user.jid] || {};
  const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;

  
  if (chat.antiLink && m?.msg?.contextInfo?.forwardedNewsletterMessageInfo && !isAdmin) {
    await conn.sendMessage(m.chat, { text: `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
┃ *「 MENSAJE DE CANAL DETECTADO 」*
┃
┃ ${user} Has reenviado un mensaje
┃ desde un canal. Serás eliminado...
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬`, mentions: [m.sender] }, { quoted: fkontak });

    if (!isBotAdmin) return conn.sendMessage(m.chat, { text: `⍰ El bot no tiene permisos de administrador para eliminar al usuario.`, mentions: [...groupAdmins.map(v => v.id)] }, { quoted: fkontak });

    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
    let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    if (responseb[0].status === "404") return;
    return !0;
  }

  if (isAdmin && chat.antiLink && m.text?.includes(grupo)) return m.reply(`✦ El antilink está activo pero te salvaste por ser admin.`);

  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }
    await conn.sendMessage(m.chat, { text: `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
┃ *「 ENLACE DETECTADO 」*
┃
┃ ${user} Rompiste las reglas del 
┃ Grupo serás eliminado...
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬`, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 });

    if (!isBotAdmin) return conn.sendMessage(m.chat, { text: `⍰ El antilink está activo pero no puedo eliminarte porque no soy admin.`, mentions: [...groupAdmins.map(v => v.id)] }, { quoted: fkontak });

    if (isBotAdmin) {
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
      let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (responseb[0].status === "404") return;
    }
  }

  return !0;
}