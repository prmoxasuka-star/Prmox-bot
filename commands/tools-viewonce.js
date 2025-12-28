const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewonceCommand(sock, chatId, message) {
    // Extract quoted imageMessage or videoMessage from your structure
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;
    const quotedVideo = quoted?.videoMessage;
    
        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });
    if (quotedImage && quotedImage.viewOnce) {
        // Download and send the image
        const stream = await downloadContentFromMessage(quotedImage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
        await sock.sendMessage(chatId, { image: buffer, fileName: 'media.jpg', caption: quotedImage.caption || '𝚅𝙸𝙴𝚆 𝙾𝙽𝙲𝙴 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁\n\n┄┄┄┄┄┄┄┄\n🐋 𝚃𝚢𝚙𝚎: Image\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ' }, { quoted: message });
    } else if (quotedVideo && quotedVideo.viewOnce) {
        // Download and send the video
        const stream = await downloadContentFromMessage(quotedVideo, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
        await sock.sendMessage(chatId, { video: buffer, fileName: 'media.mp4', caption: quotedVideo.caption || '𝚅𝙸𝙴𝚆 𝙾𝙽𝙲𝙴 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁\n\n┄┄┄┄┄┄┄┄\n🐋 𝚃𝚢𝚙𝚎: Video\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ' }, { quoted: message });
    } else {
            await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚟𝚒𝚎𝚠 𝚘𝚗𝚌𝚎 𝚒𝚖𝚊𝚐𝚎 𝚘𝚛 𝚟𝚒𝚍𝚎𝚘...' }, { quoted: message });
    }
}

module.exports = viewonceCommand; 