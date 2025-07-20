import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  
  async function getSystemQuotedMessage(type, m) {
    const sender = m.sender.split('@')[0]

    const estilos = {
      nameChange: {
        title: 'CAMBIO DE NOMBRE',
        org: 'Configuración del grupo',
        image: 'https://i.imgur.com/hEHLZ8y.png'
      },
      photoChange: {
        title: 'CAMBIO DE FOTO',
        org: 'Actualización visual',
        image: 'https://i.imgur.com/MI3dQog.png'
      },
      linkReset: {
        title: 'ENLACE RESTABLECIDO',
        org: 'Seguridad del grupo',
        image: 'https://i.imgur.com/7QYmnmB.png'
      },
      editPerms: {
        title: 'EDITAR INFO',
        org: 'Control de ajustes',
        image: 'https://i.imgur.com/s3MiyW5.png'
      },
      statusGroup: {
        title: 'ESTADO DEL GRUPO',
        org: 'Permisos de mensajes',
        image: 'https://i.imgur.com/JYlXc1z.png'
      },
      newAdmin: {
        title: 'NUEVO ADMIN',
        org: 'Gestión de equipo',
        image: 'https://freeimage.host/i/FwU9EHQ'
      },
      removedAdmin: {
        title: 'ADMIN REMOVIDO',
        org: 'Gestión de equipo',
        image: 'https://freeimage.host/i/FwU9EHQ'
      }
    }

    const info = estilos[type] || estilos.nameChange
    const thumbnail = await (await fetch(info.image)).buffer()

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
      name: estilos,
      jpegThumbnail: await (await fetch(`${image}`)).buffer(),
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

  let chat = global.db.data.chats[m.chat]
  if (!chat?.detect) return

  let usuario = `@${m.sender.split`@`[0]}`
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

  const borde = "╭───────────────╮"
  const medio = "│ KiritoBot MD"
  const fin =   "╰───────────────╯"

  let nombre = `${borde}\n${medio}\n╰➤ ${usuario} \ncambió el nombre del grupo.\n   Nuevo nombre: *${m.messageStubParameters[0]}*\n${fin}`
  let foto = {
    image: { url: pp },
    caption: `${borde}\n${medio}\n╰➤ ${usuario} \nactualizó la foto del grupo.\n   ¡Una nueva etapa comienza!\n${fin}`,
    mentions: [m.sender]
  }
  let edit = `${borde}\n${medio}\n╰➤ ${usuario} \nmodificó la configuración del grupo.\n   Ahora *${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'}* pueden editar info.\n${fin}`
  let newlink = `${borde}\n${medio}\n╰➤ ${usuario} \nrestableció el enlace del grupo.\n   ¡No lo compartas con cualquiera!\n${fin}`
  let status = `${borde}\n${medio}\n╰➤ El grupo fue *${m.messageStubParameters[0] == 'on' ? 'cerrado' : 'abierto'}* por ${usuario}.\n   Ahora *${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'}* pueden enviar mensajes.\n${fin}`
  let admingp = `${borde}\n${medio}\n╰➤ *@${m.messageStubParameters[0].split`@`[0]}* ahora es *admin*.\n   Acción realizada por ${usuario}\n${fin}`
  let noadmingp = `${borde}\n${medio}\n╰➤ *@${m.messageStubParameters[0].split`@`[0]}* ya no es *admin*.\n   Acción realizada por ${usuario}\n${fin}`

  switch (m.messageStubType) {
    case 21: // cambio de nombre
      await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, {
        quoted: await getSystemQuotedMessage('nameChange', m)
      })
      break
    case 22: // cambio de foto
      await conn.sendMessage(m.chat, foto, {
        quoted: await getSystemQuotedMessage('photoChange', m)
      })
      break
    case 23: // nuevo link
      await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, {
        quoted: await getSystemQuotedMessage('linkReset', m)
      })
      break
    case 25: // permisos de edición
      await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, {
        quoted: await getSystemQuotedMessage('editPerms', m)
      })
      break
    case 26: // cerrar/abrir grupo
      await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, {
        quoted: await getSystemQuotedMessage('statusGroup', m)
      })
      break
    case 29: // nuevo admin
      await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, {
        quoted: await getSystemQuotedMessage('newAdmin', m)
      })
      break
    case 30: // admin removido
      await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, {
        quoted: await getSystemQuotedMessage('removedAdmin', m)
      })
      break
  }
}