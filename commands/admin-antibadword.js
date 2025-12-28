const { handleAntiBadwordCommand } = require('../lib/antibadword');
const isAdminHelper = require('../lib/isAdmin');

async function antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin) {
    try {
        if (!isSenderAdmin) {
                await sock.sendMessage(chatId, {
            react: { text: '🔕', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❕ 𝙵𝚘𝚛 𝙶𝚛𝚘𝚞𝚙 𝙰𝚍𝚖𝚒𝚗𝚐 𝙾𝚗𝚕𝚢...' }, { quoted: message });
            return;
        }

        // Extract match from message
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const match = text.split(' ').slice(1).join(' ');

        await handleAntiBadwordCommand(sock, chatId, message, match);
    } catch (error) {
        console.error('⁉️ 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚊𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚌𝚘𝚖𝚖𝚊𝚗𝚍:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚊𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍...' }, { quoted: message });
    }
}

module.exports = antibadwordCommand; 