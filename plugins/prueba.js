import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '¿Te gusta chatear con Kirito-Bot? ¡Compártelo con tus amigos!'
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
                  display_text: '📤 Compartir Kirito-Bot'
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