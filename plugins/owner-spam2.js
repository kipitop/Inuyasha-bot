import baileys from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = baileys;
import fetch from 'node-fetch';

const convertToFancy = (text = '') => {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //const fancy = ['𝗮','𝗯','𝗰','𝗱','𝗲','𝗳','𝗴','𝗵','𝗶','𝗷','𝗸','𝗹','𝗺','𝗻','𝗼','𝗽','𝗾','𝗿','𝘀','𝘁','𝘂','𝘃','𝘄','𝘅','𝘆','𝘇','𝗔','𝗕','𝗖','𝗗','𝗘','𝗙','𝗚','𝗛','𝗜','𝗝','𝗞','𝗟','𝗠','𝗡','𝗢','𝗣','𝗤','𝗥','𝗦','𝗧','𝗨','𝗩','𝗪','𝗫','𝗬','𝗭','𝟬','𝟭','𝟮','𝟯','𝟰','𝟱','𝟲','𝟳','𝟴','𝟵'];
  return [...text].map(l => {
    const i = normal.indexOf(l);
    return i > -1 ? fancy[i] : l;
  }).join('');
};

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text || !text.includes('|')) return m.reply(`⚠️ Usa el formato:\n\n${usedPrefix + command} <enlace>|<mensaje>|<veces>\n\nEjemplo:\n.spam2 https://chat.whatsapp.com/F4I2oTWpxiGAzRE7sFuD0N?mode=ac_t | Hola a todos | 2`);

  let [link, msg, count] = text.split('|').map(v => v.trim());
  count = Math.min(Number(count) || 1, 6); // Límite máximo

  if (!link.includes('whatsapp.com')) return m.reply('❌ Enlace inválido.');

  let code = link.split('/')[3]?.split('?')[0];
  if (!code) return m.reply('❌ Código de grupo no válido.');

  try {
    let res = await conn.groupAcceptInvite(code).catch(() => null);

    if (!res) {
      m.reply('⏳ Grupo privado, esperando aceptación del admin (máx. 10 min)...');
      let accepted = false;
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 30000)); // Esperar 30 segundos
        try {
          res = await conn.groupAcceptInvite(code).catch(() => null);
          if (res) {
            accepted = true;
            break;
          }
        } catch {}
      }
      if (!accepted) return m.reply('❌ No fue aceptado al grupo en 10 minutos.');
    }

    const jid = res;
    const fancyMsg = convertToFancy(msg);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(jid, {
        text: fancyMsg,
        contextInfo: {
          externalAdReply: {
            title: '🔥 Grupo Atacado',
            body: 'Kirito-Bot-MD',
            thumbnailUrl: 'https://telegra.ph/file/ba6a9495f48e879d6de7f.jpg',
            sourceUrl: link,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
          }
        }
      });
      await new Promise(r => setTimeout(r, 1500));
    }

    await conn.groupLeave(jid);
    await m.reply('✅ Mensajes enviados y bot salió del grupo.');

  } catch (e) {
    console.error(e);
    m.reply('❌ Hubo un error: ' + e.message);
  }
};

handler.help = ['spam2 <enlace>|<mensaje>|<veces>'];
handler.tags = ['group'];
handler.command = /^spam2$/i;
handler.private = false;
handler.limit = 2;

export default handler;