import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Debes proporcionar un enlace de YouTube.*`, m);
  }

  const url = args[0];
  const apiUrl = `https://mode-api-sigma.vercel.app/api/mp4?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.video?.download?.url) {
      throw new Error('❌ No se pudo obtener el video.');
    }

    const info = json.video;
    const media = info.download;

    const caption = `
🎬 *Título:* ${info.title}
👤 *Autor:* ${info.author}
📁 *Tipo:* ${media.extension.toUpperCase()}
🎚️ *Calidad:* ${media.quality}
📦 *Tamaño:* ${media.size}
🔗 *Enlace:* ${url}`.trim();

    // Enviar miniatura con info
    await conn.sendMessage(
      m.chat,
      {
        image: { url: info.image_max_resolution || info.image },
        caption,
      },
      { quoted: m }
    );

    // Enviar video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: media.url },
        mimetype: 'video/mp4',
        fileName: media.filename || `${info.title}.mp4`,
        caption: "✅ *Descarga completa.*"
      },
      { quoted: m }
    );

  } catch (e) {
    console.error('❌ Error al procesar video:', e);
    conn.reply(
      m.chat,
      `⚠️ *No se pudo descargar el video.*\nEs posible que el video sea privado, el enlace esté roto o no sea compatible.`,
      m
    );
  }
};

handler.help = ['ytmp4 <url>', 'play2 <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'play2'];

export default handler;