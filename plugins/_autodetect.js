import chalk from 'chalk'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'
import { readdirSync, unlinkSync, existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const usuario = '@' + m.sender.split('@')[0]
  let chat = global.db.data.chats[m.chat] || {}

  const res = await fetch('https://files.catbox.moe/p0ibbd.jpg')
  const thumb = await res.buffer()

  let pp
  try {
    pp = await conn.profilePictureUrl(m.chat, 'image')
  } catch {
    pp = 'https://i.imgur.com/JP52fdP.jpg'
  }

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

  let nombre = `╭━━━〔 📝 *NOMBRE ACTUALIZADO* 〕━━━╮
┃  
┃  *${usuario}* ha cambiado el nombre del grupo.
┃  Ahora se llama:
┃ ✦ *${m.messageStubParameters[0]}*
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  let foto = `╭━━━〔 🖼️ *IMAGEN ACTUALIZADA* 〕━━━╮
┃  
┃ Se ha cambiado la imagen del grupo.
┃  
┃  *Acción hecha por:*
┃   » ${usuario}
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  let edit = `╭━━〔 ⚙️ *CONFIGURACIÓN DEL GRUPO* 〕━━╮
┃  
┃ ${usuario} ha actualizado los permisos.
┃ Ahora *${m.messageStubParameters[0] == 'on' ? 'solo los administradores' : 'todos los miembros'}* 
┃ pueden editar ajustes del grupo.
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  let newlink = `╭━━━〔 🔗 *ENLACE RESTABLECIDO* 〕━━━╮
┃  
┃ El enlace del grupo ha sido restablecido.
┃  
┃  *Acción hecha por:*
┃   » ${usuario}
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  let status = `╭━━〔 🔒 *ESTADO DEL GRUPO* 〕━━╮
┃  
┃ El grupo ha sido *${m.messageStubParameters[0] == 'on' ? 'cerrado' : 'abierto'}* por ${usuario}.
┃  Ahora *${m.messageStubParameters[0] == 'on' ? 'solo los administradores' : 'todos los miembros'}* 
┃ pueden enviar mensajes.
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  let admingp = `╭━━〔 🎖️ *NUEVO ADMIN* 〕━━╮
┃  
┃ @${m.messageStubParameters[0].split`@`[0]} ahora es 
┃ *administrador* del grupo.
┃  
┃  *Acción hecha por:*
┃   » ${usuario}
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  let noadmingp = `╭━━〔 ❌ *ADMIN REMOVIDO* 〕━━╮
┃  
┃ @${m.messageStubParameters[0].split`@`[0]} ha dejado de 
┃ ser *administrador* del grupo.
┃  
┃  *Acción hecha por:*
┃   » ${usuario}
┃  
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  // ACCIONES SEGÚN messageStubType
  if (chat.detect && m.messageStubType == 2) {
    const uniqid = (m.isGroup ? m.chat : m.sender)
    const sessionPath = './Sessions/'
    for (const file of await fs.readdir(sessionPath)) {
      if (file.includes(uniqid)) {
        await fs.unlink(path.join(sessionPath, file))
        console.log(`${chalk.yellow.bold('[ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
        `${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`)
      }
    }
  } else if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })  
  } else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 23) {
    await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  
  } else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  
  } else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(m.chat, { text: admingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(m.chat, { text: noadmingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
  } else {
    if (m.messageStubType == 2) return
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType], 
    })
  }
}
export default handler