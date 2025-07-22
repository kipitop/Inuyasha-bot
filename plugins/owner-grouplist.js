let handler = async (m, { conn, args, command }) => {
  global.listadoGrupos = global.listadoGrupos || []

  if (['listgroup', 'grouplist'].includes(command)) {
    let txt = ''
    global.listadoGrupos = []

    const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    const totalGroups = groups.length

    for (let i = 0; i < totalGroups; i++) {
      const [jid] = groups[i]
      const metadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch(() => null))) || {}
      const participants = metadata.participants || []
      const bot = participants.find(u => conn.decodeJid(u.id) === conn.user.jid) || {}
      const isBotAdmin = bot?.admin || false
      const isParticipant = participants.some(u => conn.decodeJid(u.id) === conn.user.jid)
      const participantStatus = isParticipant ? 'Participante' : 'Ex-participante'
      const totalParticipants = participants.length
      const groupName = metadata.subject || await conn.getName(jid)
      const groupLink = isBotAdmin
        ? `https://chat.whatsapp.com/${await conn.groupInviteCode(jid).catch(() => '') || 'Error'}`
        : '(No disponible: sin permisos de admin)'

      global.listadoGrupos.push({ jid, nombre: groupName })

      txt += `╔══════ ⊹Grupo #${i + 1}⊹ ══════╗
╠ 📛 Nombre: ${groupName}
╠ 🆔 ID: ${jid}
╠ 🛡 Admin: ${isBotAdmin ? 'Sí' : 'No'}
╠ 👥 Estado: ${participantStatus}
╠ 🔢 Participantes: ${totalParticipants}
╠ 🔗 Link: ${groupLink}
╚════════════════════╝\n\n`
    }

    m.reply(`📄 *Lista de grupos del bot*\n\nTotal: ${totalGroups} grupos encontrados.\n\n${txt}`.trim())

  } else if (command == 'salirg') {
    const num = parseInt(args[0])
    if (!num || !global.listadoGrupos[num - 1]) return m.reply('❌ Grupo no encontrado. Usa primero *.listgroup*')

    const { jid, nombre } = global.listadoGrupos[num - 1]

    await conn.sendMessage(jid, {
      text: `👋 *${botname}* se despide de este grupo.\nGracias por todo. ¡Hasta pronto! ✨`
    })

    await conn.groupLeave(jid)
    await m.reply(`🚪 Salí del grupo *${nombre}* correctamente.`)

  } else if (command == 'aviso') {
    const texto = args.join(' ').split('|')
    const numero = parseInt(texto[0])
    const mensaje = texto[1]?.trim()

    if (!numero || !mensaje) return m.reply(`⚠️ Uso: *.aviso <número> | <mensaje>*\nEjemplo: *.aviso 2 | Hola grupo!*`)
    if (!global.listadoGrupos[numero - 1]) return m.reply('❌ Grupo no encontrado. Usa primero *.listgroup*')

    const { jid, nombre } = global.listadoGrupos[numero - 1]

    await conn.sendMessage(jid, {
      text: `📢 *AVISO DEL CREADOR*\n\n${mensaje}`
    })

    m.reply(`✅ Mensaje enviado a *${nombre}*`)
  }
}

handler.help = ['listgroup', 'salirg <número>', 'aviso <número> | <mensaje>']
handler.tags = ['owner']
handler.command = ['listgroup', 'salirg', 'aviso', 'grouplist']
handler.rowner = true

export default handler