let handler = async (m, { conn }) => {
  const grupoOficial = 'https://chat.whatsapp.com/GPbAHdod8e1AxZYmZHdFSI';
  const canalOficial = channel;
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
      
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363302872055226@newsletter.whatsapp.net', 
        newsletterName: 'Kirito-Bot MD Channel', 
        serverMessageId: '' 
      }
    }
  }, { quoted: m });
};

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler