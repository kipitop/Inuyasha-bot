let handler = async (m, { conn }) => {
  global.subbotBanners = global.subbotBanners || {};
  global.defaultBanner = global.defaultBanner || 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';

 
  const banner = global.subbotBanners[m.sender] || global.defaultBanner;

  await conn.sendFile(m.chat, media, 'banner.jpg', '✅ Banner actualizado solo para este subbot.', m);
};

handler.help = ['canal'];
handler.tags = ['info'];
handler.command = ['canal'];
handler.register = true;

export default handler;