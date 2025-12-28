const isAdmin = require('../lib/isAdmin');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const extMap = {
        image: 'jpg',
        video: 'mp4',
        document: 'bin'
    };

    const filePath = path.join(
        tempDir,
        `${Date.now()}.${extMap[mediaType] || 'dat'}`
    );

    fs.writeFileSync(filePath, buffer);
    return filePath;
}

async function tagCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
        await sock.sendMessage(
            chatId,
            { text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚊𝚔𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚏𝚒𝚛𝚜𝚝...' },
            { quoted: message }
        );
        return;
    }

    if (!isSenderAdmin) {
        const stickerPath = './assets/prmox-sstag.webp';
        if (fs.existsSync(stickerPath)) {
            await sock.sendMessage(
                chatId,
                { sticker: fs.readFileSync(stickerPath) },
                { quoted: message }
            );
        }
        return;
    }

    const groupMetadata = await sock.groupMetadata(chatId);
    const mentionedJidList = groupMetadata.participants.map(p => p.id);

    let messageContent = {};

    if (replyMessage) {

        if (replyMessage.imageMessage) {
            const filePath = await downloadMediaMessage(replyMessage.imageMessage, 'image');
            messageContent = {
                image: { url: filePath },
                caption: messageText || replyMessage.imageMessage.caption || '',
                mentions: mentionedJidList
            };
        }

        else if (replyMessage.videoMessage) {
            const filePath = await downloadMediaMessage(replyMessage.videoMessage, 'video');
            messageContent = {
                video: { url: filePath },
                caption: messageText || replyMessage.videoMessage.caption || '',
                mentions: mentionedJidList
            };
        }

        else if (replyMessage.documentMessage) {
            const filePath = await downloadMediaMessage(replyMessage.documentMessage, 'document');
            messageContent = {
                document: { url: filePath },
                fileName: replyMessage.documentMessage.fileName || 'file',
                caption: messageText || '',
                mentions: mentionedJidList
            };
        }

        else if (replyMessage.conversation || replyMessage.extendedTextMessage) {
            messageContent = {
                text: messageText || replyMessage.conversation || replyMessage.extendedTextMessage.text,
                mentions: mentionedJidList
            };
        }

        if (Object.keys(messageContent).length) {
            await sock.sendMessage(chatId, messageContent);
        }

    } else {
        await sock.sendMessage(chatId, {
            react: { text: '📍', key: message.key }
        });

        await sock.sendMessage(chatId, {
            text: messageText || "𝚃𝚊𝚐𝚐𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎...",
            mentions: mentionedJidList
        });
    }
}

module.exports = tagCommand;