

const handler = async (m, { conn }) => {
  


let info = `Hola soy ${botname} y te invito a unirte a mis espacios oficiales:

𝗖𝗔𝗡𝗔𝗟:
https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m

𝗚𝗥𝗨𝗣𝗢 𝗢𝗙𝗖:
http://bit.ly/3ImhCFl

𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗢 𝗗𝗘𝗟 𝗖𝗥𝗘𝗔𝗗𝗢𝗥:
https://wa.link/i3ytgw`



handler.help = ['grupos'];
handler.tags = ['info'];
handler.command = ['grupos', 'links', 'groups'];

export default handler;