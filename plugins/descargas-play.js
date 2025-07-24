import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Debes proporcionar un enlace de YouTube válido.*`, m);
  }

  const url = args[0];
  const apiUrl = `https://mode-api-sigma.vercel.app/api/mp4?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const json = await res.json();

    // 🔍 Enviar respuesta de la API al chat como texto formateado
    await conn.sendMessage(m.chat, {
      text: `📦 *Respuesta de la API:*\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``,
    }, { quoted: m });

    // ✅ Validar que la API respondió correctamente
    if (!json.status || !json.video || !json.video.download || !json.video.download.url) {
      throw new Error('❌ La API no devolvió un enlace válido de descarga.');
    }

    const info = json.video;
    const media = info.download;

    // 📝 Texto descriptivo
    const caption = `
🎬 *Título:* ${info.title}
👤 *Autor:* ${info.author}
📁 *Tipo:* ${media.extension.toUpperCase()}
🎚️ *Calidad:* ${media.quality}
📦 *Tamaño:* ${media.size}
🔗 *Enlace:* ${url}`.trim();

    // 📸 Enviar imagen miniatura
    await conn.sendMessage(
      m.chat,
      {
        image: { url: info.image_max_resolution || info.image },
        caption,
      },
      { quoted: m }
    );

    // 📥 Enviar video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: media.url },
        mimetype: 'video/mp4',
        fileName: media.filename || `${info.title}.mp4`,
        caption: "✅ *Descarga completada.*"
      },
      { quoted: m }
    );

  } catch (e) {
    console.error('❌ Error al procesar video:', e);
    conn.reply(
      m.chat,
      `⚠️ *No se pudo descargar el video.*\nEs posible que el video esté roto, sea privado o no sea compatible.\n\n📄 *Error técnico:* ${e.message}`,
      m
    );
  }
};

handler.help = ['ytmp4 <url>', 'play2 <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'play2'];

export default handler;