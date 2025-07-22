let linkRegex = /\b((https?:\/\/|www\.)?[\w-]+\.[\w-]+(?:\.[\w-]+)*(\/[\w.\-\/]*)?)\b/i

export async function before(m, { conn, isAdmin, isBotAdmin, text }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1

  const chat = global.db.data.chats[m.chat]
  const delet = m.key.participant
  const bang = m.key.id
  const bot = global.db.data.settings[this.user.jid] || {}
  const user = `@${m.sender.split`@`[0]}`
  const isGroupLink = linkRegex.exec(m.text)

  const res = await fetch('https://files.catbox.moe/4y8cg8.jpg')
  const thumb2 = Buffer.from(await res.arrayBuffer())

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
  }

  if (chat.antiLink2 && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
      const linkThisGroup2 = `https://www.youtube.com/`
      const linkThisGroup3 = `https://youtu.be/`
      if (m.text.includes(linkThisGroup) || m.text.includes(linkThisGroup2) || m.text.includes(linkThisGroup3)) return !0
    }

    const advertencia = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
┃ *「 ENLACE DETECTADO 」*
┃
┃ ${user} Rompiste las reglas del 
┃ grupo, serás eliminado...
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬`

    await this.sendMessage(m.chat, {
      text: advertencia,
      mentions: [m.sender]
    }, {
      quoted: fkontak,
      ephemeralExpiration: 24 * 60 * 1000,
      disappearingMessagesInChat: 24 * 60 * 1000
    })

    if (!isBotAdmin) return m.reply(`✦ No soy admin, no puedo expulsar.`, fkontak)

    if (isBotAdmin && bot.restrict) {
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
      const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      if (responseb[0].status === '404') return
    } else if (!bot.restrict) {
      return m.reply(`✦ El owner no tiene activa la opción de restringir, no puedo ejecutar esta acción.`, fkontak)
    }
  }

  return !0
}