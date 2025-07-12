import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const mensaje = {
    text: '¿Te gusta chatear con Kirito-Bot?\n¡Compártelo con tus amigos!',
    footer: '',
    buttons: [
      {
        index: 1,
        urlButton: {
          displayText: '📤 Compartir Kirito-Bot',
          url: 'https://wa.me/1234567890' // reemplaza con tu link de invitación o canal
        }
      }
    ],
    headerType: 1
  }

  const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: mensaje.text,
        hydratedButtons: mensaje.buttons,
        hydratedFooterText: mensaje.footer
      }
    }
  }), { userJid: m.sender });

  await conn.relayMessage(m.chat, template.message, { messageId: template.key.id });
};

handler.command = ['compartir', 'invitar'];
export default handler;