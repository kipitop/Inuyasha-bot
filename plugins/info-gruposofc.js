let handler = async (m, { conn }) => {
  const grupoOficial = 'https://chat.whatsapp.com/EYaNj7Ed29M9dyXJP0UiBX';
  const canalOficial = 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o';
  const imagen = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';

  // Preparar la imagen para enviar
  const imageMessage = await conn.prepareMessageMedia({ image: { url: imagen } });

  const templateButtons = [
    {
      urlButton: {
        displayText: '🧩 Unirse al Grupo',
        url: grupoOficial
      }
    },
    {
      urlButton: {
        displayText: '📢 Ver Canal',
        url: canalOficial
      }
    }
  ];

  const templateMessage = {
    ...imageMessage,
    templateMessage: {
      hydratedTemplate: {
        imageMessage: imageMessage.imageMessage,
        hydratedContentText: `🌐 *ÚNETE A NUESTROS ESPACIOS OFICIALES:*\n\n👥 *Grupo oficial de Kirito-Bot*\n${grupoOficial}\n\n📢 *Canal de novedades*\n${canalOficial}\n\n👑 *By Deylin - Kirito-Bot MD*`,
        hydratedFooterText: 'Haz clic en un botón para abrir el enlace',
        hydratedButtons: templateButtons
      }
    }
  };

  await conn.sendMessage(m.chat, templateMessage, { quoted: m });
};

handler.help = ['grupos'];
handler.tags = ['info'];
handler.command = ['grupos', 'links', 'groups'];

export default handler;