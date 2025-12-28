const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('../lib/index');

async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            react: { text: '👋', key: message.key },
            text: `*👋 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚂𝙴𝚃𝚄𝙿 👋*\n\n┄┄┄┄┄┄┄┄┄┄┄\n01. .𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚘𝚗 - 𝙴𝚗𝚊𝚋𝚕𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜\n02. .𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚘𝚏𝚏 - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜\n03. .𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚜𝚎𝚝 [𝚢𝚘𝚞𝚛 𝚌𝚞𝚜𝚝𝚘𝚖 𝚖𝚎𝚜𝚜𝚊𝚐𝚎]\n𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚅𝚊𝚛𝚒𝚊𝚋𝚕𝚎𝚜:\n* {user}\n* {group}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
            quoted: message
        });
    }

    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, {
                react: { text: '🔆', key: message.key },
                text: '⚠️ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚎𝚗𝚊𝚋𝚕𝚎𝚍*...',
                quoted: message
            });
        }
        await addWelcome(chatId, true, '𝚆𝚎𝚕𝚌𝚘𝚖𝚎 {user} 𝚝𝚘 {group}! 🎉');
        return sock.sendMessage(chatId, {
            react: { text: '🏷️', key: message.key },
            text: '✅ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚎𝚗𝚊𝚋𝚕𝚎𝚍*...',
            quoted: message
        });
    }

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, {
                react: { text: '💤', key: message.key },
                text: '⚠️ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍*...',
                quoted: message
            });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, {
            react: { text: '📬', key: message.key },
            text: '✅ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍*...',
            quoted: message
        });
    }

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, {
                react: { text: '❗', key: message.key },
                text: '⚠️ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚌𝚞𝚜𝚝𝚘𝚖 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎...',
                quoted: message
            });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, {
            react: { text: '📬', key: message.key },
            text: '✅ 𝙲𝚞𝚜𝚝𝚘𝚖 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚜𝚎𝚝 *𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢*...',
            quoted: message
        });
    }
}

async function handleGoodbye(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            react: { text: '👋', key: message.key },
            text: `*👋 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚂𝙴𝚃𝚄𝙿 👋*\n\n┄┄┄┄┄┄┄┄┄┄┄\n01. .𝚐𝚘𝚘𝚍𝚋𝚢𝚎 𝚘𝚗\n02. .𝚐𝚘𝚘𝚍𝚋𝚢𝚎 𝚘𝚏𝚏\n03. .𝚐𝚘𝚘𝚍𝚋𝚢𝚎 𝚜𝚎𝚝 [𝚖𝚎𝚜𝚜𝚊𝚐𝚎]\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
            quoted: message
        });
    }

    const lower = match.toLowerCase();

    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, {
                react: { text: '🔆', key: message.key },
                text: '⚠️ 𝙶𝚘𝚘𝚍𝚋𝚢𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚎𝚗𝚊𝚋𝚕𝚎𝚍*...',
                quoted: message
            });
        }
        await addGoodbye(chatId, true, 'Goodbye {user} 👋');
        return sock.sendMessage(chatId, {
            react: { text: '🏷️', key: message.key },
            text: '✅ 𝙶𝚘𝚘𝚍𝚋𝚢𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚎𝚗𝚊𝚋𝚕𝚎𝚍*...',
            quoted: message
        });
    }

    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, {
                react: { text: '💤', key: message.key },
                text: '⚠️ 𝙶𝚘𝚘𝚍𝚋𝚢𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍*...',
                quoted: message
            });
        }
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, {
            react: { text: '📬', key: message.key },
            text: '✅ 𝙶𝚘𝚘𝚍𝚋𝚢𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 *𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍*...',
            quoted: message
        });
    }

    if (lower.startsWith('set ')) {
        const customMessage = match.slice(4);
        await addGoodbye(chatId, true, customMessage);
        return sock.sendMessage(chatId, {
            react: { text: '📬', key: message.key },
            text: '✅ 𝙲𝚞𝚜𝚝𝚘𝚖 𝚐𝚘𝚘𝚍𝚋𝚢𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚜𝚎𝚝 *𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢*...',
            quoted: message
        });
    }
}

module.exports = { handleWelcome, handleGoodbye };