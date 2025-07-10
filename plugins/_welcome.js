// © código creado por Deylin 
// https://github.com/Deylin-eliac 
// ➤  no quites creditos 

import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

async function obtenerPais(numero) {
  try {
    let number = numero.replace("@s.whatsapp.net", "");
    const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`);
    const data = await res.json();

    if (data && data.pais) return data.pais;
    if (data && data.bandera && data.nombre) return `${data.bandera} ${data.nombre}`;

    return "🌐 Desconocido";
  } catch (e) {
    return "🌐 Desconocido";
  }
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  // if (m.chat === "120363402481697721@g.us") return;

  const who = m.messageStubParameters?.[0];
  if (!who) return;

  const taguser = `@${who.split("@")[0]}`;
  const chat = global.db?.data?.chats?.[m.chat] || {};
  const totalMembers = participants.length;
  const date = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" });

  const pais = await obtenerPais(who);
  let ppUser = 'https://raw.githubusercontent.com/Deylin-Eliac/kirito-bot-MD/main/src/catalogo.jpg';

  try {
    ppUser = await conn.profilePictureUrl(who, 'image');
  } catch (e) {}

    let frasesBienvenida = [
    "¡Esperamos que disfrutes tu estadía!",
    "Recuerda leer las reglas del grupo.",
    "Diviértete y participa en las conversaciones.",
    "¡Un placer tenerte aquí!",
    "¡Bienvenido! Esperamos que la pases genial con nosotros.",
  ];
  let frasesDespedida = [
    "Esperamos verte pronto de nuevo.",
    "¡Suerte en tus proyectos futuros!",
    "Hasta la próxima, cuídate.",
    "Nos vemos en otra ocasión.",
    "¡Fue un placer tenerte aquí! Mucho éxito.",
  ];

  const fraseRandomBienvenida = frasesBienvenida[Math.floor(Math.random() * frasesBienvenida.length)];
  const fraseRandomDespedida = frasesDespedida[Math.floor(Math.random() * frasesDespedida.length)];

  if (chat.welcome) {
    // ─────── Bienvenida ───────
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const bienvenida = `
*╭━━〔 *Bienvenido/a* 〕━━⬣*
*┃ Usuario:* ${taguser}
*┃ País:* ${pais}
*┃ Grupo:* *${groupMetadata.subject}*
*┃ Miembros:* *${totalMembers + 1}*
*┃ Fecha:* *${date}*
*╰━▣*
*${fraseRandomBienvenida}*`.trim();

      await conn.sendMessage(m.chat, {
        image: { url: ppUser },
        caption: bienvenida,
        buttons: [
          {
            buttonId: '/owner',
            buttonText: { displayText: `👑 CREADOR` },
            type: 1
          }
        ],
        headerType: 4,
        mentions: [who]
      });
    }

    // ─────── Despedida ───────
    if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
    ) {
      const despedida = `
*╭──〔 *Despedida* 〕──⬣*
*┃ Usuario:* ${taguser}
*┃ País:* ${pais}
*┃ Grupo:* *${groupMetadata.subject}*
*┃ Miembros:* *${totalMembers - 1}*
*┃ Fecha:* *${date}*
*╰━▣*
*${fraseRandomDespedida}*`.trim();

      await conn.sendMessage(m.chat, {
        image: { url: ppUser },
        caption: despedida,
        buttons: [
          {
            buttonId: '/menu',
            buttonText: { displayText: `✨ MENU` },
            type: 1
          }
        ],
        headerType: 4,
        mentions: [who]
      });
    }
  }
}