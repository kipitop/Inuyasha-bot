import { areJidsSameUser, downloadMediaMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`⚠️ Ejemplo de uso:\n${usedPrefix + command} 521234567890`)
  }

  const num = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  const statusJid = 'status@broadcast'

  try {
    const messages = Object.entries(conn.chats)
      .filter(([jid]) => jid === statusJid)
      .flatMap(([_, chat]) => Object.values(chat.messages || {}))
      .filter(msg => areJidsSameUser(msg.key?.participant, num))

    if (!messages.length) {
      return m.reply('🚫 No se encontraron estados visibles de ese número.')
    }

    m.reply(`📥 Encontrados ${messages.length} estado(s), enviando...`)

    for (let msg of messages) {
      if (msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.documentMessage || msg.message?.audioMessage) {
        const buffer = await downloadMediaMessage(msg, 'buffer', {}, { reuploadRequest: conn.updateMediaMessage })
        if (buffer) {
          let mime = msg.message?.imageMessage?.mimetype ||
                     msg.message?.videoMessage?.mimetype ||
                     msg.message?.documentMessage?.mimetype ||
                     msg.message?.audioMessage?.mimetype || ''
          let ext = mime.split('/')[1] || 'bin'
          await conn.sendFile(m.chat, buffer, `estado.${ext}`, '', m)
        }
      } else if (msg.message?.conversation || msg.message?.extendedTextMessage?.text) {
        let text = msg.message.conversation || msg.message.extendedTextMessage.text
        await conn.sendMessage(m.chat, { text }, { quoted: m })
      }
    }
  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al intentar obtener los estados.')
  }
}

handler.help = ['destado <número>']
handler.tags = ['tools']
handler.command = ['destado']
handler.register = true

export default handler