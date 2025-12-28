const os = require('os');
const settings = require('../settings.js');
const fs = require('fs');
const path = require('path');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });
        await sock.sendMessage(chatId, { text: '♻ 𝙿𝚘𝚗𝚐...!' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `
Hello! I'm 𝙿𝚁𝙼𝙾✗, your fastest Assistant - alive and sparkling now! ✨

┄┄┄┄┄┄┄┄┄┄
╭╌❲ *ʙᴏᴛ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ* ❳
╎ 🐋 𝙱𝚘𝚝 𝚗𝚊𝚖𝚎 : ᴘʀᴍᴏ✗
╎ 🚀 𝙿𝚒𝚗𝚐    : ${ping} 𝚖𝚜
╎ ⏱️ 𝚄𝚙𝚝𝚒𝚖𝚎  : ${uptimeFormatted}
╎ 🔖 𝚅𝚎𝚛𝚜𝚒𝚘𝚗  : v${settings.version}
╎ 🧸 𝙾𝚠𝚗𝚎𝚛𝚜   : Asuka and Gaïus
╰╌╌࿐
𝙷𝚘𝚜𝚝 𝚋𝚢 ᴘʀᴍᴏ✗ ᴡᴇʙ ♡`.trim();

        const pingMessage = botInfo;

        // Send bot info text
        await sock.sendMessage(chatId, { text: pingMessage }, { quoted: message });

        // Send image with caption if exists
        const imagePath = path.join(__dirname, '../assets/prmox-ping.jpg');
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, { react: { text: '⚡', key: message.key } });
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: pingMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363423930246587@newsletter',
                        newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚋𝚘𝚝 𝚜𝚝𝚊𝚝𝚞𝚜...' });
    }
}

module.exports = pingCommand;