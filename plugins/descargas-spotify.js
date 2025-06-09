
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) return conn.reply(m.chat, `❗ Por favor proporciona el nombre de una canción o artista.`, m)

    try {
        // Paso 1: Obtener info de Spotify
        let songInfo = await spotifyxv(text)
        if (!songInfo.length) throw `❌ No se encontró la canción.`
        let song = songInfo[0]

        // Paso 2: Buscar en YouTube
        const query = encodeURIComponent(`${song.name} ${song.artista[0]}`)
        const ytRes = await fetch(`https://aemt.me/youtube?query=${query}`)
        const ytData = await ytRes.json()

        if (!ytData.status || !ytData.data || !ytData.data[0]) throw 'No se pudo encontrar un video en YouTube.'

        const video = ytData.data[0]
        const ytUrl = video.url

        // Paso 3: Descargar MP3 desde YouTube
        const dlRes = await fetch(`https://api.botcahx.eu.org/api/dowloader/ytmp3?url=${ytUrl}`)
        const dlData = await dlRes.json()

        if (!dlData.status || !dlData.result || !dlData.result.audio) throw 'No se pudo obtener el enlace de descarga MP3.'

        const info = `🎧 *${song.name}*\n👤 *Artista:* ${song.artista.join(', ')}\n💽 *Álbum:* ${song.album}\n🕒 *Duración:* ${song.duracion}\n🔗 *Spotify:* ${song.url}`

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: false,
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'Kirito Bot - Descarga de música 🎶',
                    body: 'Canal Oficial de WhatsApp',
                    mediaType: 1,
                    thumbnailUrl: song.imagen,
                    mediaUrl: ytUrl,
                    sourceUrl: ytUrl
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: dlData.result.audio },
            fileName: `${song.name}.mp3`,
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: m })

    } catch (e1) {
        console.error(e1)
        m.reply(`⚠️ Error: ${e1.message || e1}`)
    }
}

handler.help = ['spotify', 'music']
handler.tags = ['downloader']
handler.command = ['spotify', 'splay']
handler.group = false
handler.register = true

export default handler

async function spotifyxv(query) {
    let token = await tokens()
    let response = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    const tracks = response.data.tracks.items
    const results = tracks.map((track) => ({
        name: track.name,
        artista: track.artists.map((artist) => artist.name),
        album: track.album.name,
        duracion: timestamp(track.duration_ms),
        url: track.external_urls.spotify,
        imagen: track.album.images.length ? track.album.images[0].url : ''
    }))
    return results
}

async function tokens() {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64')
        },
        data: 'grant_type=client_credentials'
    })
    return response.data.access_token
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}