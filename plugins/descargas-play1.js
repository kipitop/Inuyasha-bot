// editado y reestructurado por 
// https://github.com/deylin-eliac

import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error("⚠ Formato de audio no soportado.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    };

    const response = await axios.request(config);
    if (response.data?.success) {
      const { id, title, info } = response.data;
      const downloadUrl = await ddownr.cekProgress(id);
      return { id, title, image: info.image, downloadUrl };
    } else {
      throw new Error("⛔ No se pudo obtener el audio.");
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
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

const handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('🌟');

  if (!text.trim()) {
    return conn.reply(m.chat, "❗ Ingresa el nombre o enlace del video.", m);
  }

  const tip = ["play", "yta", "ytmp3"].includes(command) ? "𝗔𝗨𝗗𝗜𝗢 ♫" : "𝗩𝗜𝗗𝗘𝗢 ꗈ";

  const res2 = await fetch('https://files.catbox.moe/9f350v.jpg');
  const thumb2 = Buffer.from(await res2.arrayBuffer());

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: `𝗣𝗟𝗔𝗬 ✦ ${tip}`,
        jpegThumbnail: thumb2
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const search = await yts(text);
  if (!search.all.length) return m.reply("⚠ No se encontraron resultados.");

  const video = search.all[0];
  const { title, thumbnail, timestamp, views, ago, url } = video;
  const tipo = ["play", "yta", "ytmp3"].includes(command) ? "ᴀᴜᴅɪᴏ ♫" : "ᴠɪᴅᴇᴏ ꗈ";
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
        title: "𝐊𝐢𝐫𝐢𝐭𝐨 ☆ 𝐁𝐨𝐭 𝐌𝐃 ฅ՞•ﻌ•՞ฅ",
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
  await conn.reply(m.chat, infoMessage.trim(), fkontak, JT);

  if (["play", "yta", "ytmp3"].includes(command)) {
    try {
      const api = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: "audio/mpeg"
      }, { quoted: fkontak });
    } catch (e) {
      return m.reply(`⛔ Error al descargar audio: ${e.message}`);
    }
  } else if (["play2", "ytv", "ytmp4"].includes(command)) {
    try {
      const res = await fetch(`https://mode-api-sigma.vercel.app/api/mp4?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (!json?.status || !json.video?.download?.url) {
        throw new Error("⛔ No se pudo obtener el enlace MP4.");
      }

      const videoData = json.video;
      const downloadInfo = videoData.download;

      await conn.sendMessage(m.chat, {
        video: { url: downloadInfo.url },
        fileName: downloadInfo.filename || `${videoData.title}.mp4`,
        mimetype: "video/mp4",
        caption: `⚔ Video descargado por *Kirito-Bot MD* ⚔\n\n📦 *Calidad:* ${downloadInfo.quality}\n📁 *Tamaño:* ${downloadInfo.size}`,
        thumbnail: thumb
      }, { quoted: fkontak });
    } catch (e) {
      return m.reply(`❌ Error al descargar video: ${e.message}`);
    }
  } else {
    return m.reply("❌ Comando no reconocido.");
  }
};

handler.command = handler.help = ["play", "play2", "ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];
export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}