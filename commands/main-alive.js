const settings = require("../settings");
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, message) {
        const aliveMessage = `*𝙿𝚁𝙼𝙾✗ 𝚒𝚜 𝙰𝚌𝚝𝚒𝚟𝚎!*\n` +
        `Hello! I'm 𝙿𝚁𝙼𝙾✗, your fastest Assistant - alive and sparkling now! ✨\n\n` +
        `╭╌❲ *ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟ* ❳\n` +
        `╎👤 𝙾𝚠𝚗𝚎𝚛𝚜 : ${settings.botOwner}\n` +
        `╎⚙️ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : v${settings.version}\n` +
        `╎📡 𝙼𝚘𝚍𝚎 : ${settings.commandMode}\n` +
        `╎☔ 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : prmox-cloud\n` +
        `╎ *𝙷𝚘𝚜𝚝 𝚋𝚢 ᴘʀᴍᴏ✗ ᴡᴇʙ ♡*\n` +
        `╰╌╌╌╌࿐\n\n` + 
        `╭╌❲ *ᴍᴀɪɴ ᴄᴏᴍᴍᴀɴᴅꜱ* ❳\n` +
        `╎⚡𝚄𝚜𝚎 𝚝𝚑𝚎𝚜𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜\n` +
        `╎📃 .menu\n` +
        `╎🗳️ .alive\n` +
        `╎⏱️ .ping\n` +
        `╰╌╌╌╌࿐\n\n` + 
        `───────────\n` +
        `🚀 𝙳𝚎𝚙𝚕𝚘𝚢 𝚟𝚒𝚍𝚎𝚘𝚜 : https://youtube.com/@prmox_asuka?si=kw6cauMU33zS4xEN\n` +
        `⚕ 𝙶𝚒𝚝𝚑𝚞𝚋 : https://github.com/prmoxasuka-star/Prmox-bot\n` +
        `───────────\n`;
        
    try {
        const imagePath = path.join(__dirname, '../assets/prmox-alive.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
                    await sock.sendMessage(chatId, {
            react: { text: '🚀', key: message.key }
        });
            await sock.sendMessage(chatId, {
      audio: { url: 'https://cdn.jsdelivr.net/gh/prmoxasuka-star/Prmox-bot/assets/mp3/alive.mp3' },
      mimetype: 'audio/mpeg',
      fileName: 'alive-song.mp3'
    }, { quoted: message });
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: aliveMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363423930246587@newsletter',
                        newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: aliveMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363423930246587@newsletter',
                        newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in alive command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '💤', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '👍 𝙱𝚘𝚝 𝚒𝚜 𝚊𝚕𝚒𝚟𝚎 𝚊𝚗𝚍 𝚛𝚞𝚗𝚗𝚒𝚗𝚐...' }, { quoted: message });
    }
}
module.exports = aliveCommand;