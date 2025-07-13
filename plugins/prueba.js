let handler = async (m, { conn }) => {
  try {
    const grupoOficial = 'https://chat.whatsapp.com/GPbAHdod8e1AxZYmZHdFSI';
    const canalOficial = 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o';
    const imagen = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';

    await conn.sendMessage(m.chat, {
      image: { url: imagen },
      caption: `*🌐 ¡ÚNETE A NUESTROS ESPACIOS OFICIALES!*

👥 *Grupo oficial de Kirito-Bot MD*
${grupoOficial}

📢 *Canal oficial de novedades*
${canalOficial}

🔄 Aquí publicamos noticias, comandos nuevos y bots en desarrollo.

👑 *By Deylin - Kirito-Bot MD*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: 'Únete al grupo oficial del bot',
          body: 'Noticias, comandos y soporte en tiempo real',
          thumbnailUrl: imagen,
          sourceUrl: grupoOficial,
          mediaType: 2,
          renderLargerThumbnail: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363302872055226@newsletter.whatsapp.net' // <- Aquí va el ID real del canal
        }
      }
    }, { quoted: m });
  } catch (e) {
    conn.reply(m.chat, `❌ Error enviando enlace del canal: ${e.message}`, m);
  }
};

handler.help = ['canal'];
handler.tags = ['info'];
handler.command = ['canal'];
handler.register = true;

export default handler;