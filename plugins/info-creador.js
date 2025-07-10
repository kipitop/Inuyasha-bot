// Código creado por Deylin
// https://github.com/Deylin-eliac 
// Código creado para https://github.com/Deylin-eliac/Pikachu-bot 
// No quites créditos

import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  m.react('🧃');

  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';
  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || `Hola, mucho gusto. Soy Deylin.`;
  const empresa = 'Deylin - Servicios Tecnológicos';

  // Obtener imagen de perfil del creador
  const pp = await conn.profilePictureUrl(ownerJid, 'image').catch(() => null);
  const thumbnail = pp ? await (await fetch(pp)).buffer() : null;

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-ABLabel:Dirección Web
X-ABLabel:Correo Electrónico
X-ABLabel:Teléfono de contacto
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: name,
        contacts: [{ vcard }]
      },
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: 'Deylin creador de kirito',              
          serverMessageId: -1,
        },
        externalAdReply: {
          title: 'Pikachu-Bot Oficial',
          body: 'Desarrollado por Deylin',
          sourceUrl: redes,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true,
          jpegThumbnail: thumbnail 
        },
      }
    },
    { quoted: m }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;


