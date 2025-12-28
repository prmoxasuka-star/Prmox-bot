const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
 await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "🎶 𝚆𝚑𝚊𝚝 𝚜𝚘𝚗𝚐 𝚍𝚘 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍?"
            });
        }

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
await sock.sendMessage(chatId, {
            react: { text: '❕', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "⚠️ 𝙽𝚘 𝚜𝚘𝚗𝚐𝚜 𝚏𝚘𝚞𝚗𝚍!"
            });
        }

        // Send loading message
                await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: "📥 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚢𝚘𝚞𝚛 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚒𝚜 𝚒𝚗 𝚙𝚛𝚘𝚐𝚛𝚎𝚜𝚜..."
        });

        // Get the first video result
        const video = videos[0];
        const urlYt = video.url;

        // Fetch audio data from API
        const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.downloadUrl) {
        return await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "❗ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚊𝚞𝚍𝚒𝚘 𝚏𝚛𝚘𝚖 𝚝𝚑𝚎 𝙰𝙿𝙸. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛..."
            });
        }

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        // Send the audio
                await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `PRMOX-WEB-${title}.mp3`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in song2 command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { 
            text: "⚠️ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝙵𝚊𝚒𝚕𝚎𝚍. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛..."
        });
    }
}

module.exports = playCommand; 

/*Powered by KNIGHT-BOT*
*Credits to Keith MD*`*/