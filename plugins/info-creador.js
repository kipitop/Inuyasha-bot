import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';

 
  const res = await fetch('https://files.catbox.moe/p0ibbd.jpg');
  const thumb = await res.buffer();

  
  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: '𝗖𝗥𝗘𝗔𝗗𝗢𝗥 ◉‿◉',
        jpegThumbnail: thumb
      }
    },
    participant: '0@s.whatsapp.net'
  };

  
  const name = await conn.getName(ownerJid).catch(() => 'Deylin');
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Hola mucho gusto, soy Deylin 👑';

  
  const empresa = 'Servicios Tecnológicos';
  const email = 'correo@empresa.com';
  const web = 'https://www.tuempresa.com';
  const direccion = 'Dirección de tu empresa';

  
  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:${email}
URL:${web}
NOTE:${about}
ADR:;;${direccion};;;;
X-ABADR:ES
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

  
  await m.react('👑');
  await m.react('✨');

  
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
};

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;