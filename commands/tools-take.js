const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const webp = require('node-webpmux');
const crypto = require('crypto');

async function takeCommand(sock, chatId, message, args) {
    try {
        // Check if message is a reply to a sticker
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage?.stickerMessage) {
                await sock.sendMessage(chatId, {
            react: { text: '🤪', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❕ 𝚁𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚜𝚝𝚒𝚌𝚔𝚎𝚛 𝚠𝚒𝚝𝚑 .𝚝𝚊𝚔𝚎 <𝚙𝚊𝚌𝚔𝚗𝚊𝚖𝚎>' });
            return;
        }

        // Get the packname from args or use default
        const packname = args.join(' ') || 'ᴘʀᴍᴏ✗ ᴡᴇʙ';
        await sock.sendMessage(chatId, {
            react: { text: '🧸', key: message.key }
        });
        try {
            // Download the sticker
            const stickerBuffer = await downloadMediaMessage(
                {
                    key: message.message.extendedTextMessage.contextInfo.stanzaId,
                    message: quotedMessage,
                    messageType: 'stickerMessage'
                },
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                }
            );

            if (!stickerBuffer) {
                    await sock.sendMessage(chatId, {
            react: { text: '😓', key: message.key }
        });
                await sock.sendMessage(chatId, { text: '❕ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚜𝚝𝚒𝚌𝚔𝚎𝚛...' });
                return;
            }

            // Add metadata using webpmux
            const img = new webp.Image();
            await img.load(stickerBuffer);

            // Create metadata
            const json = {
                'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                'sticker-pack-name': packname,
                'emojis': ['🤖']
            };

            // Create exif buffer
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
            const exif = Buffer.concat([exifAttr, jsonBuffer]);
            exif.writeUIntLE(jsonBuffer.length, 14, 4);

            // Set the exif data
            img.exif = exif;

            // Get the final buffer with metadata
            const finalBuffer = await img.save(null);

            // Send the sticker
            await sock.sendMessage(chatId, {
                sticker: finalBuffer
            }, {
                quoted: message
            });

        } catch (error) {
            console.error('Sticker processing error:', error);
                    await sock.sendMessage(chatId, {
            react: { text: '‼️', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❗ 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚜𝚝𝚒𝚌𝚔𝚎𝚛...' });
        }

    } catch (error) {
        console.error('Error in take command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '"⚠️ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚝𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛...' });
    }
}

module.exports = takeCommand; 