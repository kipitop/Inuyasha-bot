import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`⚠️ Ejemplo de uso:\n${usedPrefix + command} 51987654321`)
  }

  let number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  try {
    const status = await conn.fetchStatus(number)

    if (!status?.status || status.status.length === 0) {
      return m.reply('🚫 Este contacto no tiene estados visibles o no te ha dado permiso para verlos.')
    }

    m.reply(`📥 Descargando ${status.status.length} estado(s)...`)

    for (const s of status.status) {
      if (s?.mediaType && s?.mimetype) {
        const buffer = await downloadMediaMessage(s, 'buffer', {}, { reuploadRequest: conn.updateMediaMessage })
        if (buffer) await conn.sendFile(m.chat, buffer, 'estado.' + s.mimetype.split('/')[1], '', m)
      } else if (s?.text) {
        await conn.reply(m.chat, `📝 Estado de texto:\n${s.text}`, m)
      }
    }
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al obtener los estados. Asegúrate de que el número tiene estados visibles para el bot.')
  }
}

handler.help = ['destado <número>']
handler.tags = ['tools']
handler.command = ['destado']
handler.register = true

export default handler