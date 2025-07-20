let WAMessageStubType = (await import('@whiskeysockets/baileys')).default;
const fetch = require('node-fetch');

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  let chat = global.db.data.chats[m.chat];
  let usuario = `@${m.sender.split`@`[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  // Función generadora de "quoted" visual
  async function generarFokets(estado = '𝗔𝗖𝗖𝗜𝗢́𝗡') {
    const res = await fetch('https://files.catbox.moe/cstxnc.png');
    const thumb = await res.buffer();

    return {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'Halo'
      },
      message: {
        locationMessage: {
          name: estado,
          jpegThumbnail: thumb
        }
      },
      participant: '0@s.whatsapp.net'
    };
  }

  // Mensajes con estilo
  let nombre = `
╭───────✦ *NOMBRE DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ✎ Ha cambiado el nombre del grupo.
│ 
│ 📛 Nuevo nombre:
│ *<${m.messageStubParameters[0]}>*
╰──────────────────────────────╯`;

  let foto = `
╭───────✦ *FOTO DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ⍰ Ha cambiado la imagen del grupo.
╰──────────────────────────────╯`;

  let edit = `
╭───────✦ *CONFIGURACIÓN DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ⌬ Ha permitido que 
│ ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} puedan configurar el grupo.
╰────────────────────────────────────────╯`;

  let newlink = `
╭───────✦ *ENLACE RESTABLECIDO* ✦───────╮
│ ⌨ El enlace del grupo ha sido restablecido por:
│ » *${usuario}*
╰─────────────────────────────────────╯`;

  let status = `
╭───────✦ *ESTADO DEL GRUPO* ✦───────╮
│ ⌬ El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'}
│ 🧑‍💼 Por: *${usuario}*
│ 
│ ⌬ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo los admins*' : '*todos*'} pueden enviar mensajes.
╰────────────────────────────────────╯`;

  let admingp = `
╭───────✦ *NUEVO ADMIN* ✦───────╮
│ 👑 Usuario: *@${m.messageStubParameters[0].split`@`[0]}*
│ ☻ Ahora es administrador del grupo.
│ 
│ ⍰ Acción hecha por:
│ » *${usuario}*
╰──────────────────────────────╯`;

  let noadmingp = `
╭───────✦ *ADMIN REMOVIDO* ✦───────╮
│ 🛑 Usuario: *@${m.messageStubParameters[0].split`@`[0]}*
│ ☹ Ya no es administrador del grupo.
│ 
│ ⍰ Acción hecha por:
│ » *${usuario}*
╰────────────────────────────────╯`;

  // Envío según tipo
  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, {
      text: nombre,
      mentions: [m.sender]
    }, {
      quoted: await generarFokets('📝 Nombre')
    });

  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: foto,
      mentions: [m.sender]
    }, {
      quoted: await generarFokets('🖼 Foto')
    });

  } else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, {
      text: newlink,
      mentions: [m.sender]
    }, {
      quoted: await generarFokets('🔗 Enlace')
    });

  } else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, {
      text: edit,
      mentions: [m.sender]
    }, {
      quoted: await generarFokets('⚙️ Config')
    });

  } else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, {
      text: status,
      mentions: [m.sender]
    }, {
      quoted: await generarFokets('🔒 Estado')
    });

  } else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, {
      text: admingp,
      mentions: [m.sender, m.messageStubParameters[0]]
    }, {
      quoted: await generarFokets('👑 Admin+')
    });

  } else if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, {
      text: noadmingp,
      mentions: [m.sender, m.messageStubParameters[0]]
    }, {
      quoted: await generarFokets('🚫 Admin−')
    });

  } else {
    // Puedes activar esto para debug:
    // console.log({
    //   messageStubType: m.messageStubType,
    //   messageStubParameters: m.messageStubParameters,
    //   type: WAMessageStubType[m.messageStubType],
    // });
  }
}