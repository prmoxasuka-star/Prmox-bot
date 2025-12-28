const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

// Path to store the configuration
const configPath = path.join(__dirname, '..', 'data', 'autoread.json');

// Initialize configuration file if it doesn't exist
function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
    }
    return JSON.parse(fs.readFileSync(configPath));
}

// Toggle autoread feature
async function autoreadCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!message.key.fromMe && !isOwner) {
                await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            await sock.sendMessage(chatId, {
                text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚋𝚕𝚎 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363423930246587@newsletter',
                        newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                        serverMessageId: -1
                    }
                }
            });
            return;
        }

        // Get command arguments
        const args = message.message?.conversation?.trim().split(' ').slice(1) || 
                    message.message?.extendedTextMessage?.text?.trim().split(' ').slice(1) || 
                    [];
        
        // Initialize or read config
        const config = initConfig();
        
        // Toggle based on argument or toggle current state if no argument
        if (args.length > 0) {
            const action = args[0].toLowerCase();
            if (action === 'on' || action === 'enable') {
                config.enabled = true;
            } else if (action === 'off' || action === 'disable') {
                config.enabled = false;
            } else {
                    await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
                await sock.sendMessage(chatId, {
                    text: '❗𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚘𝚙𝚝𝚒𝚘𝚗... 𝚄𝚜𝚎: .autoread on/off\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363423930246587@newsletter',
                            newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                            serverMessageId: -1
                        }
                    }
                });
                return;
            }
        } else {
            // Toggle current state
            config.enabled = !config.enabled;
        }
        
        // Save updated configuration
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        // Send confirmation message
                await sock.sendMessage(chatId, {
            react: { text: '📬', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: `*🎈 𝙰𝚄𝚃𝙾 𝚁𝙴𝙰𝙳 🎈*\n\n┄┄┄┄┄┄┄┄┄┄┄\n👀 𝙰𝚞𝚝𝚘 𝚛𝚎𝚊𝚍 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 *${config.enabled ? 'enabled' : 'disabled'}*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423930246587@newsletter',
                    newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                    serverMessageId: -1
                }
            }
        });
        
    } catch (error) {
        console.error('❗ 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚊𝚞𝚝𝚘𝚛𝚎𝚊𝚍 𝚌𝚘𝚖𝚖𝚊𝚗𝚍:', error);;
        await sock.sendMessage(chatId, {
            text: '⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐...',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423930246587@newsletter',
                    newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
                    serverMessageId: -1
                }
            }
        });
    }
}

// Function to check if autoread is enabled
function isAutoreadEnabled() {
    try {
        const config = initConfig();
        return config.enabled;
    } catch (error) {
        console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚌𝚑𝚎𝚌𝚔𝚒𝚗𝚐 𝚊𝚞𝚝𝚘𝚛𝚎𝚊𝚍 𝚜𝚝𝚊𝚝𝚞𝚜:', error);
        return false;
    }
}

// Function to check if bot is mentioned in a message
function isBotMentionedInMessage(message, botNumber) {
    if (!message.message) return false;
    
    // Check for mentions in contextInfo (works for all message types)
    const messageTypes = [
        'extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage',
        'documentMessage', 'audioMessage', 'contactMessage', 'locationMessage'
    ];
    
    // Check for explicit mentions in mentionedJid array
    for (const type of messageTypes) {
        if (message.message[type]?.contextInfo?.mentionedJid) {
            const mentionedJid = message.message[type].contextInfo.mentionedJid;
            if (mentionedJid.some(jid => jid === botNumber)) {
                return true;
            }
        }
    }
    
    // Check for text mentions in various message types
    const textContent = 
        message.message.conversation || 
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        message.message.videoMessage?.caption || '';
    
    if (textContent) {
        // Check for @mention format
        const botUsername = botNumber.split('@')[0];
        if (textContent.includes(`@${botUsername}`)) {
            return true;
        }
        
        // Check for bot name mentions (optional, can be customized)
        const botNames = [global.botname?.toLowerCase(), 'bot', 'prmox', 'ᴘʀᴍᴏ✗ ᴡᴇʙ'];
        const words = textContent.toLowerCase().split(/\s+/);
        if (botNames.some(name => words.includes(name))) {
            return true;
        }
    }
    
    return false;
}

// Function to handle autoread functionality
async function handleAutoread(sock, message) {
    if (isAutoreadEnabled()) {
        // Get bot's ID
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Check if bot is mentioned
        const isBotMentioned = isBotMentionedInMessage(message, botNumber);
        
        // If bot is mentioned, read the message internally but don't mark as read in UI
        if (isBotMentioned) {
            
            // We don't call sock.readMessages() here, so the message stays unread in the UI
            return false; // Indicates message was not marked as read
        } else {
            // For regular messages, mark as read normally
            const key = { remoteJid: message.key.remoteJid, id: message.key.id, participant: message.key.participant };
            await sock.readMessages([key]);
            //console.log('✅ Marked message as read from ' + (message.key.participant || message.key.remoteJid).split('@')[0]);
            return true; // Indicates message was marked as read
        }
    }
    return false; // Autoread is disabled
}

module.exports = {
    autoreadCommand,
    isAutoreadEnabled,
    isBotMentionedInMessage,
    handleAutoread
};