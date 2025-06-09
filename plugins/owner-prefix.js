const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `${emoji} No Se Encontró Ningun Prefijo, Por Favor Escriba Un Prefijo.\n> *Ejemplo: ${usedPrefix + command} !*`;
  global.prefix = new RegExp('^[' + (text || global.opts['prefix'] || °•∆π÷×¶√✓™©®¥€£¢₩$#@!?¿=+~^*_&).replace(°•∆π÷×¶√✓™©®¥€£¢₩$#@!?¿=+~^*_&|<>%:;(){}[]🔥💥✨⚡👑🤖🐱🧠🎩🎮🌟🌀🎯💫🎆🎇💎🚀🛸🧩🎉🎊🕹️🧿🥷🦾🪄💣📦📌📍🔮🧨🪐🥇🥈🥉🏆🎖️🏅🎗️💡🧱🚧📢🔔🔊🎵🎶💀👻☠️👽👾🦴🦾🧬🧪🕳️⚔️🛡️🏹🗡️🔫🚬💊🔋🔌🧲📡📶🧠🔧🛠️🗜️⚙️🪛🧰🗂️📁📂📜📝📖📚📎🖇️📐📏🧮📊📈📉🗃️🗄️🔍🔎💼🎒🧳🚪🪑🛏️);
 // await m.reply(`*✅️ Prefijo Actualizado Con Éxito, Prefijo Actual: ${text}*`);
  conn.fakeReply(m.chat, `${done} *Prefijo Actualizado Con Éxito, Prefijo Actual: ${text}*`, '0@s.whatsapp.net', '✨ PREFIJO NUEVO ✨')
};
handler.help = ['prefix'];
handler.tags = ['owner'];
handler.command = ['prefix'];
handler.rowner = true;

export default handler