let handler = async (m, { conn }) => {
  const poll = await conn.generateWAMessageFromContent(
    m.chat,
    {
      pollCreationMessage: {
        name: "¿Te gusta Kirito-Bot?",
        options: ["Sí", "Lo amo", "Es Dios"].map(option => ({ option })),
        selectableOptionsCount: 3
      }
    },
    { userJid: m.sender }
  )

  await conn.relayMessage(m.chat, poll.message, { messageId: poll.key.id })
}

handler.command = /^prueba5$/i
handler.owner = true
export default handler