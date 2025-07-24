let handler = async (m, { conn, args, command, usedPrefix }) => {
  const emoji = '✅'
  const emoji2 = '🔒'
  const fake = { contextInfo: { forwardingScore: 999, isForwarded: true } }

  if (!args[0]) {
    return conn.reply(m.chat, `
╭── ⏳ *CONFIGURAR GRUPO* ──╮
│
│ ➤ *Ejemplos válidos:*
│   ◦ ${usedPrefix + command} on
│   ◦ ${usedPrefix + command} off
│   ◦ ${usedPrefix + command} 1 on
│   ◦ ${usedPrefix + command} 2h off
│   ◦ ${usedPrefix + command} 1:00 on
│
╰──────────────────────╯`, m, fake)
  }

  
  let rawTime, rawAction
  const timeRegex = /^(\d+([smhd]?))$|^\d{1,2}:\d{2}$/

  if (timeRegex.test(args[0])) {
    rawTime = args[0].toLowerCase()
    rawAction = args[1]?.toLowerCase()
  } else {
    rawAction = args[0]?.toLowerCase()
  }

  const actionMap = {
    'on': 'not_announcement',
    'off': 'announcement',
    'open': 'not_announcement',
    'close': 'announcement',
    'abierto': 'not_announcement',
    'cerrado': 'announcement',
  }

  const isClose = actionMap[rawAction]

  if (!isClose) {
    return m.reply('❌ *Acción inválida. Usa on/off o abre/cierra.*')
  }

  
  if (rawTime) {
    let delayMs = null

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
      let [h, m] = rawTime.split(':').map(Number)
      delayMs = (h * 60 + m) * 60 * 1000
    }

    if (!delayMs || delayMs < 1000) {
      return m.reply('⏱️ *Tiempo inválido o muy corto.*')
    }

    
    m.reply(isClose === 'not_announcement'
      ? `${emoji} *Grupo abierto por ${rawTime}.*`
      : `${emoji2} *Grupo cerrado por ${rawTime}.*`)

    
    await conn.groupSettingUpdate(m.chat, isClose)

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
handler.command = ['grupo', 'group']
handler.admin = true
handler.botAdmin = true

export default handler