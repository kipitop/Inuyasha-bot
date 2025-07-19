import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';
import fs from 'fs/promises'; // Se usa lectura asíncrona

const moneda = 'llamas'; 
const creador = `${dev}`; 

const loadMarriages = async () => {
    try {
        const content = await fs.readFile('./src/database/marry.json', 'utf-8');
        const data = JSON.parse(content);
        global.db.data.marriages = data;
    } catch (e) {
        console.error('❌ Error al leer marry.json:', e);
        global.db.data.marriages = {};
    }
};

let handler = async (m, { conn, args }) => {
    try {
        await loadMarriages();

        let userId;
        if (m.quoted?.sender) {
            userId = m.quoted.sender;
        } else if (m.mentionedJid?.[0]) {
            userId = m.mentionedJid[0];
        } else {
            userId = m.sender;
        }

        let user = global.db.data.users?.[userId];
        if (!user) {
            return m.reply('⚠️ Este usuario no tiene datos aún.');
        }

        let name = await conn.getName(userId);
        let cumpleanos = user.birth || 'No especificado';
        let genero = user.genre || 'No especificado';
        let description = user.description || 'Sin descripción';
        let exp = user.exp || 0;
        let nivel = user.level || 0;
        let role = user.role || 'Esclavo';
        let llamas = user.llama || 0;
        let bankllamas = user.bank || 0;

        let perfil = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://files.catbox.moe/giuw0s.jpg');

        let isMarried = userId in global.db.data.marriages;
        let partnerId = isMarried ? global.db.data.marriages[userId] : null;
        let partnerName = partnerId ? await conn.getName(partnerId) : 'Nadie';

        let profileText = `
┏╍╍╍⌬ *Perfil de:* @${userId.split('@')[0]}
┃ ${description}
┃ ╭╾ɪɴғᴏ ᴅᴇʟ ᴜsᴇʀ
┃ ├ *Edad* » ${user.age || 'Desconocida'}
┃ ├ *Cumpleaños* » ${cumpleanos}
┃ ├ *Género* » ${genero}
┃ ╰ *Casado con* » ${isMarried ? partnerName : 'Nadie'}
┃ ╭╾ɴɪᴠᴇʟ
┃ ├ *Experiencia* » ${exp.toLocaleString()}
┃ ├ *Nivel* » ${nivel}
┃ ╰ *Rango* » ${role}
┃ ╭╾ʀᴇᴄᴜʀsᴏs
┃ ├ *llamas Cartera* » ${llamas.toLocaleString()} ${moneda}
┃ ├ *llamas Banco* » ${bankllamas.toLocaleString()} ${moneda}
┃ ╰ *Premium* » ${user.premium ? '✅' : '❌'}
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
        `.trim();

        await conn.sendMessage(m.chat, {
  image: { url: perfil },
  caption: profileText,
      footer: `${botname} el mejor bot de WhatsApp`,
        buttons: [
          {
            buttonId: '/owner',
            buttonText: { displayText: `👑 CREADOR` },
            type: 1
          },
          {
            buttonId: '/menu',
            buttonText: { displayText: `✨ MENU` },
            type: 1
          }
        ],
        headerType: 4,
contextInfo: {
            mentionedJid: [userId] }
}, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('❌ Ocurrió un error al generar el perfil.');
    }
};

handler.help = ['profile', 'perfil'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];
handler.register = true;
handler.group = true;

export default handler;