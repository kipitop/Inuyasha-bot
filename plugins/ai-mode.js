import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `⚡ Ingrese una petición para que Mode IA la responda.`, m, fake)
  }

  try {

          const res2 = await fetch('https://files.catbox.moe/udkbm9.jpg');
      const thumb = await res2.buffer();

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '.     ( 𝗜𝗔 )',
        jpegThumbnail: thumb
      }
    },
    participant: "0@s.whatsapp.net"
  }

    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    const id = m.sender || 'anon'
    const apiUrl = `https://g-mini-ia.vercel.app/api/mode-ia?prompt=${encodeURIComponent(text)}&id=${encodeURIComponent(id)}`

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const reply = json?.response?.trim()

    if (!reply) throw new Error('Sin respuesta de Mode IA')

    await conn.reply(m.chat, reply, fkontak, fake)
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