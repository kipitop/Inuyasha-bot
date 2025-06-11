let handler = async (m, { conn }) => {
    try {
        const sent = await conn.sendMessage(m.chat, { text: `🔄 Reiniciando...` }, { quoted: m });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `🔄 Reiniciando... 🔁` }, { edit: sent.key });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `🔄 Reiniciando... 🔁🔁` }, { edit: sent.key });

        await delay(1000);
        await conn.sendMessage(m.chat, {
            text: `╰⊱🌩⊱ *REINICIANDO* ⊱🌩⊱╮\n🕒 Ya estaré de regreso...`,
        }, { edit: sent.key });

        console.log('[RESTART] Reinicio del bot solicitado por el propietario.');
        setTimeout(() => process.exit(0), 1000);

    } catch (error) {
        console.error('[ERROR][REINICIO]', error);
        await conn.reply(m.chat, `❌ Error al intentar reiniciar el bot:\n\n${error.message || error}`, m);
    }
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restart', 'reiniciar'];
handler.rowner = true;

export default handler;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));