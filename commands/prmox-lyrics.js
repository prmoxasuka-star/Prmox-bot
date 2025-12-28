const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle, message) {
    if (!songTitle) {
            await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
        await sock.sendMessage(chatId, { 
            text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚜𝚘𝚗𝚐 𝚗𝚊𝚖𝚎 𝚝𝚘 𝚐𝚎𝚝 𝚝𝚑𝚎𝚛 𝚕𝚢𝚛𝚒𝚌𝚜...'
        },{ quoted: message });
        return;
    }

    try {
        // Use lyricsapi.fly.dev and return only the raw lyrics text
        const apiUrl = `https://lyricsapi.fly.dev/api/lyrics?q=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            const errText = await res.text();
            throw errText;
        }
        
        const data = await res.json();

        const lyrics = data && data.result && data.result.lyrics ? data.result.lyrics : null;
        if (!lyrics) {
                await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
            await sock.sendMessage(chatId, {
                text: `❕ 𝚂𝚘𝚛𝚛𝚢, 𝙸 𝚌𝚘𝚞𝚕𝚍𝚗'𝚝 𝚏𝚒𝚗𝚍 𝚊𝚗𝚢 𝚕𝚢𝚛𝚒𝚌𝚜 𝚏𝚘𝚛"${songTitle}"...`
            },{ quoted: message });
            return;
        }

        const maxChars = 4096;
        const output = lyrics.length > maxChars ? lyrics.slice(0, maxChars - 3) + '...' : lyrics;

        await sock.sendMessage(chatId, { text: output }, { quoted: message });
    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { 
            text: `⚠️ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚝𝚑𝚎 𝚕𝚢𝚛𝚒𝚌𝚜 𝚏𝚘𝚛 "${songTitle}"...`
        },{ quoted: message });
    }
}

module.exports = { lyricsCommand };
