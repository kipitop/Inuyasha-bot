/*import { areJidsSameUser } from '@whiskeysockets/baileys'
export async function before(m, { participants, conn }) {
    if (m.isGroup) {
        let chat = global.db.data.chats[m.chat];

         if (!chat.antiBot2) {
            return
        }


        let botJid = global.conn.user.jid 

       if (botJid === conn.user.jid) {
           return
        } else {
           let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id))

          if (isBotPresent) {
                setTimeout(async () => {
                    await conn.reply(m.chat, `╭━〔 ⚔ 𝐊𝐈𝐑𝐈𝐓𝐎-𝐁𝐎𝐓 ⚔ 〕━╮\n┃ En este grupo ya está el bot principal.\n┃ Me retiraré para evitar spam.\n╰━━━━━━━━━━━━━━━━━━━╯`, m, rcanal);
                    await this.groupLeave(m.chat)
                }, 5000)// 5 segundos
            }
        }
    }
}*/


import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { participants, conn, isROwner }) {
  if (!m.isGroup) return

  let chat = global.db.data.chats[m.chat]
  if (!chat?.antiBot2) return

  const mainBotJid = global.conn.user.jid 
  const currentBotJid = conn.user.jid     

  
  if (areJidsSameUser(currentBotJid, mainBotJid)) return

  
  const isMainBotPresent = participants.some(p => areJidsSameUser(mainBotJid, p.id))
  if (isMainBotPresent) {
    
    if (!isROwner) {
      
      return !0 
    }
  }
}