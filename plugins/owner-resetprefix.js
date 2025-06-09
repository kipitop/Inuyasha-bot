const handler = async (m, {conn}) => {
  
    if (!text.trim()) {
      return conn.reply(m.chat, `*Ejemplo:* resetprefix ${prefix}`, m, rcanal);
    }
  global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
  //await m.reply(`✅️ *Prefijo Restablecido Con Éxito!*`);
  conn.fakeReply(m.chat, `${emoji} *Prefijo Restablecido Con Éxito!*`, '0@s.whatsapp.net', '✨ PREFIJO RESTABLECIDO ✨')
};
handler.help = ['resetprefix'];
handler.tags = ['owner'];
handler.command = ['resetprefix'];
handler.rowner = true;

export default handler;