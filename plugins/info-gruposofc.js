import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const handler = async (m, { conn }) => {
  const texto = `✨ Pulsa el botón para unirte o visitar nuestros espacios oficiales`.trim()

  const buttons = [
    {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: '✐ Canal oficial',
        url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m',
        merchant_url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
      })
    },
    {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: '🧩 Grupo oficial',
        url: 'https://chat.whatsapp.com/EYaNj7Ed29M9dyXJP0UiBX',
        merchant_url: 'https://chat.whatsapp.com/EYaNj7Ed29M9dyXJP0UiBX'
      })
    },
    {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: '💻 Repositorio GitHub',
        url: 'https://github.com/Deylin-Eliac/kirito-bot-MD',
        merchant_url: 'https://github.com/Deylin-Eliac/kirito-bot-MD'
      })
    }
  ]

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Pikachu Bot by Deylin' }),
          header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons
          })
        })
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, messageContent, {
    userJid: m.sender,
    quoted: m
  })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['grupos'];
handler.tags = ['info'];
handler.command = ['grupos', 'links', 'groups'];

export default handler;