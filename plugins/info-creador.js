// Código creado por Deylin
// https://github.com/Deylin-eliac 
// Codigo para Pikachu-Bot

import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
  const imageUrl = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';
  
  await m.react('✨');
  await m.react('👑');

  const creadorNombre = 'Deylin';
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || `Hola, mucho gusto. Soy Deylin.`;
  const empresa = 'Deylin - Servicios Tecnológicos';

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${creadorNombre};;;
FN:${creadorNombre}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-WA-BIZ-NAME:${creadorNombre}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

  
  await m.react('✨');
  await m.react('👑');

  

  
  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: creadorNombre,
      contacts: [{ vcard }],
    },
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      externalAdReply: {
        title: textbot,
        body: dev,
        thumbnailUrl: imageUrl,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
      },
    }
  }, { quoted: m });

  await m.react('✨');
  await m.react('👑');
  await conn.sendMessage(m.chat, {
    text: `👋 Hola, soy *${creadorNombre}*, el creador del bot.\n\n📢 ¡Gracias por usar nuestro servicio!`,
    footer: empresa,
    buttons: [
      { buttonId: '.menu', buttonText: { displayText: '📒 Menú' }, type: 1 },
      { buttonId: '.info', buttonText: { displayText: 'ℹ️ Info' }, type: 1 },
    ],
    headerType: 1,
    contextInfo: {
      externalAdReply: {
        title: textbot,
        body: 'Creado por Deylin',
        thumbnailUrl: imageUrl,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
      }
    }
  }, { quoted: m });
};

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;