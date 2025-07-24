// editado y reestructurado por 
// https://github.com/deylin-eliac 

import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno de la lista disponible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    const response = await axios.request(config);
    if (response.data?.success) {
      const { id, title, info } = response.data;
      const downloadUrl = await ddownr.cekProgress(id);
      return { id, title, image: info.image, downloadUrl };
    } else {
      throw new Error("⛔ No se pudo obtener los detalles del video.");
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { "User-Agent": "Mozilla/5.0" }
    };

    while (true) {
      const response = await axios.request(config);
      if (response.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};


const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  await m.react('🌟');
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, " Ingresa el nombre o link del video que deseas buscar.", m);
    }
const isAudio = ["play", "yta", "ytmp3"].includes(command);
    const isVideo = ["play2", "ytv", "ytmp4"].includes(command);

    const tip = ["play", "yta", "ytmp"].includes(command) ? "𝗔𝗨𝗗𝗜𝗢 ♫" : "𝗩𝗜𝗗𝗘𝗢 ꗈ";

          const res2 = await fetch('https://files.catbox.moe/qzp733.jpg');
      const thumb2 = await res2.buffer();

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: `𝗣𝗟𝗔𝗬 ✦ ${tip} `,
        jpegThumbnail: thumb2
      }
    },
    participant: "0@s.whatsapp.net"
  };


    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados para tu búsqueda.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const tipo = ["play", "yta", "ytmp"].includes(command) ? "ᴀᴜᴅɪᴏ ♫" : "ᴠɪᴅᴇᴏ ꗈ";
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
┃ *ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ғʀᴏᴍ ʏᴏᴜᴛᴜʙᴇ*
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
┃ *Título:* ${title}
┃ *Duración:* ${timestamp}
┃ *Vistas:* ${vistas}
┃ *Canal:* ${(videoInfo.author?.name) || "Desconocido"}
┃ *Publicado:* ${ago}
┃ *Enlace:* ${url}
┃ *ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ${tipo}*
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "𝐊𝐢𝐫𝐢𝐭𝐨 ☆ 𝐁𝐨𝐭 𝐌𝐃",
          body: "𝑬𝒍 𝒎𝒆𝒋𝒐𝒓 𝑩𝒐𝒕 𝒅𝒆 𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await m.react('👑');
    await conn.reply(m.chat, infoMessage, fkontak, JT);

    // ↓↓↓ AUDIO
    if (isAudio) {
      const api = await ddownr.download(url, "mp3");
      return await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
      }, { quoted: m });
    }

    // ↓↓↓ VIDEO
    if (isVideo) {
  const apiUrl = `https://mode-api-sigma.vercel.app/api/mp4?url=${encodeURIComponent(url)}`;
  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const json = await res.json();

  if (!json.status || !json.video?.download?.url) {
    throw new Error("❌ No se pudo descargar el contenido.");
  }

  const info = json.video;
  const media = info.download;
  const caption = `🎬 *${info.title}*
📺 *Autor:* ${info.author}
📁 *Calidad:* ${media.quality}
📦 *Tamaño:* ${media.size}
🔗 *Enlace:* ${url}`;

  await conn.sendMessage(m.chat, {
    video: { url: media.url },
    mimetype: 'video/mp4',
    fileName: media.filename || `${info.title}.mp4`,
    caption
  }, { quoted: m });
}

  } catch (error) {
    console.error("❌ Error:", error);
    return m.reply(`⚠️ Ocurrió un error eléctrico: ${error.message}`);
  }
};

handler.command = handler.help = ["play", "play2", "ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];
handler.register = true;

export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}