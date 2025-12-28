const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { UploadFileUgu, TelegraPh } = require('../lib/uploader');

async function getMediaBufferAndExt(message) {
    const m = message.message || {};
    if (m.imageMessage) {
        const stream = await downloadContentFromMessage(m.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks), ext: '.jpg' };
    }
    if (m.videoMessage) {
        const stream = await downloadContentFromMessage(m.videoMessage, 'video');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks), ext: '.mp4' };
    }
    if (m.audioMessage) {
        const stream = await downloadContentFromMessage(m.audioMessage, 'audio');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        // default mp3 for voice/ptt may be opus; still use .mp3 generically
        return { buffer: Buffer.concat(chunks), ext: '.mp3' };
    }
    if (m.documentMessage) {
        const stream = await downloadContentFromMessage(m.documentMessage, 'document');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const fileName = m.documentMessage.fileName || 'file.bin';
        const ext = path.extname(fileName) || '.bin';
        return { buffer: Buffer.concat(chunks), ext };
    }
    if (m.stickerMessage) {
        const stream = await downloadContentFromMessage(m.stickerMessage, 'sticker');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks), ext: '.webp' };
    }
    return null;
}

async function getQuotedMediaBufferAndExt(message) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
    if (!quoted) return null;
    return getMediaBufferAndExt({ message: quoted });
}

async function urlCommand(sock, chatId, message) {
    try {
        // Prefer current message media, else quoted media
        let media = await getMediaBufferAndExt(message);
        if (!media) media = await getQuotedMediaBufferAndExt(message);

        if (!media) {
                await sock.sendMessage(chatId, {
            react: { text: '⛱️', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '☕ 𝚂𝚎𝚗𝚍 𝚘𝚛 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚖𝚎𝚍𝚒𝚊 (𝚒𝚖𝚊𝚐𝚎, 𝚟𝚒𝚍𝚎𝚘, 𝚊𝚞𝚍𝚒𝚘, 𝚜𝚝𝚒𝚔𝚎𝚛..) 𝚝𝚘 𝚐𝚎𝚝 𝚊 𝚄𝚁𝙻...' }, { quoted: message });
            return;
        }

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const tempPath = path.join(tempDir, `${Date.now()}${media.ext}`);
        fs.writeFileSync(tempPath, media.buffer);

        let url = '';
        try {
            if (media.ext === '.jpg' || media.ext === '.png' || media.ext === '.webp') {
                // Try TelegraPh for images/webp first (fast, simple)
                try {
                    url = await TelegraPh(tempPath);
                } catch {
                    // Fallback to Uguu for any file type
                    const res = await UploadFileUgu(tempPath);
                    url = typeof res === 'string' ? res : (res.url || res.url_full || JSON.stringify(res));
                }
            } else {
                const res = await UploadFileUgu(tempPath);
                url = typeof res === 'string' ? res : (res.url || res.url_full || JSON.stringify(res));
            }
        } finally {
            setTimeout(() => {
                try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
            }, 2000);
        }

        if (!url) {
                await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '⁉️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚞𝚙𝚕𝚘𝚊𝚍 𝚖𝚎𝚍𝚒𝚊.' }, { quoted: message });
            return;
        }
        await sock.sendMessage(chatId, {
            react: { text: '🔖', key: message.key }
        });
        await sock.sendMessage(chatId, { text: `🔗 𝚄𝚁𝙻: ${url}\n𝚃𝚑𝚒𝚜 𝚄𝚁𝙻 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚟𝚊𝚕𝚒𝚍 𝚏𝚘𝚛 3 𝚑𝚘𝚞𝚛𝚜...\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ` }, { quoted: message });
    } catch (error) {
        console.error('[URL] error:', error?.message || error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚌𝚘𝚖𝚟𝚎𝚛𝚝 𝚖𝚎𝚍𝚒𝚊 𝚝𝚘 𝚄𝚁𝙻:' }, { quoted: message });
    }
}

module.exports = urlCommand;


