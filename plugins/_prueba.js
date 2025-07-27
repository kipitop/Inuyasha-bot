import fs from 'fs'
import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  let thumb = fs.readFileSync('./media/kirito.jpg')

  const product = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    productMessage: {
      product: {
        productImage: { mimetype: 'image/jpeg', jpegThumbnail: thumb },
        title: '🛍️ Kirito-Bot PRO',
        description: 'Comandos exclusivos + velocidad máxima',
        currencyCode: 'USD',
        priceAmount1000: 2500,
        retailerId: 'kirito-bot-pro',
        productImageCount: 1
      },
      businessOwnerJid: '52123456789@s.whatsapp.net'
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, product.message, { messageId: product.key.id })
}

handler.command = /^prueba4$/i
handler.owner = true
export default handler



/*import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const poll = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    pollCreationMessage: {
      name: "¿Te gusta Kirito-Bot?",
      options: ["Sí", "Lo amo", "Es Dios"],
      selectableOptionsCount: 3
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, poll.message, { messageId: poll.key.id })
}

handler.command = /^prueba5$/i
handler.owner = true
export default handler*/