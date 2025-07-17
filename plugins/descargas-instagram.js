import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m, rcanal);
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', `
┏━━━━━━━━━━━━━━━━━⌬
┃ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ғʀᴏᴍ ɪɴsᴛᴀɢʀᴀᴍ
┣━━━━━━━━━━━━━━━━━━━━⌬
┃ *Contenido descargado de Instagram*
┃ *Tipo:* ${media.type || 'Desconocido'}
┃ *URL:* ${args[0]}
┃ *Bot:* 
┃ *Canal:* wa.me/XXX (ajusta el link)
┗━━━━━━━━━━━━━━━━━━━━━━⬣
`, m, rcanal);
      await m.react(done);
    }
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${msm} Ocurrió un error.`, m);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;