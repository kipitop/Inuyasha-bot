import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno válido.");
    }
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, title, image: info.image, downloadUrl };
      } else {
        throw new Error("⛔ No se pudo obtener los detalles del video.");
      }
    } catch (error) {
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      throw error;
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return m.reply("🎧 Ingresa el nombre de la canción o video que deseas buscar.");
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;
    const tipo = command.startsWith("play2") || command === "ytv" || command === "ytmp4" ? "ᴠɪᴅᴇᴏ 🎞" : "ᴀᴜᴅɪᴏ ♫";
    const emoji = tipo.includes("ᴠɪᴅᴇᴏ") ? "📹" : "🎧";

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
          name: `𝗣𝗟𝗔𝗬 ✦ ${tipo}`,
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

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

    await m.react(emoji);

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "Vegeta-Bot MB2.0 👑",
          body: "ᴇʟ ᴍᴇᴊᴏʀ ʙᴏᴛ ᴅᴇ ᴡʜᴀᴛsᴀᴘᴘ",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.reply(m.chat, infoMessage, fkontak, JT);

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      }, { quoted: fkontak });
    }

    if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "📥 Aquí tienes tu video descargado por,
              thumbnail: thumb
            }, { quoted: fkontak });
            break;
          }
        } catch (e) {
          console.error(`⚠ Fuente falló ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply("❌ No se pudo descargar el video desde las fuentes disponibles.");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return m.reply(`⚠ Ocurrió un error:\n${error.message}`);
  }
};

handler.command = handler.help = ["play", "play2", "yta", "ytmp3", "ytv", "ytmp4"];
handler.tags = ["downloader"];
handler.coin = 5;

export default handler;

function formatViews(views) {
  if (typeof views !== "number") return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}


  