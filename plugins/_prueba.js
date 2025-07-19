const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { 
    text: 'Uso correcto del comando:',
    buttons: [
      {
        buttonId: 'servicios',
        buttonText: { displayText: 'CREADOR' },
      },
      {
        buttonId: 'contacto',
        buttonText: { displayText: 'MENU' },
      },
      {
        buttonId: 'contacto',
        buttonText: { displayText: 'PAN 🍞' },
      },
       ],
    footer: botname,
    viewOnce: true,
  }, { quoted: m });
};

handler.tags = ['tools'];
handler.help = ['webinfo'];
handler.command = ['prueba'];

export default handler;