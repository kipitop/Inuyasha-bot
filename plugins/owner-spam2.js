import baileys from '@whiskeysockets/baileys';
const { generateWAMessageFromContent } = baileys;
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.includes('|')) return m.reply(`⚠️ Usa el formato:\n\n${usedPrefix + command} <enlace>|<mensaje>|<veces>`);

  let [link, msg, count] = text.split('|').map(v => v.trim());
  count = Math.min(Number(count) || 1, 6);

  if (!link.includes('whatsapp.com')) return m.reply('❌ Enlace inválido.');

  let code = link.split('/')[3]?.split('?')[0];
  if (!code) return m.reply('❌ Código de grupo no válido.');

  let groupId;

  try {
  
    try {
      groupId = `${code}@g.us`; 
      await conn.groupMetadata(groupId);
    } catch {
      
      groupId = await conn.groupAcceptInvite(code).catch(() => null);

      if (!groupId) {
        m.reply('⏳ Grupo privado, esperando aceptación del admin (máx. 10 min)...');
        for (let i = 0; i < 20; i++) {
          await new Promise(r => setTimeout(r, 30000));
          groupId = await conn.groupAcceptInvite(code).catch(() => null);
          if (groupId) break;
        }
        if (!groupId) return m.reply('❌ No fue aceptado al grupo en 10 minutos.');
      }
    }

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(groupId, {
        text: msg,
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

    await conn.groupLeave(groupId);
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