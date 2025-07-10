import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';

  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Hola mucho gusto, soy Deylin 👑';
  const empresa = 'Servicios Tecnológicos';

  const imageUrl = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';
  

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
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

  // Enviar la vCard
  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: name,
        contacts: [{ vcard }]
      }
    },
    { quoted: m }
  );

  
  await m.react('👑');
  await m.react('✨');

  
  await conn.sendMessage(m.chat, {
    text: `👋 Hola, soy *${name}*, el creador del bot.\n\n📢 ¡Gracias por usar nuestro servicio!`,
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