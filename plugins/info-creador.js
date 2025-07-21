import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  m.react('👑');
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';

          const res = await fetch('https://files.catbox.moe/p0ibbd.jpg');
      

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '𝗔𝗨𝗧𝗢 𝗗𝗘𝗧𝗘𝗖𝗧 𝗞𝗜𝗥𝗜𝗧𝗢',
        jpegThumbnail: res
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || ' Servicios técnicos de software para WhatsApp';
  const empresa = ' Servicios Tecnológicos';


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
    { quoted: m }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;