import fetch from 'node-fetch'
import cheerio from 'cheerio'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Ingresa una palabra clave.\n\nEjemplo:\n${usedPrefix + command} pikachu`)

  let tag = encodeURIComponent(text.trim())
  let url = `https://rule34.xxx/index.php?page=post&s=list&tags=${tag}`
  let res = await fetch(url)
  if (!res.ok) return m.reply('❌ No se pudo acceder a la página.')
  
  let html = await res.text()
  let $ = cheerio.load(html)
  
  let posts = []
  $('div#content div.thumb').each((i, el) => {
    let img = $(el).find('img').attr('src')
    if (img && !img.includes('deleted')) {
      posts.push('https:' + img)
    }
  })

  if (posts.length === 0) return m.reply(`⚠️ No se encontraron resultados para "${text}"`)

  
  let selected = posts.sort(() => 0.5 - Math.random()).slice(0, 2)

  await conn.sendMessage(m.chat, {
    image: { url: selected[0] },
    caption: `🔞 Resultado 1 para *${text}*`
  }, { quoted: m })

  if (selected[1]) {
    await conn.sendMessage(m.chat, {
      image: { url: selected[1] },
      caption: `🔞 Resultado 2 para *${text}*`
    }, { quoted: m })
  }

}
handler.command = ['rule34', 'r34']
handler.help = ['rule34 <tag>']
handler.tags = ['nsfw']
handler.premium = false
handler.register = true

export default handler