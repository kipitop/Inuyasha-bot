let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

export async function before(m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return
const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
let chat = global.db.data.chats[m.chat]
let usuario = `@${m.sender.split`@`[0]}`
let pp = 'https://files.catbox.moe/12crnk.png'  

    
let nombre, foto, edit, newlink, status, admingp, noadmingp
nombre = `
╭───────✦ *NOMBRE DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ✎ Ha cambiado el nombre del grupo.
│ 
│ 📛 Nuevo nombre:
│ *<${m.messageStubParameters[0]}>*
╰──────────────────────────────╯`

foto = `
╭───────✦ *FOTO DEL GRUPO* ✦───────╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ⍰ Ha cambiado la imagen del grupo.
╰──────────────────────────────╯`

edit = `
╭───✦ *CONFIGURACIÓN DEL GRUPO* ✦───╮
│ 🧑‍💼 Usuario: *${usuario}*
│ ⌬ Ha permitido que 
│ ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} puedan configurar el grupo.
╰───────────────────────────╯`

newlink = `
╭──✦ *ENLACE RESTABLECIDO* ✦──╮
│ ⌨ El enlace del grupo ha sido restablecido por:
│ » *${usuario}*
╰──────────────────────────╯`

status = `
╭───✦ *ESTADO DEL GRUPO* ✦────╮
│ ⌬ El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'}
│ 🧑‍💼 Por: *${usuario}*
│ 
│ ⌬ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo los admins*' : '*todos*'} pueden enviar mensajes.
╰───────────────────────────╯`

admingp = `
╭─────✦ *NUEVO ADMIN* ✦──────╮
│ 👑 Usuario: *@${m.messageStubParameters[0].split`@`[0]}*
│ ☻ Ahora es administrador del grupo.
│ 
│ ⍰ Acción hecha por:
│ » *${usuario}*
╰───────────────────────────╯`

noadmingp = `
╭─────✦ *ADMIN REMOVIDO* ✦─────╮
│ 🛑 Usuario: *@${m.messageStubParameters[0].split`@`[0]}*
│ ☹ Ya no es administrador del grupo.
│ 
│ ⍰ Acción hecha por:
│ » *${usuario}*
╰───────────────────────────╯`

if (chat.detect && m.messageStubType == 21) {
await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })   

} else if (chat.detect && m.messageStubType == 22) {
await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })

} else if (chat.detect && m.messageStubType == 23) {
await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })    

} else if (chat.detect && m.messageStubType == 25) {
await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  

} else if (chat.detect && m.messageStubType == 26) {
await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  

} else if (chat.detect && m.messageStubType == 29) {
await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })  

return;
} if (chat.detect && m.messageStubType == 30) {
await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })  

} else {
//console.log({ messageStubType: m.messageStubType,
//messageStubParameters: m.messageStubParameters,
//type: WAMessageStubType[m.messageStubType], 
//})
}}