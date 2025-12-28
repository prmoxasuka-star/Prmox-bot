const { setAntiBadword, getAntiBadword, removeAntiBadword, incrementWarningCount, resetWarningCount } = require('../lib/index');
const fs = require('fs');
const path = require('path');

// Load antibadword config
function loadAntibadwordConfig(groupId) {
    try {
        const configPath = path.join(__dirname, '../data/userGroupData.json');
        if (!fs.existsSync(configPath)) {
            return {};
        }
        const data = JSON.parse(fs.readFileSync(configPath));
        return data.antibadword?.[groupId] || {};
    } catch (error) {
        console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝚊𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚌𝚘𝚗𝚏𝚒𝚐:', error.message);
        return {};
    }
}

async function handleAntiBadwordCommand(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            react: { text: '📬', key: message.key },
            text: `*🗑️ 𝙰𝙽𝚃𝙸𝙱𝙰𝙳𝚆𝙾𝚁𝙳 𝚂𝙴𝚃𝚄𝙿 🗑️*\n\n┄┄┄┄┄┄┄┄┄┄┄┄\n01 .𝚊𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚘𝚗\n02. .𝚊𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚘𝚏𝚏\n03. .𝚊𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚜𝚎𝚝 𝚍𝚎𝚕𝚎𝚝𝚎/𝚠𝚊𝚛𝚗 𝚘𝚛 𝚔𝚒𝚌𝚔\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`
        }, { quoted: message });
    }

    if (match === 'on') {
        const existingConfig = await getAntiBadword(chatId, 'on');
        if (existingConfig?.enabled) {
            return sock.sendMessage(chatId, { 
                   react: { text: '⚔️', key: message.key },
                   text: '💣 𝙰𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚎𝚗𝚊𝚋𝚕𝚎𝚍 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙...' });
        }
        await setAntiBadword(chatId, 'on', 'delete');
        return sock.sendMessage(chatId, { 
               react: { text: '💫', key: message.key },
               text: ' 𝙰𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚎𝚗𝚊𝚋𝚕𝚎𝚍. 𝚞𝚜𝚎 𝚊𝚗𝚝𝚒𝚌𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚜𝚎𝚝 𝚍𝚎𝚕𝚎𝚝𝚎/𝚠𝚊𝚛𝚗 𝚘𝚛 𝚔𝚒𝚌𝚔 𝚝𝚘 𝚌𝚞𝚜𝚝𝚘𝚖𝚒𝚣𝚎 𝚊𝚌𝚝𝚒𝚘𝚗 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗...' }, { quoted: message });
    }

    if (match === 'off') {
        const config = await getAntiBadword(chatId, 'on');
        if (!config?.enabled) {
            return sock.sendMessage(chatId, { 
             react: { text: '📬', key: message.key },
            text: '☘️ 𝙰𝚗𝚝𝚒𝙱𝚊𝚍𝚠𝚘𝚛 𝚍 𝚒𝚜 𝚊𝚕𝚛𝚎𝚍𝚢 𝚍𝚒𝚜𝚊𝚋𝚕𝚎 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙...' }, { quoted: message } );
        }
        await removeAntiBadword(chatId);
        return sock.sendMessage(chatId, { 
               react: { text: '📬', key: message.key },
               text: '☘️ 𝙰𝚗𝚝𝚒𝙱𝚊𝚍𝚠𝚘𝚛𝚍 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙...' }, { quoted: message } );
    }

    if (match.startsWith('set')) {
        const action = match.split(' ')[1];
        if (!action || !['delete', 'kick', 'warn'].includes(action)) {
            return sock.sendMessage(chatId, {    
            react: { text: '🥴', key: message.key },
            text: '*❗ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚌𝚝𝚒𝚘𝚗...' }, { quoted: message } );
        }
        await setAntiBadword(chatId, 'on', action);
        return sock.sendMessage(chatId, { text: `*🗑️ 𝙰𝙽𝚃𝙸𝙱𝙰𝙳𝚆𝙾𝚁𝙳 𝙰𝙲𝚃𝙸𝙾𝙽 🗑️*\n\n┄┄┄┄┄┄┄┄┄┄┄\n📑 𝙰𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚊𝚌𝚝𝚒𝚘𝚗 𝚜𝚎𝚝 𝚝𝚘: *${action}*` }, { quoted: message } );
    }

    return sock.sendMessage(chatId, { text: '❗ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚌𝚝𝚒𝚘𝚗...' }, { quoted: message } );
}

