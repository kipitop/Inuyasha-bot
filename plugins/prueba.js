import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: '¿Te gusta chatear con Kirito-Bot?\n¡Compártelo con tus amigos!',
        hydratedFooterText: '', // Puedes poner algo si quieres
        hydratedButtons: [
          {
            urlButton: {
              displayText: '📤 Compartir Kirito-Bot',
              url: 'https://wa.me/1234567890' // Reemplaza con tu link real
            }
          }
        ]
      }
    }
  }), { userJid: m.sender });

  await conn.relayMessage(m.chat, template.message, { messageId: template.key.id });
};

handler.command = ['compartir', 'invitar'];
export default handler;