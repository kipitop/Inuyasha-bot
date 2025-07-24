let handler = async (m, { conn, args, command, usedPrefix }) => {
  const icono = 'https://i.imgur.com/placeholder.jpg'
  const emoji = '✅'
  const emoji2 = '🔒'
  const fake = { contextInfo: { forwardingScore: 999, isForwarded: true } }

  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono)

  let rawTime = args[0]?.toLowerCase()
  let rawAction = args[1]?.toLowerCase()

  let action = rawAction || rawTime

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
┃ ✎ Ejemplos:
┃➾ *${usedPrefix + command} on*
┃➾ *${usedPrefix + command} off*
┃➾ *${usedPrefix + command} 1 on*
┃➾ *${usedPrefix + command} 2h off*
┃➾ *${usedPrefix + command} 1:00 off*
╰╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⍰`, m, fake)
  }

  let delayMs = null

  if (rawAction && rawAction !== rawTime) {
    if (/^\d+$/.test(rawTime)) {
      delayMs = parseInt(rawTime) * 60 * 1000
    } else if (/^\d+(s|m|h|d)$/.test(rawTime)) {
      let num = parseInt(rawTime)
      let unit = rawTime.slice(-1)
      if (unit === 's') delayMs = num * 1000
      if (unit === 'm') delayMs = num * 60 * 1000
      if (unit === 'h') delayMs = num * 60 * 60 * 1000
      if (unit === 'd') delayMs = num * 24 * 60 * 60 * 1000
    } else if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
      let [hours, minutes] = rawTime.split(':').map(Number)
      delayMs = (hours * 60 + minutes) * 60 * 1000
    }

    if (!delayMs || delayMs < 1000) {
      return m.reply('⏱️ *Tiempo inválido o muy corto.*')
    }

    m.reply(isClose === 'not_announcement'
      ? `${emoji} *El grupo se abrirá durante el tiempo indicado.*`
      : `${emoji2} *El grupo se cerrará durante el tiempo indicado.*`)

    await conn.groupSettingUpdate(m.chat, isClose)

    setTimeout(async () => {
      const reverse = isClose === 'not_announcement' ? 'announcement' : 'not_announcement'
      await conn.groupSettingUpdate(m.chat, reverse)
      conn.reply(m.chat, reverse === 'not_announcement'
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