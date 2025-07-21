import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';


          const res = await fetch('https://files.catbox.moe/p0ibbd.jpg');
      const thumb = await res.buffer();

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '𝗖𝗥𝗘𝗔𝗗𝗢𝗥 ◉‿◉',
        jpegThumbnail: thumb
      }
    },
    participant: "0@s.whatsapp.net"
  }

  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Hola mucho gusto, soy Deylin 👑';
  const empresa = 'Servicios Tecnológicos';

  const imageUrl = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';
  
await m.react('👑');
  await m.react('✨');

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

  
  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: name,
        contacts: [{ vcard }]
      }
    },
    { quoted: fkontak }
  );

 
  
  
handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;