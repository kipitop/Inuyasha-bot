const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text.trim()) {
    return conn.reply(m.chat, `*${emoji} Ejemplo:* ${usedPrefix + command} !`, m, rcanal);
  }

  
  global.prefix = new RegExp('^[' + (text || global.opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-')
    .replace(/[-/\\^$*+?.()|[\]{}⚡👑]/g, '\\$&') + ']');

  
  conn.reply(m.chat, `${done} *Prefijo actualizado con éxito! Nuevo prefijo:* ${text}`, m, rcanal);
};

handler.help = ['prefix'];
handler.tags = ['owner'];
handler.command = ['prefix'];
handler.rowner = true;

export default handler;