const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

async function ttsCommand(sock, chatId, text, message, language = 'en') {
    if (!text) {
            await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚝𝚑𝚎 𝚝𝚎𝚡𝚝 𝚏𝚘𝚛 𝚃𝚃𝚂 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚒𝚘𝚗...' });
        return;
    }

    const fileName = `tts-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, '..', 'assets', fileName);
        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });
    const gtts = new gTTS(text, language);
    gtts.save(filePath, async function (err) {
        if (err) {
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚃𝚃𝚂 𝚊𝚞𝚍𝚒𝚘...' });
            return;
        }
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
        await sock.sendMessage(chatId, {
            audio: { url: filePath },
            mimetype: 'audio/mpeg'
        }, { quoted: message });

        fs.unlinkSync(filePath);
    });
}

module.exports = ttsCommand;
