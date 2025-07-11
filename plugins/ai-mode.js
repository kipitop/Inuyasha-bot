import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `⚡ Ingrese una petición para que Mode IA la responda.`, m, fake)
  }

  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    const id = m.sender || 'anon'
    const apiUrl = `https://g-mini-ia.vercel.app/api/mode-ia?prompt=${encodeURIComponent(text)}&id=${encodeURIComponent(id)}`

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const reply = json?.response?.trim()

    if (!reply) throw new Error('Sin respuesta de Mode IA')

    await conn.reply(m.chat, reply, m, fake)
  } catch (err) {
    console.error('[Mode-IA Error]', err)
    await m.react('⚡️')
    await conn.reply(m.chat, `⚡ Mode IA no puede responder a esa pregunta.`, m, fake)
  }
}

handler.help = ['ia *<texto>*']
handler.tags = ['ia']
handler.command = ['ia']
handler.register = true
handler.group = true

export default handler