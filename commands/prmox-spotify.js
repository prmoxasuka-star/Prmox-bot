const axios = require('axios');

async function spotifyCommand(sock, chatId, message) {
    try {
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

 const used = rawText.startsWith('.') 
    ? rawText.split(/\s+/)[0] 
    : '.spotify';
        const query = rawText.slice(used.length).trim();

        if (!query) {
                await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '☕ 𝚄𝚜𝚊𝚐𝚎: .𝚜𝚙𝚘𝚝𝚒𝚏𝚢 <𝚜𝚘𝚗𝚐/𝚊𝚛𝚝𝚒𝚜𝚝 𝚘𝚛 𝚔𝚎𝚢𝚠𝚘𝚛𝚍𝚜...' }, { quoted: message });
            return;
        }

const apiUrl = `https://api.lolhuman.xyz/api/spotify?apikey=YOUR_KEY&query=${encodeURIComponent(query)}`;
const { data } = await axios.get(apiUrl, { timeout: 30000, headers: { 'user-agent': 'Mozilla/5.0' } });
console.log('[SPOTIFY API DATA]', data); // ✅ log inside async function
        if (!data?.status || !data?.result) {
            throw new Error('No result from Spotify API');
        }

const r = data.result;
const audioUrl =
    r.audio ||
    r.audio_url ||
    r.download ||
    r.url_audio ||
    null;

if (!audioUrl || !audioUrl.startsWith('http')) {
    await sock.sendMessage(chatId, {
        react: { text: '😕', key: message.key }
    });
    await sock.sendMessage(chatId, {
        text: '❕ 𝙽𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚊𝚋𝚕𝚎 𝚊𝚞𝚍𝚒𝚘 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚜𝚘𝚗𝚐.'
    }, { quoted: message });
    return;
}
        const caption = `*🎵 𝚂𝚘𝚗𝚐 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛*\n\n╌╌╌╌╌╌╌╌╌╌╌╌\n🧸 𝚃𝚒𝚝𝚕𝚎: *${r.title || r.name || 'Unknown Title'}*\n👤 𝙰𝚛𝚝𝚒𝚜𝚝: *${r.artist || 'Unknown Artist'}*\n⏱️ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗: *${r.duration || 'Unknown'}*\n🔗 𝙻𝚒𝚗𝚔: *${r.url || 'Unknown'}*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`.trim();

         // Send cover and info as a follow-up (optional)
const thumb = r.thumbnails || r.thumbnail || r.image || null;

if (thumb) {
    await sock.sendMessage(chatId, { image: { url: thumb }, caption }, { quoted: message });
}
try {
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
    await sock.sendMessage(chatId, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `PRMOX-WEB-${(r.title || r.name || 'track')
    .replace(/[\\/:*?"<>|]/g, '')
    .slice(0, 50)}.mp3`
    }, { quoted: message });
} catch {
        await sock.sendMessage(chatId, {
            react: { text: '❗', key: message.key }
        });
    await sock.sendMessage(chatId, {
        text: '‼️ 𝙰𝚞𝚍𝚒𝚘 𝚕𝚒𝚗𝚔 𝚎𝚡𝚙𝚒𝚛𝚎𝚍... 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛...'
    }, { quoted: message });
}
       

    } catch (error) {
        console.error('[SPOTIFY] error:', error?.message || error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝚂𝚙𝚘𝚝𝚒𝚏𝚢 𝚜𝚎𝚟𝚎𝚛 𝚒𝚜 𝚋𝚞𝚜𝚢 𝚘𝚛 𝚕𝚒𝚗𝚔 𝚎𝚡𝚙𝚒𝚛𝚎𝚍...𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 𝚊 𝚖𝚘𝚖𝚎𝚗𝚝...' }, { quoted: message });
    }
}
module.exports = spotifyCommand;