async function handleBadwordDetection(sock, chatId, message, userMessage, senderId) {
    const config = loadAntibadwordConfig(chatId);
    if (!config.enabled) return;

    // Skip if not group
    if (!chatId.endsWith('@g.us')) return;

    // Skip if message is from bot
    if (message.key.fromMe) return;

    // Get antibadword config first
    const antiBadwordConfig = await getAntiBadword(chatId, 'on');
    if (!antiBadwordConfig?.enabled) {
        console.log('❗ 𝙰𝚗𝚝𝚒𝚋𝚊𝚍𝚠𝚘𝚛𝚍 𝚗𝚘𝚝 𝚎𝚗𝚊𝚋𝚕𝚎𝚍 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙...');
        return;
    }

    // Convert message to lowercase and clean it
    const cleanMessage = userMessage.toLowerCase()
        .replace(/[^\w\s]/g, ' ')  // Replace special chars with space
        .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
        .trim();

    // List of bad words
    const badWords = [
         'huththo', 'hutto', 'http', 'pakaya', 'fucker', 'pkya', 
        'ponnya', 'kariya', 'basikaya', 'hukanna', 'huththa', 'fuck', 
        'xxx', 'rena maga puk', 'pornhub', 'fuk', 'sex'
    ];
    
    // Split message into words
    const messageWords = cleanMessage.split(' ');
    let containsBadWord = false;

    // Check for exact word matches only
    for (const word of messageWords) {
        // Skip empty words or very short words
        if (word.length < 2) continue;

        // Check if this word exactly matches any bad word
        if (badWords.includes(word)) {
            containsBadWord = true;
            break;
        }

        // Also check for multi-word bad words
        for (const badWord of badWords) {
            if (badWord.includes(' ')) {  // Multi-word bad phrase
                if (cleanMessage.includes(badWord)) {
                    containsBadWord = true;
                    break;
                }
            }
        }
        if (containsBadWord) break;
    }

    if (!containsBadWord) return;

   // console.log('Bad word detected in:', userMessage);

    // Check if bot is admin before taking action
    const groupMetadata = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = groupMetadata.participants.find(p => p.id === botId);
    if (!bot?.admin) {
       // console.log('Bot is not admin, cannot take action');
        return;
    }

    // Check if sender is admin
    const participant = groupMetadata.participants.find(p => p.id === senderId);
    if (participant?.admin) {
        //console.log('Sender is admin, skipping action');
        return;
    }

    // Delete message immediately
    try {
        await sock.sendMessage(chatId, { 
            delete: message.key
        });
        //console.log('Message deleted successfully');
    } catch (err) {
        console.error('Error deleting message:', err);
        return;
    }

    // Take action based on config
    switch (antiBadwordConfig.action) {
        case 'delete':
            await sock.sendMessage(chatId, {
                text: `💣 @${senderId.split('@')[0]} 𝚋𝚊𝚍 𝚠𝚘𝚛𝚍 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚊𝚕𝚕𝚘𝚠𝚎𝚍 𝚑𝚎𝚛𝚎...\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                mentions: [senderId]
            });
            break;

        case 'kick':
            try {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, {
                    text: `🐤 @${senderId.split('@')[0]} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚔𝚒𝚌𝚔𝚎𝚍 𝚏𝚘𝚛 𝚞𝚜𝚒𝚗𝚐 𝚋𝚊𝚍 𝚠𝚘𝚛𝚍𝚜...\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ.`,
                    mentions: [senderId]
                });
            } catch (error) {
                console.error('Error kicking user:', error);
            }
            break;

        case 'warn':
            const warningCount = await incrementWarningCount(chatId, senderId);
            if (warningCount >= 3) {
                try {
                    await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                    await resetWarningCount(chatId, senderId);
                    await sock.sendMessage(chatId, {
                        text: `🐤 @${senderId.split('@')[0]} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚔𝚒𝚌𝚔𝚎𝚍 𝚊𝚏𝚝𝚎𝚛 3 𝚠𝚊𝚛𝚗𝚒𝚗𝚐𝚜...\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                        mentions: [senderId]
                    });
                } catch (error) {
                    console.error('Error kicking user after warnings:', error);
                }
            } else {
                await sock.sendMessage(chatId, {
                    text: `💣 @${senderId.split('@')[0]} 𝚠𝚊𝚛𝚗𝚒𝚗𝚐 warning ${warningCount}/3 𝚏𝚘𝚛 𝚞𝚜𝚒𝚗𝚐 𝚋𝚊𝚍 𝚠𝚘𝚛𝚍𝚜...`,
                    mentions: [senderId]
                });
            }
            break;
    }
}

module.exports = {
    handleAntiBadwordCommand,
    handleBadwordDetection
}; 