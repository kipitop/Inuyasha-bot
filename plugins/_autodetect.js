import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

export async function before(m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return;

  let chat = global.db.data.chats[m.chat]
  if (!chat.detect) return;

  const usuario = `@${m.sender.split('@')[0]}`
  const res = await fetch('https://files.catbox.moe/cr196t.jpg')
  const thumb = await res.buffer()

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '𝗔𝗨𝗧𝗢 𝗗𝗘𝗧𝗘𝗖𝗧 𝗞𝗜𝗥𝗜𝗧𝗢',
        jpegThumbnail: thumb
      }
    },
    participant: "0@s.whatsapp.net"
  }

  const nombre = `
╭───────✦ *NOMBRE DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ✎ Ha cambiado el nombre del grupo.
│ 
│ 📛 Nuevo nombre:
│ *<${m.messageStubParameters[0]}>*
╰──────────────────────────────╯`

  const foto = `
╭───────✦ *FOTO DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ⍰ Ha cambiado la imagen del grupo.
╰──────────────────────────────╯`

  const edit = `
╭───✦ *CONFIGURACIÓN DEL GRUPO* ✦───╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ⌬ Ha permitido que 
│ ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} puedan configurar el grupo.
╰───────────────────────────╯`

  const newlink = `
╭──✦ *ENLACE RESTABLECIDO* ✦──╮
│ ⌨ El enlace del grupo ha sido restablecido por:
│ » *${usuario}*
╰──────────────────────────╯`

  const status = `
╭───✦ *ESTADO DEL GRUPO* ✦────╮
│ ⌬ El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'}
│ 🧑‍💼 Por: *${usuario}*
│ 
│ ⌬ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo los admins*' : '*todos*'} pueden enviar mensajes.
╰───────────────────────────╯`

  const admingp = `
╭─────✦ *NUEVO ADMIN* ✦──────╮
│ 👑 Usuario: *@${m.messageStubParameters[0].split('@')[0]}*
│ ☻ Ahora es administrador del grupo.
│ 
│ ⍰ Acción hecha por:
│ » *${usuario}*
╰───────────────────────────╯`

  const noadmingp = `
╭─────✦ *ADMIN REMOVIDO* ✦─────╮
│ 🛑 Usuario: *@${m.messageStubParameters[0].split('@')[0]}*
│ ☹ Ya no es administrador del grupo.
│ 
│ ⍰ Acción hecha por:
│ » *${usuario}*
╰───────────────────────────╯`

  switch (m.messageStubType) {
    case 21:
      await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })
      break
    case 22:
      let pp = 'https://telegra.ph/file/2cbe6f28d160e45f37d2a.jpg' // imagen por defecto
      await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })
      break
    case 23:
      await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
      break
    case 25:
      await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })
      break
    case 26:
      await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })
      break
    case 29:
      await conn.sendMessage(m.chat, { text: admingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
      break
    case 30:
      await conn.sendMessage(m.chat, { text: noadmingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
      break
    default:
      // console.log("Otro tipo de cambio:", m.messageStubType)
      break
  }
}