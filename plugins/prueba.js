let handler = async (m, { conn }) => {
  const grupoOficial = 'https://chat.whatsapp.com/GPbAHdod8e1AxZYmZHdFSI';
  const canalOficial = 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o';
  const imagen = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';

  await conn.sendMessage(m.chat, {
    image: { url: imagen },
    caption: `🌐 *ÚNETE A NUESTROS ESPACIOS OFICIALES:*

👥 *Grupo oficial de Kirito-Bot*
${grupoOficial}

📢 *Canal de novedades*
${canalOficial}

👑 *By Deylin - Kirito-Bot MD*`,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: 'Únete al grupo oficial del bot',
        body: 'Comunidad, noticias y comandos nuevos',
        thumbnailUrl: imagen,
        sourceUrl: grupoOficial,
        mediaType: 2,
        renderLargerThumbnail: true
      },
      // ✅ "Ver canal" requiere esto:
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363302872055226@newsletter.whatsapp.net', // <-- Usa el ID real de tu canal
        newsletterName: 'Kirito-Bot MD Channel', // opcional, nombre visible
        serverMessageId: '' // puede omitirse
      }
    }
  }, { quoted: m });
};

handler.help = ['canal'];
handler.tags = ['info'];
handler.command = ['canal'];
handler.register = true;

export default handler;