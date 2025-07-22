import fetch from 'node-fetch'

const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
const linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return
  if (isAdmin || isOwner || isROwner || m.fromMe) return

  const chat = global.db.data.chats[m.chat]
  if (!chat?.antiLink) return

  const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text)
  if (!isGroupLink) return

  const groupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
  if (m.text.includes(groupLink)) return

  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
  const userTag = `@${m.sender.split('@')[0]}`
  const msgId = m.key.id
  const participant = m.key.participant

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

  if (!isBotAdmin) {
    return conn.sendMessage(m.chat, {
      text: `⍰ El antilink está activo pero no puedo eliminar a ${userTag} porque no soy administrador.`,
      mentions: groupAdmins.map(v => v.id)
    }, { quoted: fkontak })
  }

  await conn.sendMessage(m.chat, {
    text: `
┏━━━━━━━━━━━━━━⬣
┃ *「 ENLACE DETECTADO 」*
┃
┃ ${userTag} rompiste las reglas del grupo.
┃ Serás eliminado...
┗━━━━━━━━━━━━━━⬣`,
    mentions: [m.sender]
  }, { quoted: fkontak })

  try {
    // Borra el mensaje del usuario
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: msgId,
        participant
      }
    })

    // Expulsa al usuario
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
  } catch (err) {
    console.error('[❗ ERROR AL ELIMINAR]', err)
  }

  return !0
}