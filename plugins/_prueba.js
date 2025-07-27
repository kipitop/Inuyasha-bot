import fs from 'fs'

let handler = async (m, { conn }) => {
  let thumb = fs.readFileSync('./media/kirito.jpg') // usa tu imagen
  await conn.sendMessage(m.chat, {
    text: '🌟 Este es un mensaje con externalAdReply',
    contextInfo: {
      externalAdReply: {
        title: "Canal Oficial de Kirito",
        body: "Sígueme para más actualizaciones",
        mediaType: 1,
        thumbnail: thumb,
        sourceUrl: "https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o",
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  })
}

handler.command = /^prueba1$/i
handler.owner = true
export default handler