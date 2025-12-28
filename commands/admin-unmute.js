async function unmuteCommand(sock, chatId) {
    await sock.groupSettingUpdate(chatId, 'not_announcement'); // Unmute the group
            await sock.sendMessage(chatId, {
            react: { text: '📨', key: message.key }
        });
    await sock.sendMessage(chatId, { text: '🔔 𝚃𝚑𝚎 𝚐𝚛𝚘𝚞𝚙 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚞𝚗𝚖𝚞𝚝𝚎𝚍...' });
}

module.exports = unmuteCommand;
