let handler = async (m, { conn, args, text }) => { 
  if (!text.trim()) {
    return conn.reply(m.chat, `*Ejemplo:* resetprefix ${prefix}`, m, rcanal);
  }

  global.prefix = new RegExp('^[' + 
    (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-')
    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ']');

  conn.reply(m.chat, `${emoji} *Prefijo Restablecido Con Éxito!*`, m, rcanal);
};

handler.help = ['resetprefix'];
handler.tags = ['owner'];
handler.customPrefix = /^(ho|resetprefix)$/i
handler.command = new RegExp
handler.rowner = true;

export default handler;