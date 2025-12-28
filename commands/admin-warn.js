const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');

// Define paths
const databaseDir = path.join(process.cwd(), 'data');
const warningsPath = path.join(databaseDir, 'warnings.json');

// Initialize warnings file if it doesn't exist
function initializeWarningsFile() {
    // Create database directory if it doesn't exist
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir, { recursive: true });
    }
    
    // Create warnings.json if it doesn't exist
    if (!fs.existsSync(warningsPath)) {
        fs.writeFileSync(warningsPath, JSON.stringify({}), 'utf8');
    }
}

async function warnCommand(sock, chatId, senderId, mentionedJids, message) {
    try {
        // Initialize files first
        initializeWarningsFile();

        // First check if it's a group
        if (!chatId.endsWith('@g.us')) {
                await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
            await sock.sendMessage(chatId, { 
                text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙...'
            });
            return;
        }

        // Check admin status first
        try {
            const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
            
            if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚜 𝚖𝚊𝚔𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚏𝚒𝚛𝚜𝚝 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍...'
                });
                return;
            }

            if (!isSenderAdmin) {
                    await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: '❕ 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍...'
                });
                return;
            }
        } catch (adminError) {
            console.error('Error checking admin status:', adminError);
                    await sock.sendMessage(chatId, {
            react: { text: '🧤', key: message.key }
        });
            await sock.sendMessage(chatId, { 
                text: '❗ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚒𝚜 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚘𝚏 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙...'
            });
            return;
        }

        let userToWarn;
        
        // Check for mentioned users
        if (mentionedJids && mentionedJids.length > 0) {
            userToWarn = mentionedJids[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToWarn = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToWarn) {
            await sock.sendMessage(chatId, { 
                text: '❌ 𝙴𝚛𝚛𝚘𝚛: Please mention the user or reply to their message to warn!'
            });
            return;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Read warnings, create empty object if file is empty
            let warnings = {};
            try {
                warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
            } catch (error) {
                warnings = {};
            }

            // Initialize nested objects if they don't exist
            if (!warnings[chatId]) warnings[chatId] = {};
            if (!warnings[chatId][userToWarn]) warnings[chatId][userToWarn] = 0;
            
            warnings[chatId][userToWarn]++;
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

            const warningMessage = `*⚔️ 𝚆𝙰𝚁𝙽𝙸𝙽𝙶 𝙼𝙰𝚂𝚂𝙴𝙶𝙴 ⚔️*\n\n` +
                `👤 𝚆𝚊𝚛𝚗𝚎𝚍 𝚞𝚜𝚎𝚛: @${userToWarn.split('@')[0]}\n` +
                `⚠️ 𝚆𝚊𝚛𝚗𝚒𝚗𝚐 𝚌𝚘𝚞𝚗𝚝: ${warnings[chatId][userToWarn]}/3\n` +
                `👑 𝚠𝚊𝚛𝚗𝚎𝚍 𝚋𝚢: @${senderId.split('@')[0]}\n\n` +
                `📅 𝙳𝚊𝚝𝚎: ${new Date().toLocaleString()}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;

            await sock.sendMessage(chatId, { 
                text: warningMessage,
                mentions: [userToWarn, senderId]
            });
        await sock.sendMessage(chatId, {
            react: { text: '💫', key: message.key }
        });
            // Auto-kick after 3 warnings
            if (warnings[chatId][userToWarn] >= 3) {
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

                await sock.groupParticipantsUpdate(chatId, [userToWarn], "remove");
                delete warnings[chatId][userToWarn];
                fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));
                
                const kickMessage = `*⚔️ 𝙰𝚄𝚃𝙾 𝙺𝙸𝙲𝙺 ⚔️*\n\n` +
                    `⚠️ @${userToWarn.split('@')[0]} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚛𝚎𝚖𝚘𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙 𝚊𝚏𝚝𝚎𝚛 𝚛𝚎𝚌𝚎𝚒𝚟𝚒𝚗𝚐 3 𝚠𝚊𝚛𝚗𝚒𝚗𝚐𝚜...\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;

                await sock.sendMessage(chatId, { 
                    text: kickMessage,
                    mentions: [userToWarn]
                });
            }
        } catch (error) {
            console.error('Error in warn command:', error);
                    await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
            await sock.sendMessage(chatId, { 
                text: '❗ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚠𝚊𝚛𝚗 𝚞𝚜𝚎𝚛...'
            });
        }
    } catch (error) {
        console.error('Error in warn command:', error);
        if (error.data === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                    await sock.sendMessage(chatId, {
            react: { text: '🫩', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: '❗ 𝚁𝚊𝚝𝚎 𝚕𝚒𝚖𝚒𝚝 𝚛𝚎𝚊𝚌𝚑𝚎𝚍., 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 𝚊 𝚏𝚎𝚠 𝚜𝚎𝚌𝚘𝚗𝚍𝚜...'
                });
            } catch (retryError) {
                console.error('Error sending retry message:', retryError);
            }
        } else {
            try {
                    await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚠𝚊𝚛𝚗 𝚞𝚜𝚎𝚛., 𝙼𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚒𝚜 𝚊𝚍𝚖𝚒𝚗 𝚊𝚗𝚍 𝚑𝚊𝚜 𝚜𝚞𝚏𝚏𝚒𝚌𝚒𝚎𝚗𝚝 𝚙𝚎𝚛𝚖𝚒𝚜𝚜𝚒𝚘𝚗𝚜...'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = warnCommand;
