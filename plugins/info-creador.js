import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  m.react('👑');
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';

  const name = await conn.getName(ownerJid) || 'BrayanOFC';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || ' Hola mucho gusto soy Deylin 👑';
  const empresa = 'Servicios Tecnológicos';

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
END:VCARD
  `.trim();


  await conn.sendMessage(
    m.chat,
    { contacts: { displayName: name, contacts: [{ vcard }] } },
    { quoted: fkontak }
  );
}



handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;