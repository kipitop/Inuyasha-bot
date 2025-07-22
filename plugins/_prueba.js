import fetch from 'node-fetch';
import FormData from 'form-data';

const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !/image/.test(m.quoted.mimetype)) {
    return m.reply(`📷 Responde a una imagen con el comando:\n${usedPrefix + command}`);
  }

  const qimg = await m.quoted.download();
  const form = new FormData();
  form.append('file', qimg, 'image.jpg');
  form.append('api_key', 'a4f48096f081456ff62307c3d0f213e866414327');

  const res = await fetch('https://saucenao.com/search.php?output_type=2&api_key=a4f48096f081456ff62307c3d0f213e866414327', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });

  const json = await res.json();

  if (!json || !json.results || !json.results.length)
    return m.reply('❌ No se encontró información sobre la imagen.');

  const info = json.results[0];
  const {
    similarity,
    thumbnail,
    data
  } = info;

  let texto = `🔍 *Resultados de búsqueda*:\n\n`;
  texto += `📸 *Similitud:* ${similarity}%\n`;
  if (data.title) texto += `🎞️ *Título:* ${data.title}\n`;
  if (data.source) texto += `📍 *Fuente:* ${data.source}\n`;
  if (data.creator) texto += `✍️ *Autor:* ${data.creator}\n`;
  if (data.characters) texto += `🧑‍🤝‍🧑 *Personajes:* ${data.characters}\n`;
  if (data.material) texto += `📘 *Material:* ${data.material}\n`;

  await conn.sendFile(m.chat, thumbnail, 'thumb.jpg', texto, m);
};

handler.command = ['searchinfoimg'];
export default handler;