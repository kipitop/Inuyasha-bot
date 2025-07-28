/* Código hecho por Destroy
 - https://github.com/The-King-Destroy
 - Modificado por Deylin
*/

let handler = async (m, { conn, args, text }) => {
    let who;

    if (m.quoted) {
        who = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        who = m.mentionedJid[0];
    } else if (text && text.replace(/\D/g, '').length > 4) {
        let number = text.replace(/\D/g, '') + '@s.whatsapp.net';
        who = number;
    } else {
        who = m.fromMe ? conn.user.jid : m.sender;
    }

    try {
        let name = await conn.getName(who);
        let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://rejas.x10.mx/images/inu/inu3.jpeg');
        await conn.sendFile(m.chat, pp, 'profile.jpg', `*Foto de perfil de: »* ${name}`, m);
    } catch (e) {
        await m.reply('❌ No se pudo obtener la foto de perfil.');
    }
};

handler.help = ['pfp @user', 'pfp +numero'];
handler.tags = ['sticker'];
handler.command = ['pfp', 'getpic'];

export default handler;