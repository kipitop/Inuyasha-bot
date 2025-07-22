import { default as baileys, WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const chat = global.db.data.chats[m.chat]
  if (!chat || !chat.detect) return

  let usuario = `@${m.sender.split('@')[0]}`
  const stubParam = m.messageStubParameters?.[0] || ''
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')

  const res = await fetch('https://files.catbox.moe/p0ibbd.jpg')
  const thumb = await res.buffer()

  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo',
    },
    message: {
      locationMessage: {
        name: '𝗔𝗨𝗧𝗢 𝗗𝗘𝗧𝗘𝗖𝗧 𝗞𝗜𝗥𝗜𝗧𝗢',
        jpegThumbnail: thumb,
      },
    },
    participant: '0@s.whatsapp.net',
  }

  const borde = '╭───────────────╮'
  const medio = '│ ᴋɪʀɪᴛᴏ ʙᴏᴛ ᴍᴅ'
  const fin = '╰───────────────╯'

  const nombre = `${borde}\n${medio}\n╰➤ ${usuario} \ncambió el nombre del grupo.\n   Nuevo nombre: *${stubParam}*\n${fin}`

  const foto = {
    image: { url: pp },
    caption: `${borde}\n${medio}\n╰➤ ${usuario} \nactualizó la foto del grupo.\n   ¡Una nueva etapa comienza!\n${fin}`,
    mentions: [m.sender],
  }

  const edit = `${borde}\n${medio}\n╰➤ ${usuario} \nmodificó la configuración del grupo.\n   Ahora *${stubParam === 'on' ? 'solo admins' : 'todos'}* pueden editar info.\n${fin}`

  const newlink = `${borde}\n${medio}\n╰➤ ${usuario} \nrestableció el enlace del grupo.\n   ¡No lo compartas con cualquiera!\n${fin}`

  const status = `${borde}\n${medio}\n╰➤ El grupo fue *${stubParam === 'on' ? 'cerrado' : 'abierto'}* por ${usuario}.\n   Ahora *${stubParam === 'on' ? 'solo admins' : 'todos'}* pueden enviar mensajes.\n${fin}`

  const admingp = `${borde}\n${medio}\n╰➤ *@${stubParam.split('@')[0]}* ahora es *admin*.\n   Acción realizada por ${usuario}\n${fin}`

  const noadmingp = `${borde}\n${medio}\n╰➤ *@${stubParam.split('@')[0]}* ya no es *admin*.\n   Acción realizada por ${usuario}\n${fin}`

  switch (m.messageStubType) {
    case WAMessageStubType.GROUP_CHANGE_SUBJECT:
      await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })
      break
    case WAMessageStubType.GROUP_CHANGE_ICON:
      await conn.sendMessage(m.chat, foto, { quoted: fkontak })
      break
    case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
      await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
      break
    case WAMessageStubType.GROUP_CHANGE_SETTINGS:
      await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })
      break
    case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
      await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })
      break
    case WAMessageStubType.PARTICIPANT_PROMOTE:
      await conn.sendMessage(m.chat, { text: admingp, mentions: [m.sender, stubParam] }, { quoted: fkontak })
      break
    case WAMessageStubType.PARTICIPANT_DEMOTE:
      await conn.sendMessage(m.chat, { text: noadmingp, mentions: [m.sender, stubParam] }, { quoted: fkontak })
      break
  }
}