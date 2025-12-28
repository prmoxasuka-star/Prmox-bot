const isAdmin = require('../lib/isAdmin');

async function tagNotAdminCommand(sock, chatId, senderId, message) {
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
            await sock.sendMessage(chatId, { text: '❕ 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚎 𝚝𝚊𝚐 𝚗𝚘𝚝 𝚊𝚍𝚖𝚒𝚗𝚜...' }, { quoted: message });
            return;
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];

        const nonAdmins = participants.filter(p => !p.admin).map(p => p.id);
        if (nonAdmins.length === 0) {
                await sock.sendMessage(chatId, {
            react: { text: '🐋', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '𝙽𝚘 𝚗𝚘𝚗-𝚊𝚍𝚖𝚒𝚗 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 𝚝𝚘 𝚝𝚊𝚐....' }, { quoted: message });
            return;
        }

        let text = '📢 𝙳𝚎𝚊𝚛 𝚗𝚘𝚗 𝚊𝚍𝚖𝚒𝚗𝚜...👋\n\n┄┄┄┄┄┄┄┄┄\n';
        nonAdmins.forEach(jid => {
            text += `🔖 @${jid.split('@')[0]}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;
        });
        await sock.sendMessage(chatId, {
            react: { text: '🔊', key: message.key }
        });
        await sock.sendMessage(chatId, { text, mentions: nonAdmins }, { quoted: message });
    } catch (error) {
        console.error('𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚝𝚊𝚐 𝚗𝚘𝚝 𝚊𝚍𝚖𝚒𝚗 𝚌𝚘𝚖𝚖𝚊𝚗𝚍:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚝𝚊𝚐 𝚗𝚘𝚗-𝚊𝚍𝚖𝚒𝚗 𝚖𝚎𝚖𝚋𝚎𝚛𝚜...' }, { quoted: message });
    }
}

module.exports = tagNotAdminCommand;


