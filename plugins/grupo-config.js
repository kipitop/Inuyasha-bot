import { parse } from 'chrono-node'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  

  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono)

  let action = args[0]?.toLowerCase()
  let timeArg = args[1]?.toLowerCase()

  let isClose = {
    'open': 'not_announcement',
    'on': 'not_announcement',
    'abierto': 'not_announcement',
    'off': 'announcement',
    'close': 'announcement',
    'cerrado': 'announcement',
  }[action]

  if (!isClose) {
    return conn.reply(m.chat, `
╭╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⍰
┃ *ʕ•ᴥ•ʔ Elija una opción para configurar el grupo*
┃
┃ ✎ Ejemplo:
┃➾ *${usedPrefix + command} on*
┃➾ *${usedPrefix + command} off*
┃➾ *${usedPrefix + command} on 5*
┃➾ *${usedPrefix + command} off 10m*
┃➾ *${usedPrefix + command} on 7am*
╰╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⍰`, m, fake)
  }

  await conn.groupSettingUpdate(m.chat, isClose)

  if (isClose === 'not_announcement') {
    m.reply(`${emoji} *Ya pueden escribir en este grupo.*`)
  } else {
    m.reply(`${emoji2} *Solo los administradores pueden escribir en este grupo.*`)
  }

  if (!timeArg) return

  
  let delayMs = null
  if (/^\d+$/.test(timeArg)) {
    delayMs = parseInt(timeArg) * 60 * 1000 
  } else if (/^\d+(s|m|h|d)$/.test(timeArg)) {
    let num = parseInt(timeArg)
    let unit = timeArg.slice(-1)
    if (unit === 's') delayMs = num * 1000
    if (unit === 'm') delayMs = num * 60 * 1000
    if (unit === 'h') delayMs = num * 60 * 60 * 1000
    if (unit === 'd') delayMs = num * 24 * 60 * 60 * 1000
  } else {
    let parsedDate = parse(timeArg, new Date(), { forwardDate: true })[0]
    if (parsedDate) {
      delayMs = parsedDate.start.date().getTime() - Date.now()
    }
  }

  if (!delayMs || delayMs < 1000) return m.reply('⏱️ *Tiempo inválido o muy corto.*')

  setTimeout(async () => {
    const reverse = isClose === 'not_announcement' ? 'announcement' : 'not_announcement'
    await conn.groupSettingUpdate(m.chat, reverse)
    conn.reply(m.chat, reverse === 'not_announcement' 
      ? `${emoji} *El grupo ha sido abierto automáticamente.*` 
      : `${emoji2} *El grupo ha sido cerrado automáticamente.*`, null)
  }, delayMs)
}

handler.help = ['grupo on/off [tiempo]']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler