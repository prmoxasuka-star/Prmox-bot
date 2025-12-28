const { setAntitag, getAntitag, removeAntitag } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

async function handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
    try {
        if (!isSenderAdmin) {
                await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '❕ 𝙾𝚗𝚕𝚢 𝚊𝚍𝚖𝚒𝚗 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚎 𝚊𝚗𝚝𝚒𝚝𝚊𝚐...' },{quoted :message});
            return;
        }

        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            const usage = `*🪼 𝙰𝙽𝚃𝙸𝚃𝙰𝙶 𝚂𝙴𝚃𝚄𝙿 🪼*\n\n┄┄┄┄┄┄┄┄┄┄\n01. ${prefix}𝚊𝚗𝚝𝚒𝚝𝚊𝚐 𝚘𝚗\n02. ${prefix}𝚊𝚗𝚝𝚒𝚝𝚊𝚐 𝚘𝚏𝚏\n03. ${prefix}𝚊𝚗𝚝𝚒𝚝𝚊𝚐 𝚜𝚎𝚝 𝚍𝚎𝚕𝚎𝚝𝚎/𝚔𝚒𝚌𝚔\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;
                    await sock.sendMessage(chatId, {
            react: { text: '🫧', key: message.key }
        });
            await sock.sendMessage(chatId, { text: usage },{quoted :message});
            return;
        }

        switch (action) {
            case 'on':
                const existingConfig = await getAntitag(chatId, 'on');
                if (existingConfig?.enabled) {
                        await sock.sendMessage(chatId, {
            react: { text: '🫧', key: message.key }
        });
                    await sock.sendMessage(chatId, { text: '☘️ 𝙰𝚗𝚝𝚒𝚝𝚊𝚐 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚗...' },{quoted :message});
                    return;
                }
                const result = await setAntitag(chatId, 'on', 'delete');
                        await sock.sendMessage(chatId, {
            react: { text: '🫧', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: result ? '☘️ 𝙰𝚗𝚝𝚒𝚝𝚊𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝚘𝚗...' : '❕ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚝𝚞𝚛𝚗 𝚘𝚗 𝙰𝚗𝚝𝚒𝚝𝚊𝚐' 
                },{quoted :message});
                break;

            case 'off':
                await removeAntitag(chatId, 'on');
                        await sock.sendMessage(chatId, {
            react: { text: '🫧', key: message.key }
        });
                await sock.sendMessage(chatId, { text: '☘️ 𝙰𝚗𝚝𝚒𝚝𝚊𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏...' },{quoted :message});
                break;

            case 'set':
                if (args.length < 2) {
                        await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
                    await sock.sendMessage(chatId, { 
                        text: `❗𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚙𝚎𝚌𝚒𝚏𝚢 𝚊𝚗 𝚊𝚌𝚝𝚒𝚘𝚗: ${prefix}𝚊𝚗𝚝𝚒𝚝𝚊𝚐 𝚜𝚎𝚝 𝚍𝚎𝚕𝚎𝚝𝚎 𝚘𝚛 𝚔𝚒𝚌𝚔` 
                    },{quoted :message});
                    return;
                }
                const setAction = args[1];
                if (!['delete', 'kick'].includes(setAction)) {
                        await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
                    await sock.sendMessage(chatId, { 
                        text: '❗ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚌𝚝𝚒𝚘𝚗...' 
                    },{quoted :message});
                    return;
                }
                const setResult = await setAntitag(chatId, 'on', setAction);
                        await sock.sendMessage(chatId, {
            react: { text: '🫧', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: setResult ? `☘️ 𝙰𝚗𝚝𝚒𝚝𝚊𝚐 𝚊𝚌𝚒𝚝𝚘𝚗 𝚜𝚎𝚝 𝚝𝚘 ${setAction}` : '❕ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚜𝚎𝚝 𝙰𝚗𝚝𝚒𝚝𝚊𝚐 𝚊𝚌𝚝𝚒𝚘𝚗' 
                },{quoted :message});
                break;

            case 'get':
                const status = await getAntitag(chatId, 'on');
                const actionConfig = await getAntitag(chatId, 'on');
                        await sock.sendMessage(chatId, {
            react: { text: '🫧', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: `*⚔️ 𝙰𝙽𝚃𝙸𝚃𝙰𝙶 𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝚃𝙸𝙾𝙽 ⚔️*\n\n📑 𝚂𝚝𝚊𝚝𝚞𝚜: ${status ? 'ON' : 'OFF'}\n💣 𝙰𝚌𝚝𝚒𝚘𝚗: ${actionConfig ? actionConfig.action : 'Not set'}` 
                },{quoted :message});
                break;

            default:
                    await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
                await sock.sendMessage(chatId, { text: `𝚄𝚜𝚎: ${prefix}𝚊𝚗𝚝𝚒𝚝𝚊𝚐 𝚏𝚘𝚛 𝚞𝚜𝚊𝚐𝚎...` },{quoted :message});
        }
    } catch (error) {
        console.error('Error in antitag command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚊𝚗𝚝𝚒𝚝𝚊𝚐 𝚌𝚘𝚖𝚖𝚊𝚗𝚍...' },{quoted :message});
    }
}

async function handleTagDetection(sock, chatId, message, senderId) {
    try {
        const antitagSetting = await getAntitag(chatId, 'on');
        if (!antitagSetting || !antitagSetting.enabled) return;

        // Get mentioned JIDs from contextInfo (proper mentions)
        const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        // Extract text from all possible message types
        const messageText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            ''
        );

        // Find all @mentions in text using improved regex
        // Matches: @123456789, @⁨+94 76 948 4004.
        const textMentions = messageText.match(/@[\d+\s\-()~.]+/g) || [];
        
        // Also match numeric-only
        const numericMentions = messageText.match(/@\d{10,}/g) || [];
        
        // Combine all mentions and remove duplicates
        const allMentions = [...new Set([...mentionedJids, ...textMentions, ...numericMentions])];
        
        // Count unique numeric mentions (bot tagall patterns)
        const uniqueNumericMentions = new Set();
        numericMentions.forEach(mention => {
            const numMatch = mention.match(/@(\d+)/);
            if (numMatch) uniqueNumericMentions.add(numMatch[1]);
        });
        
        // Count mentions from mentionedJid array (proper WhatsApp mentions)
        const mentionedJidCount = mentionedJids.length;
        
        // Count unique numeric mentions found in text (bot tagall pattern)
        const numericMentionCount = uniqueNumericMentions.size;
        
        // Use the higher count (either proper mentions or text-based mentions)
        // This ensures we catch both standard mentions and bot tagall patterns
        const totalMentions = Math.max(mentionedJidCount, numericMentionCount);

        // Check if it's a group message and has multiple mentions
        if (totalMentions >= 3) {
            // Get group participants to check if it's tagging most/all members
            const groupMetadata = await sock.groupMetadata(chatId);
            const participants = groupMetadata.participants || [];
            
            // If mentions are more than 50% of group members, consider it as tagall
            const mentionThreshold = Math.ceil(participants.length * 0.5);
            
            // Also check if there are many numeric mentions in the text (bot tagall pattern)
            // This catches bots that use numeric IDs instead of proper mentions
            const hasManyNumericMentions = numericMentionCount >= 10 || 
                                          (numericMentionCount >= 5 && numericMentionCount >= mentionThreshold);
            
            // Trigger if: standard mentions exceed threshold OR many numeric mentions detected
            if (totalMentions >= mentionThreshold || hasManyNumericMentions) {
                
                const action = antitagSetting.action || 'delete';
                
                if (action === 'delete') {
                    // Delete the message
                    await sock.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: false,
                            id: message.key.id,
                            participant: senderId
                        }
                    });
                    
                    // Send warning
                    await sock.sendMessage(chatId, {
                        text: `⚠️ 𝙰𝙽𝚃𝙸𝚃𝙰𝙶 𝙳𝙴𝚃𝙴𝙲𝚃𝙴𝙳`
                    }, { quoted: message });
                    
                } else if (action === 'kick') {
                    // First delete the message
                    await sock.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: false,
                            id: message.key.id,
                            participant: senderId
                        }
                    });

                    // Then kick the user
                    await sock.groupParticipantsUpdate(chatId, [senderId], "remove");

                    // Send notification
                    const usernames = [`@${senderId.split('@')[0]}`];
                    await sock.sendMessage(chatId, {
                        text: `*🚫 𝙰𝙽𝚃𝙸𝚃𝙰𝙶 𝙳𝙴𝚃𝙴𝙲𝚃𝙴𝙳 🚫*\n\n┄┄┄┄┄┄┄┄┄┄\n🐤 ${usernames.join(', ')} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚔𝚒𝚌𝚔𝚎𝚍 𝚏𝚘𝚛 𝚝𝚊𝚐𝚐𝚒𝚗𝚐 𝚊𝚕𝚕 𝚖𝚎𝚖𝚋𝚎𝚛𝚜...\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                        mentions: [senderId]
                    }, { quoted: message });
                }
            }
        }
    } catch (error) {
        console.error('Error in tag detection:', error);
    }
}

module.exports = {
    handleAntitagCommand,
    handleTagDetection
};

