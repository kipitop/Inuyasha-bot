/*import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🔎');
        conn.sendPresenceUpdate('composing', m.chat);

        const filesToCheck = ['./plugins', './handler.js'];
        let response = `🛡️ *Análisis de Plugins y Handler (Vulnerabilidades, Lags y Malas Prácticas):*\n\n`;
        let problemas = false;

        const patrones = [
            { regex: /eval\s*/, mensaje: '⚠️ Uso inseguro de `eval()`' },
            { regex: /new Function\s*/, mensaje: '⚠️ Uso inseguro de `new Function()`' },
            { regex: /fs\.readFileSync/, mensaje: '⚠️ Lectura síncrona de archivos: posible lag' },
            { regex: /fs\.writeFileSync/, mensaje: '⚠️ Escritura síncrona de archivos: posible lag' },
            { regex: /\.forEach\s*[\w\s,]*async/, mensaje: '⚠️ `async` dentro de `forEach`: puede causar bugs o lag' },
            { regex: /setTimeout\s*\s*async/, mensaje: '⚠️ `async` dentro de `setTimeout`: cuidado con el manejo de errores' },
            { regex: /while\s*true/, mensaje: '⚠️ Bucle infinito detectado (`while(true)`) — riesgo de cuelgue' },
        ];

        for (const fileOrDir of filesToCheck) {
            const isDir = fs.existsSync(fileOrDir) && fs.lstatSync(fileOrDir).isDirectory();

            let files = [];
            if (isDir) {
                files = fs.readdirSync(fileOrDir)
                    .filter(f => f.endsWith('.js'))
                    .map(f => path.resolve(fileOrDir, f));
            } else if (fs.existsSync(fileOrDir)) {
                files = [path.resolve(fileOrDir)];
            }

            for (const filePath of files) {
                const code = fs.readFileSync(filePath, 'utf-8');
                const lines = code.split('\n');
                let hallazgos = [];

                for (let i = 0; i < lines.length; i++) {
                    for (const { regex, mensaje } of patrones) {
                        if (regex.test(lines[i])) {
                            hallazgos.push(`- ${mensaje}\n  🧾 Línea ${i + 1}: \`${lines[i].trim()}\``);
                            problemas = true;
                        }
                    }
                }

                if (hallazgos.length > 0) {
                    response += `📁 *${path.basename(filePath)}*\n${hallazgos.join('\n')}\n\n`;
                }
            }
        }

        if (!problemas) {
            response += '✅ No se encontraron vulnerabilidades ni malas prácticas en los archivos.';
        }

        await conn.reply(m.chat, response, m, rcanal);
        await m.react('🛠️');
    } catch (err) {
        console.error(err);
        await m.react('✖️');
        conn.reply(m.chat, '🚩 *Fallo al analizar los plugins.*', m, rcanal);
    }
};

handler.command = ['xhtm'];
handler.help = ['inspeccionar'];
handler.tags = ['tools'];
handler.register = true;

export default handler;*/



const partidas = {};

const EMOJI_TITULAR = '❤️';
const EMOJI_SUPLENTE = '👍';
const MAX_TITULARES = 4;
const MAX_SUPLENTES = 2;

function generarMensaje(titulares, suplentes) {
    const t = titulares.map((u, i) => `${i === 0 ? '👑' : '🥷🏻'} ┇ @${u.split('@')[0]}`);
    const s = suplentes.map(u => `🥷🏻 ┇ @${u.split('@')[0]}`);

    while (t.length < MAX_TITULARES) t.push('🥷🏻 ┇');
    while (s.length < MAX_SUPLENTES) s.push('🥷🏻 ┇');

    return `
╭──────⚔──────╮
           4 𝐕𝐄𝐑𝐒𝐔𝐒 4 
              *COMPE*
╰──────⚔──────╯

𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

${t.join('\n')}

ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
${s.join('\n')}

*Reacciona con:*
❤️ para titular
👍 para suplente`.trim();
}

// Comando .compe
const handler = async (m, { conn }) => {
    if (!m.isGroup) throw 'Este comando solo funciona en grupos.';

    const chat = m.chat;
    partidas[chat] = {
        titulares: [],
        suplentes: [],
        finalizado: false,
        msgId: null,
        msgKey: null
    };

    const texto = generarMensaje([], []);
    const enviado = await conn.sendMessage(chat, { text: texto });

    partidas[chat].msgId = enviado.key.id;
    partidas[chat].msgKey = enviado.key;
};

handler.help = ['compe'];
handler.tags = ['group'];
handler.command = ['compe'];
handler.group = true;

export default handler;

// Middleware de reacciones (funciona como before.js o listener global)
export async function before(m, { conn }) {
    if (!m.isGroup || !m.messageStubType) return;

    const chat = m.key.remoteJid;
    const id = m.key.id;
    const emoji = m.messageStubParameters?.[0];
    const user = m.participant;

    const partida = partidas[chat];
    if (!partida || partida.msgId !== id || partida.finalizado) return;
    if (!emoji || (emoji !== EMOJI_TITULAR && emoji !== EMOJI_SUPLENTE)) return;

    const yaEnLista = partida.titulares.includes(user) || partida.suplentes.includes(user);
    if (yaEnLista) return;

    if (emoji === EMOJI_TITULAR && partida.titulares.length < MAX_TITULARES) {
        partida.titulares.push(user);
    } else if (emoji === EMOJI_SUPLENTE && partida.suplentes.length < MAX_SUPLENTES) {
        partida.suplentes.push(user);
    } else {
        return; // No se puede agregar más
    }

    const completo = partida.titulares.length === MAX_TITULARES && partida.suplentes.length === MAX_SUPLENTES;
    if (completo) {
        partida.finalizado = true;
        return; // No se borra ni se manda nuevo mensaje
    }

    // Borrar mensaje anterior
    await conn.sendMessage(chat, { delete: partida.msgKey });

    const texto = generarMensaje(partida.titulares, partida.suplentes);
    const enviado = await conn.sendMessage(chat, {
        text: texto,
        mentions: [...partida.titulares, ...partida.suplentes]
    });

    partida.msgId = enviado.key.id;
    partida.msgKey = enviado.key;
}