const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

// Path to store the configuration
const configPath = path.join(__dirname, '..', 'data', 'autotyping.json');

// Initialize configuration file if it doesn't exist
function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
    }
    return JSON.parse(fs.readFileSync(configPath));
}

// Toggle autotyping feature
async function autotypingCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!message.key.fromMe && !isOwner) {
                await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            await sock.sendMessage(chatId, {
                text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛...',
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
                    text: '❗ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚘𝚙𝚝𝚒𝚘𝚗... 𝚄𝚜𝚎: .autotyping on/off\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ',
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
            text: `*🎈 𝙰𝚄𝚃𝙾 𝚃𝚈𝙿𝙸𝙽𝙶 🎈*\n\n┄┄┄┄┄┄┄┄┄┄\n💬 𝙰𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 *${config.enabled ? 'enabled' : 'disabled'}*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
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
        console.error('❗ 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚊𝚞𝚝𝚘𝚝𝚢𝚙𝚒𝚗𝚐...', error);
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

// Function to check if autotyping is enabled
function isAutotypingEnabled() {
    try {
        const config = initConfig();
        return config.enabled;
    } catch (error) {
        console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚌𝚑𝚎𝚌𝚔𝚒𝚗𝚐 𝚊𝚞𝚝𝚘𝚝𝚢𝚙𝚒𝚗𝚐 𝚜𝚝𝚊𝚝𝚞𝚜:', error);
        return false;
    }
}

// Function to handle autotyping for regular messages
async function handleAutotypingForMessage(sock, chatId, userMessage) {
    if (isAutotypingEnabled()) {
        try {
            // First subscribe to presence updates for this chat
            await sock.presenceSubscribe(chatId);
            
            // Send available status first
            await sock.sendPresenceUpdate('available', chatId);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Then send the composing status
            await sock.sendPresenceUpdate('composing', chatId);
            
            // Simulate typing time based on message length with increased minimum time
            const typingDelay = Math.max(3000, Math.min(8000, userMessage.length * 150));
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            // Send composing again to ensure it stays visible
            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Finally send paused status
            await sock.sendPresenceUpdate('paused', chatId);
            
            return true; // Indicates typing was shown
        } catch (error) {
            console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚝𝚢𝚙𝚒𝚗𝚐 𝚒𝚗𝚍𝚒𝚌𝚊𝚝𝚘𝚛:', error);
            return false; // Indicates typing failed
        }
    }
    return false; // Autotyping is disabled
}

// Function to handle autotyping for commands - BEFORE command execution (not used anymore)
async function handleAutotypingForCommand(sock, chatId) {
    if (isAutotypingEnabled()) {
        try {
            // First subscribe to presence updates for this chat
            await sock.presenceSubscribe(chatId);
            
            // Send available status first
            await sock.sendPresenceUpdate('available', chatId);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Then send the composing status
            await sock.sendPresenceUpdate('composing', chatId);
            
            // Keep typing indicator active for commands with increased duration
            const commandTypingDelay = 3000;
            await new Promise(resolve => setTimeout(resolve, commandTypingDelay));
            
            // Send composing again to ensure it stays visible
            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Finally send paused status
            await sock.sendPresenceUpdate('paused', chatId);
            
            return true; // Indicates typing was shown
        } catch (error) {
            console.error('❌ Error sending command typing indicator:', error);
            return false; // Indicates typing failed
        }
    }
    return false; // Autotyping is disabled
}

// Function to show typing status AFTER command execution
async function showTypingAfterCommand(sock, chatId) {
    if (isAutotypingEnabled()) {
        try {
            // This function runs after the command has been executed and response sent
            // So we just need to show a brief typing indicator
            
            // Subscribe to presence updates
            await sock.presenceSubscribe(chatId);
            
            // Show typing status briefly
            await sock.sendPresenceUpdate('composing', chatId);
            
            // Keep typing visible for a short time
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Then pause
            await sock.sendPresenceUpdate('paused', chatId);
            
            return true;
        } catch (error) {
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
            console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚙𝚘𝚜𝚝 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚝𝚢𝚙𝚒𝚗𝚐 𝚒𝚗𝚍𝚒𝚌𝚊𝚝𝚘𝚛:', error);
            return false;
        }
    }
    return false; // Autotyping is disabled
}

module.exports = {
    autotypingCommand,
    isAutotypingEnabled,
    handleAutotypingForMessage,
    handleAutotypingForCommand,
    showTypingAfterCommand
};