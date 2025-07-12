import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const mensaje = proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: '¿Te gusta chatear con Kirito-Bot?\n¡Compártelo con tus amigos!',
        hydratedFooterText: 'Powered by Kirito-Bot',
        hydratedButtons: [
          {
            urlButton: {
              displayText: '📤 Compartir Kirito-Bot',
              url: 'https://wa.me/1234567890' // Reemplázalo por tu link real
            }
          }
        ]
      }
    }
  });

  const msg = generateWAMessageFromContent(
    m.chat,
    mensaje,
    {
      userJid: m.sender,
      quoted: m
    }
  );

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = ['compartir', 'invitar'];
export default handler;