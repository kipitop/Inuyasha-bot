import fs from 'fs'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const handler = async (m, { conn }) => {
  const thumb = fs.readFileSync('.src/catalogo.jpg') // Cambia a tu imagen

  // 1. externalAdReply
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

  // 2. fakeContact
  const fkontak = {
    key: {
      fromMe: false,
      remoteJid: 'status@broadcast',
      id: 'Halo',
      participant: '0@s.whatsapp.net'
    },
    message: {
      locationMessage: {
        name: '𝗣𝗥𝗨𝗘𝗕𝗔 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗢 𝗞𝗜𝗥𝗜𝗧𝗢',
        jpegThumbnail: thumb
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: '📍 Este mensaje está citado con un contacto falso'
  }, { quoted: fkontak })

  // 3. orderMessage (usando generateWAMessageFromContent)
  const order = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    orderMessage: {
      orderId: '12345',
      itemCount: 1,
      status: 1,
      surface: 1,
      message: '🛒 Kirito-Bot Premium disponible',
      orderTitle: 'Plan Premium',
      sellerJid: '52123456789@s.whatsapp.net',
      thumbnail: thumb
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, order.message, { messageId: order.key.id })

  // 4. productMessage (solo si tienes cuenta empresarial)
  const product = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    productMessage: {
      product: {
        productImage: {
          mimetype: 'image/jpeg',
          jpegThumbnail: thumb
        },
        title: '🔥 Kirito-Bot PRO',
        description: 'Comandos exclusivos, velocidad y más',
        currencyCode: 'USD',
        priceAmount1000: 1500,
        retailerId: 'kirito-pro',
        productImageCount: 1
      },
      businessOwnerJid: '52123456789@s.whatsapp.net'
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, product.message, { messageId: product.key.id })

  // 5. pollCreationMessage
  const poll = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    pollCreationMessage: {
      name: "¿Te gusta Kirito-Bot?",
      options: ["Sí", "Me encanta", "Lo amo"],
      selectableOptionsCount: 3
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, poll.message, { messageId: poll.key.id })

  // 6. liveLocationMessage
  const live = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    liveLocationMessage: {
      degreesLatitude: 15.5,
      degreesLongitude: -90.25,
      accuracyInMeters: 1,
      caption: "🗺️ Kirito-Bot en vivo",
      sequenceNumber: 999,
      timeOffset: 0,
      jpegThumbnail: thumb
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, live.message, { messageId: live.key.id })

  // 7. buttonsMessage
  await conn.sendMessage(m.chat, {
    text: "📣 Prueba de botón",
    footer: "Este es el pie de página",
    buttons: [
      { buttonId: ".menu", buttonText: { displayText: "📜 Ver Menú" }, type: 1 },
      { buttonId: ".donar", buttonText: { displayText: "💸 Donar" }, type: 1 }
    ],
    headerType: 1
  })
}

handler.command = /^prueba$/i
handler.owner = true

export default handler