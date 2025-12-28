async function resetlinkCommand(sock, chatId, senderId, message) {
    try {
        const groupMetadata = await sock.groupMetadata(chatId);

        const admins = groupMetadata.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);

        const isAdmin = admins.includes(senderId);

        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = admins.includes(botId);

        if (!isAdmin) {
            await sock.sendMessage(chatId, {
                react: { text: '🤭', key: message.key }
            });
            await sock.sendMessage(chatId, {
                text: '❕ 𝙾𝚗𝚕𝚢 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍...'
            });
            return;
        }

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                react: { text: '😪', key: message.key }
            });
            await sock.sendMessage(chatId, {
                text: '❕ 𝙱𝚘𝚝 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚕𝚒𝚗𝚔...'
            });
            return;
        }

        // 🔥 Reset link
        await sock.groupRevokeInvite(chatId);

        // 🔥 Get new link
        const newCode = await sock.groupInviteCode(chatId);

        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

        await sock.sendMessage(chatId, {
            text: `*🔰 𝙶𝚁𝙾𝚄𝙿 𝙻𝙸𝙽𝙺 𝚁𝙴𝚂𝙴𝚃🔰*\n\n┄┄┄┄┄┄┄┄┄\n🪁 𝙶𝚛𝚘𝚞𝚙 𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚛𝚎𝚜𝚎𝚝...\n┄┄┄┄┄┄┄┄┄\n🆕 𝙽𝚎𝚠 𝙻𝚒𝚗𝚔:\nhttps://chat.whatsapp.com/${newCode}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`
        });

    } catch (error) {
        console.error('Error in resetlink command:', error);

        await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });

        await sock.sendMessage(chatId, {
            text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚕𝚒𝚗𝚔...'
        });
    }
}

module.exports = resetlinkCommand;