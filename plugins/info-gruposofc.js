import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

let grupos = `
┏╍╍《 *GRUPOS OFICIALES* 》━━⌬
┃
︻
⌨ *Canal oficial:*  
➥ *${namechannel}*  
⌁ ${channel}  
︼
┃
┃ ${dev}
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⌬`

await conn.sendFile(m.chat, catalogo, "grupos.jpg", grupos, m)
await m.react(emoji)

}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler