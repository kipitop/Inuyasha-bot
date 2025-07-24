import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🎥 *Enlace faltant*`, m);
  }

  const url = args[0];
  const apiUrl = `https://mode-api-sigma.vercel.app/api/mp4?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.video?.download?.url) {
      throw new Error('❌ No se pudo descargar el contenido.');
    }

    const info = json.video;
    const media = info.download;

    const caption = `🎬 *Título:* ${info.title}\n👤 *Autor:* ${info.author}\n📦 *Tamaño:* ${media.size}\n🎚️ *Calidad:* ${media.quality}\n📁 *Tipo:* ${media.extension.toUpperCase()}`;

    await conn.sendMessage(m.chat, { image: { url: info.image }, caption }, { quoted: m });

    await conn.sendMessage(
      m.chat,
      {
        video: { url: media.url },
        mimetype: 'video/mp4',
        fileName: media.filename || `${info.title}.mp4`,
        caption: caption
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `⚠️ *Error al descargar el video.*\nEs posible que el enlace esté roto o el video sea privado.`, m);
  }
};

handler.help = ['ytmp4 = play2 + <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'play2'];

export default handler;
