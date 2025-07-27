import fs from 'fs'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const thumb = fs.readFileSync('./media/kirito.jpg') // Imagen usada para los mensajes

// .prueba1 - externalAdReply
async function prueba1(m, { conn }) {
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

// .prueba2 - fakeContact
async function prueba2(m, { conn }) {
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
}

// .prueba3 - orderMessage
async function prueba3(m, { conn }) {
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
}

// .prueba4 - productMessage
async function prueba4(m, { conn }) {
  const product = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    productMessage: {
      product: {
        productImage: {
          mimetype: 'image/jpeg',
          jpegThumbnail: thumb
        },
        title: '🔥 Kirito-Bot PRO',
        description: 'Comandos exclusivos, velocidad extrema y más',
        currencyCode: 'USD',
        priceAmount1000: 1500,
        retailerId: 'kirito-pro',
        productImageCount: 1
      },
      businessOwnerJid: '52123456789@s.whatsapp.net'
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, product.message, { messageId: product.key.id })
}

// .prueba5 - pollCreationMessage
async function prueba5(m, { conn }) {
  const poll = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    pollCreationMessage: {
      name: "¿Te gusta Kirito-Bot?",
      options: ["Sí", "Mucho", "Lo Amo"],
      selectableOptionsCount: 3
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, poll.message, { messageId: poll.key.id })
}

// .prueba6 - liveLocationMessage
async function prueba6(m, { conn }) {
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
}

// .prueba7 - buttonsMessage
async function prueba7(m, { conn }) {
  await conn.sendMessage(m.chat, {
    text: "📣 Prueba de botones interactivos",
    footer: "Este es el pie de página",
    buttons: [
      { buttonId: ".menu", buttonText: { displayText: "📜 Ver Menú" }, type: 1 },
      { buttonId: ".donar", buttonText: { displayText: "💸 Donar" }, type: 1 }
    ],
    headerType: 1
  })
}

// Exportar cada comando como handler separado
export const handler1 = {
  command: /^prueba1$/i,
  owner: true,
  async handler(m, args) { await prueba1(m, args) }
}

export const handler2 = {
  command: /^prueba2$/i,
  owner: true,
  async handler(m, args) { await prueba2(m, args) }
}

export const handler3 = {
  command: /^prueba3$/i,
  owner: true,
  async handler(m, args) { await prueba3(m, args) }
}

export const handler4 = {
  command: /^prueba4$/i,
  owner: true,
  async handler(m, args) { await prueba4(m, args) }
}

export const handler5 = {
  command: /^prueba5$/i,
  owner: true,
  async handler(m, args) { await prueba5(m, args) }
}

export const handler6 = {
  command: /^prueba6$/i,
  owner: true,
  async handler(m, args) { await prueba6(m, args) }
}

export const handler7 = {
  command: /^prueba7$/i,
  owner: true,
  async handler(m, args) { await prueba7(m, args) }
}