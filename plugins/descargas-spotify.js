import fetch from 'node-fetch';

const handler = async (m, { args, conn, command, prefix }) => {
  if (!args[0]) {
    return m.reply(`📌 Ejemplo de uso:\n${(prefix || '.') + command} nina feast`);
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: '⏱',
      key: m.key,
    },
  });

  const query = encodeURIComponent(args.join(' '));
  const url = `https://zenz.biz.id/search/spotify?query=${query}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.status || !json.result || json.result.length === 0) {
      return m.reply('❌ No encontré la canción que estás buscando.');
    }

    const data = json.result[0];

    const caption = `🎵 *Título:* ${data.title}
🎤 *Artista:* ${data.artist}
💿 *Álbum:* ${data.album}
🔗 *Enlace:* ${data.url}`;

    await conn.sendMessage(m.chat, {
      image: { url: data.cover },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key,
      },
    });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al buscar la canción.');
  }
};

handler.help = ['sspotify <nombre de la canción>'];
handler.tags = ['busqueda'];
handler.command = ['spotify'];

export default handler;