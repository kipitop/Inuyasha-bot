import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? await import('terminal-image').then(m => m.default) : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
    let senderNumber = '+' + m.sender.replace('@s.whatsapp.net', '');
    let senderPhone = PhoneNumber(senderNumber).getNumber('international');
    let senderName = await conn.getName(m.sender).catch(_ => '');
    let mePhone = PhoneNumber('+' + (conn.user?.jid || '').replace('@s.whatsapp.net', '')).getNumber('international');
    let meName = conn.user?.name || 'Bot';
    let chatName = await conn.getName(m.chat).catch(_ => '');
    let isGroup = m.isGroup;
    let isCommand = m.isCommand;

    // Fecha y hora
    let date = new Date();
    let time = date.toLocaleTimeString('es-CO', { hour12: false });

    // Tamaño estimado del mensaje
    let filesize = (
        m.msg?.vcard?.length ||
        m.msg?.fileLength?.low ||
        m.msg?.fileLength ||
        m.msg?.axolotlSenderKeyDistributionMessage?.length ||
        m.text?.length ||
        0
    );

    // Formato de tamaño legible
    const humanFileSize = (size) => {
        if (size === 0) return '0 B';
        const i = Math.floor(Math.log(size) / Math.log(1024));
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        return (size / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };

    // Imagen si hay
    let img;
    if (global.opts['img'] && /sticker|image/i.test(m.mtype)) {
        try {
            img = await terminalImage.buffer(await m.download());
        } catch (e) {
            console.error(chalk.redBright('Error al cargar imagen:'), e);
        }
    }

    // Mostrar encabezado
    console.log(chalk.bold.cyan('\n╭─[ NUEVO MENSAJE ]──────────────────────────'));
    console.log(chalk.cyanBright(`│ 🕒 Hora: ${time}`));
    console.log(chalk.cyanBright(`│ 💬 Tipo: ${chalk.yellowBright((m.mtype || '').replace(/message$/i, '').toUpperCase())}`));
    console.log(chalk.cyanBright(`│ 👤 De: ${chalk.greenBright(senderPhone)} ~ ${chalk.white(senderName)}`));
    if (isGroup) console.log(chalk.cyanBright(`│ 👥 Grupo: ${chalk.white(chatName)}`));
    else console.log(chalk.cyanBright(`│ 📥 Chat Privado: ${chalk.white(chatName)}`));
    console.log(chalk.cyanBright(`│ 📦 Tamaño: ${chalk.white(humanFileSize(filesize))}`));
    if (isCommand) console.log(chalk.cyanBright(`│ ⚙️ Comando detectado`));
    if (m.exp) console.log(chalk.cyanBright(`│ 📈 EXP: ${chalk.white(m.exp)}`));
    if (global.db?.data?.users?.[m.sender]) {
        let u = global.db.data.users[m.sender];
        console.log(chalk.cyanBright(`│ 🧍 Nivel: ${u.level || 0} | Exp: ${u.exp} | Límite: ${u.limit}`));
    }
    if (m.messageStubType) console.log(chalk.cyanBright(`│ 🧾 Stub: ${m.messageStubType}`));
    if (m.messageStubParameters) {
        let decoded = m.messageStubParameters.map(jid => {
            let dJid = conn.decodeJid(jid);
            let name = conn.getName(dJid);
            return chalk.gray(`${PhoneNumber('+' + dJid.replace('@s.whatsapp.net', '')).getNumber('international')} (${name})`);
        });
        console.log(chalk.cyanBright(`│ 🔗 Participantes: ${decoded.join(', ')}`));
    }

    // Pie
    console.log(chalk.bold.cyan('╰────────────────────────────────────────────\n'));

    // Imagen si está disponible
    if (img) console.log(img.trimEnd());

    // Mostrar texto del mensaje, si es string
    if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '');
        const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
        const mdFormat = (depth = 4) => (_, type, text, monospace) => {
            let types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
            text = text || monospace;
            return !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
        };

        if (log.length < 4096) {
            log = log.replace(urlRegex, url => chalk.blueBright(url));
        }

        log = log.replace(mdRegex, mdFormat());

        if (m.mentionedJid) {
            for (let user of m.mentionedJid) {
                let mentionName = await conn.getName(user).catch(_ => user.split('@')[0]);
                log = log.replace('@' + user.split('@')[0], chalk.blueBright('@' + mentionName));
            }
        }

        console.log(m.error != null ? chalk.red(log) : isCommand ? chalk.yellow(log) : log);
    }

    // Archivos multimedia o adjuntos
    if (/document/i.test(m.mtype)) console.log(`🗂️ Archivo: ${m.msg?.fileName || m.msg?.displayName || 'Documento'}`);
    else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 Contactos adjuntos`);
    else if (/contact/i.test(m.mtype)) console.log(`👤 Contacto: ${m.msg?.displayName || ''}`);
    else if (/audio/i.test(m.mtype)) {
        const duration = m.msg?.seconds || 0;
        console.log(`${m.msg?.ptt ? '🎤 (PTT)' : '🎵 (Audio)'} Duración: ${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`);
    }

    console.log(); // espacio final
}

// Hot reload para desarrollo
let file = global.__filename(import.meta.url);
watchFile(file, () => {
    console.log(chalk.redBright(`⚠️ Se actualizó 'lib/print.js'`));
});