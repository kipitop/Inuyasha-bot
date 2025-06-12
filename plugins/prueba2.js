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



const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');

// Enlaces de grupos excluidos
const enlacesExcluidos = [
  'https://chat.whatsapp.com/Dc0JDrZR1X6JjNtJgYHiOu' // Agrega más aquí si quieres
];

// Obtener el ID de un grupo desde su enlace
async function obtenerIdDesdeLink(sock, enlace) {
  try {
    const inviteCode = enlace.split('/').pop();
    const metadata = await sock.groupGetInviteInfo(inviteCode);
    return metadata.id;
  } catch (err) {
    console.error('❌ Error al obtener el ID del grupo desde el link:', err.message);
    return null;
  }
}

// Verificar y salir si el grupo está excluido
async function verificarYSalirDeGrupo(sock, groupId, gruposExcluidosIds) {
  if (gruposExcluidosIds.includes(groupId)) {
    try {
      await sock.sendMessage(groupId, {
        text: '🚫 Este grupo está excluido. El bot se retirará automáticamente.'
      });
      await sock.groupLeave(groupId);
      console.log(`[EXCLUSIÓN] Salí del grupo prohibido: ${groupId}`);
    } catch (err) {
      console.error(`[ERROR] Al salir del grupo ${groupId}:`, err.message);
    }
  }
}

// Revisar todos los grupos al iniciar
async function revisarTodosLosGrupos(sock, gruposExcluidosIds) {
  try {
    const chats = await sock.groupFetchAllParticipating();
    for (let groupId in chats) {
      await verificarYSalirDeGrupo(sock, groupId, gruposExcluidosIds);
    }
  } catch (err) {
    console.error('Error al revisar los grupos al iniciar:', err.message);
  }
}

// Función principal
async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  // Guardar credenciales
  sock.ev.on('creds.update', saveCreds);

  // Obtener los IDs desde los enlaces excluidos
  const gruposExcluidosIds = [];
  for (let enlace of enlacesExcluidos) {
    const groupId = await obtenerIdDesdeLink(sock, enlace);
    if (groupId) gruposExcluidosIds.push(groupId);
  }

  // Revisar si ya está en un grupo excluido al iniciar
  await revisarTodosLosGrupos(sock, gruposExcluidosIds);

  // Detectar si fue añadido a un grupo
  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    if (action === 'add' && participants.includes(sock.user.id)) {
      console.log(`[ALERTA] El bot fue añadido al grupo: ${id}`);
      await verificarYSalirDeGrupo(sock, id, gruposExcluidosIds);
    }
  });

  console.log('✅ Bot iniciado y protección de grupos excluidos activa.');
}

// Iniciar
iniciarBot();