let handler = async (m, { conn }) => {
  const grupoOficial = 'https://chat.whatsapp.com/EYaNj7Ed29M9dyXJP0UiBX';
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
    footer: 'Haz clic en un botón para unirte',
    buttons: [
      { buttonId: grupoOficial, buttonText: { displayText: '🧩 Unirse al Grupo' }, type: 1 },
      { buttonId: canalOficial, buttonText: { displayText: '📢 Ver Canal' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });
};

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler;