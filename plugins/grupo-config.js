let handler = async (m, { conn, args, command, usedPrefix }) => {
  const icono = 'https://i.imgur.com/placeholder.jpg'
  const emoji = '✅'
  const emoji2 = '🔒'
  const fake = { contextInfo: { forwardingScore: 999, isForwarded: true } }

  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono)

  if (!args[0]) {
    return conn.reply(m.chat, `
╭╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⍰
┃ *ʕ•ᴥ•ʔ Elija una opción para configurar el grupo*
┃
┃ ✎ Ejemplos:
┃➾ *${usedPrefix + command} on*
┃➾ *${usedPrefix + command} off*
┃➾ *${usedPrefix + command} 1 on*
┃➾ *${usedPrefix + command} 2h off*
┃➾ *${usedPrefix + command} 1:00 off*
╰╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⍰`, m, fake)
  }

  
  let timeArg = null
  let actionArg = null

  const timeRegex = /^(\d+([smhd]?))$|^\d{1,2}:\d{2}$/
  if (timeRegex.test(args[0].toLowerCase())) {
    timeArg = args[0].toLowerCase()
    actionArg = args[1]?.toLowerCase()
  } else {
    actionArg = args[0]?.toLowerCase()
  }

  let isClose = {
    'on': 'not_announcement',
    'open': 'not_announcement',
    'abierto': 'not_announcement',
    'off': 'announcement',
    'close': 'announcement',
    'cerrado': 'announcement',
  }[actionArg]

  if (!isClose) {
    return m.reply('❌ *Acción inválida. Usa on/off o abre/cierra.*')
  }

  
  if (timeArg) {
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
    } else if (/^\d{1,2}:\d{2}$/.test(timeArg)) {
      let [h, m] = timeArg.split(':').map(Number)
      delayMs = (h * 60 + m) * 60 * 1000
    }

    if (!delayMs || delayMs < 1000) return m.reply('⏱️ *Tiempo inválido o muy corto.*')

    
    await conn.groupSettingUpdate(m.chat, isClose)
    m.reply(isClose === 'not_announcement'
      ? `${emoji} *Grupo abierto por ${timeArg}.*`
      : `${emoji2} *Grupo cerrado por ${timeArg}.*`)

    setTimeout(async () => {
      const revert = isClose === 'not_announcement' ? 'announcement' : 'not_announcement'
      await conn.groupSettingUpdate(m.chat, revert)
      conn.reply(m.chat, revert === 'not_announcement'
        ? `${emoji} *El grupo ha sido abierto automáticamente.*`
        : `${emoji2} *El grupo ha sido cerrado automáticamente.*`)
    }, delayMs)

  } else {
    
    await conn.groupSettingUpdate(m.chat, isClose)
    m.reply(isClose === 'not_announcement'
      ? `${emoji} *Ya pueden escribir en este grupo.*`
      : `${emoji2} *Solo los administradores pueden escribir en este grupo.*`)
  }
}

handler.help = ['grupo [tiempo] on/off']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler