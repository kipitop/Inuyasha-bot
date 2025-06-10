import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🔎');
        conn.sendPresenceUpdate('composing', m.chat);

        const dirs = ['./plugins'];
        let response = `🛡️ *Análisis de Plugins (Vulnerabilidades, Lags y Malas Prácticas):*\n\n`;
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

        for (const dir of dirs) {
            const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
            for (const file of files) {
                const filePath = path.resolve(dir, file);
                const code = fs.readFileSync(filePath, 'utf-8');

                let hallazgos = [];

                for (const { regex, mensaje } of patrones) {
                    if (regex.test(code)) {
                        hallazgos.push(`- ${mensaje}`);
                        problemas = true;
                    }
                }

                if (hallazgos.length > 0) {
                    response += `📂 *${file}*\n${hallazgos.join('\n')}\n\n`;
                }
            }
        }

        if (!problemas) {
            response += '✅ No se encontraron vulnerabilidades ni malas prácticas en los plugins.';
        }

        await conn.reply(m.chat, response, m, rcanal);
        await m.react('🛠️');
    } catch (err) {
        console.error(err);
        await m.react('✖️');
        conn.reply(m.chat, '🚩 *Fallo al analizar los plugins.*', m, rcanal);
    }
};

handler.command = ['inspeccionar'];
handler.help = ['inspeccionar'];
handler.tags = ['tools'];
handler.register = true;

export default handler;