const isAdmin = require('../lib/isAdmin');  // Move isAdmin to helpers

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
        

        if (!isBotAdmin) {
                await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚊𝚔𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚏𝚒𝚛𝚜𝚝...' }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
                await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❕ 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚎 𝚝𝚊𝚐 𝚊𝚕𝚕...' }, { quoted: message });
            return;
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
                await sock.sendMessage(chatId, {
            react: { text: '🥹', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❕ 𝙽𝚘 𝚙𝚊𝚛𝚝𝚒𝚌𝚒𝚙𝚊𝚗𝚝𝚜 𝚏𝚘𝚞𝚗𝚍 𝚒𝚗 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙...' });
            return;
        }

        // Create message with each member on a new line
        let messageText = `📢 𝙳𝚎𝚊𝚛 𝚙𝚊𝚛𝚝𝚒𝚌𝚒𝚙𝚊𝚗𝚝𝚜...👋\nI'm 𝙿𝚁𝙼𝙾✗, your fastest Assistant - alive and sparkling now! ✨\n\n┄┄┄┄┄┄┄┄┄┄┄\n`;
        participants.forEach(participant => {
            messageText += `🔖 @${participant.id.split('@')[0]}\n`; // Add \n for new line
        });

        // Send message with mentions
                await sock.sendMessage(chatId, {
            react: { text: '🔊', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: messageText,
            mentions: participants.map(p => p.id)
        });

    } catch (error) {
        console.error('𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚝𝚊𝚐𝚊𝚕𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚝𝚊𝚐 𝚊𝚕𝚕 𝚖𝚎𝚖𝚋𝚎𝚛𝚜...' });
    }
}

module.exports = tagAllCommand;  // Export directly
