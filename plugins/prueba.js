import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const previewURL = 'https://kirito-bot.vercel.app'; // página con preview habilitado (título/imagen)
  const sharedText = `🌟 Prueba Kirito-Bot, el mejor bot para grupos.\n${previewURL}`;

  // Primero, enviar el texto con URL para que WhatsApp genere el preview
  await conn.sendMessage(m.chat, {
    text: sharedText
  });

  // Luego, enviar el botón real de compartir (nativo)
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '¿Te gusta chatear con Kirito-Bot?\n¡Compártelo con tus amigos!'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Kirito-Bot by Deylin'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'share',
                buttonParamsJson: JSON.stringify({
                  display_text: '📤 Compartir Kirito-Bot',
                  content: {
                    body: sharedText
                  }
                })
              }
            ]
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = ['compartir', 'invitar'];
export default handler;