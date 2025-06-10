import { spawn } from 'child_process';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, isROwner, text }) => {
    if (!process.send) throw 'Dont: node main.js\nDo: node index.js';
    
    
    if (true) {
        const sentMsg = await conn.sendMessage(m.chat, { text: `Reiniciando...` }, { quoted: m });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `Reiniciando...` }, { quoted: m });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `Aguarde unos segundos más... 🔁` }, { quoted: m });

        await delay(1000);
        await conn.sendMessage(m.chat, {
            text: `𝑹𝒆𝒊𝒏𝒊𝒄𝒊𝒐 𝑪𝒐𝒎𝒑𝒍𝒆𝒕𝒐 ☄︎`
        }, { quoted: m });

        process.send('reset');
    } else throw 'eh';
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restart', 'reiniciar'];
handler.rowner = true;

export default handler;