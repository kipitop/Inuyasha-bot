import os from 'os';

let handler = async (m, { conn }) => {
    try {
        const start = Date.now();

        const info = `
╭━━〔 *↻ Reinicio del Bot ↷* 〕━━⬣
┃ ✎ *Bot:* ${conn.user.name}
┃ ✎ *JID:* ${conn.user.jid}
┃ ✎ *NodeJS:* ${process.version}
┃ ✎ *RAM:* ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
┃ ✎ *Ping:* ${Date.now() - start} ms
┃ ✎ *Fecha:* ${new Date().toLocaleString('es-PE')}
╰━━━━━━━━━━━━━━━━━━⬣
*↻* Reiniciando, espera unos segundos...
        `.trim();

        await conn.reply(m.chat, info, m);

        setTimeout(() => process.exit(0), 3000);

    } catch (error) {
        console.error('[ERROR][REINICIO]', error);
        await conn.reply(m.chat, `❌ Error al intentar reiniciar:\n${error.message || error}`, m);
    }
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restart', 'reiniciar'];
handler.rowner = true;

export default handler;