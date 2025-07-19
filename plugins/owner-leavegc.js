let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
let chat = global.db.data.chats[m.chat]
chat.welcome = false
await conn.reply(m.chat, ` 
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬
┃ ᴀᴅɪᴏ́s, ᴋɪʀɪᴛᴏ-ʙᴏᴛ sᴇ sᴀʟᴇ ᴅᴇʟ ɢʀᴜᴘᴏ.
┃ ᴘᴏʀ ᴏʀᴅᴇɴ ᴅᴇ ᴍɪ ᴄʀᴇᴀᴅᴏʀ, ʜᴀ sɪᴅᴏ 
┃ ᴜɴ ᴘʟᴀᴄᴇʀ ᴇsᴛᴀʀ ᴀǫᴜí ᴄᴏɴ ᴜsᴛᴇᴅᴇs.
┃
┃ ${dev}
┗━━━━━━━━━━━━━━━━━━━━━━━⌬
`, m, fake)
await conn.groupLeave(id)
try {  
chat.welcome = true
} catch (e) {
await m.reply(`${fg}`) 
return console.log(e)
}}
handler.command = ['salir','leavegc','salirdelgrupo','leave']
handler.group = true
handler.rowner = true

export default handler