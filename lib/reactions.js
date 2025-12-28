const fs = require('fs');
const path = require('path');

// Dynamic emoji
const commandEmojis = [
    '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇',
    '🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚',
    '😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥳',
    '😏','😶','😐','😑','😒','🙄','😬','🤥','😔','😕',
    '😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧',
    '😨','😰','😥','😢','😭','😱','😖','😣','😞','😓',
    '😩','😫','🥱','😤','😡','😠','🤬','🤯','😳','🥵',
    '🥶','😶‍🌫️','😵','😵‍💫','😷','🤒','🤕','🤢','🤮','🤧',
    '😇','🥰','😍','🤩','😘','😗','😙','😚','😋','😛',
    '😝','😜','🤪','🤨','🧐','🤓','😎','🥳','😏','😶',
    '🙃','🙂','😺','😸','😹','😻','😼','😽','🙀','😿',
    '😾','👹','👺','💀','👻','👽','🤖','🎃','😺','😸',
    '😹','😻','😼','😽','🙀','😿','😾','😼','🤡','👶'
];

// Path for storing auto-reaction state
const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// Load auto-reaction state from file
function loadAutoReactionState() {
    try {
        if (fs.existsSync(USER_GROUP_DATA)) {
            const data = JSON.parse(fs.readFileSync(USER_GROUP_DATA, 'utf-8'));
            return data.autoReaction || false;
        }
    } catch (error) {
        console.error('Error loading auto-reaction state:', error);
    }
    return false;
}

// Save auto-reaction state to file
function saveAutoReactionState(state) {
    try {
        const data = fs.existsSync(USER_GROUP_DATA)
            ? JSON.parse(fs.readFileSync(USER_GROUP_DATA, 'utf-8'))
            : { groups: [], chatbot: {} };

        data.autoReaction = state;
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving auto-reaction state:', error);
    }
}

// Store auto-reaction state
let isAutoReactionEnabled = loadAutoReactionState();

// Random emoji picker
function getRandomEmoji() {
    return commandEmojis[Math.floor(Math.random() * commandEmojis.length)];
}

// Function to add reaction to a command message
async function addCommandReaction(sock, message) {
    try {
        if (!isAutoReactionEnabled || !message?.key?.id) return;

        const emoji = getRandomEmoji();
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (error) {
        console.error('Error adding command reaction:', error);
    }
}

// Function to handle areact command
async function handleAreactCommand(sock, chatId, message, isOwner) {
    try {
        if (!isOwner) {
            await sock.sendMessage(chatId, {
                react: { text: '☺️', key: message.key },
                text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛...',
                quoted: message
            });
            return;
        }

        const args = message.message?.conversation?.split(' ') || [];
        const action = args[1]?.toLowerCase();

        if (action === 'on') {
            isAutoReactionEnabled = true;
            saveAutoReactionState(true);
            await sock.sendMessage(chatId, {
                react: { text: '📬', key: message.key },
                text: '✅ 𝙰𝚞𝚝𝚘 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜 𝚑𝚊𝚟𝚎 𝚋𝚎𝚎𝚗 𝚎𝚗𝚊𝚋𝚕𝚎𝚍 𝚐𝚕𝚘𝚋𝚊𝚕𝚕𝚢...',
                quoted: message
            });
        } else if (action === 'off') {
            isAutoReactionEnabled = false;
            saveAutoReactionState(false);
            await sock.sendMessage(chatId, {
                react: { text: '📬', key: message.key },
                text: '✅ 𝙰𝚞𝚝𝚘 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜 𝚑𝚊𝚟𝚎 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍 𝚐𝚕𝚘𝚋𝚊𝚕𝚕𝚢...',
                quoted: message
            });
        } else {
            const currentState = isAutoReactionEnabled ? 'enabled' : 'disabled';
            await sock.sendMessage(chatId, {
                react: { text: '💜', key: message.key },
                text: `✨ 𝙰𝚞𝚝𝚘-𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜 𝚊𝚛𝚎 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 ${currentState} 𝚐𝚕𝚘𝚋𝚊𝚕𝚕𝚢...\n\n𝚄𝚜𝚎:\n01. .𝚊𝚛𝚎𝚊𝚌𝚝 𝚘𝚗 - 𝙴𝚗𝚊𝚋𝚕𝚎 𝚊𝚞𝚝𝚘 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜\n02. .𝚊𝚛𝚎𝚊𝚌𝚝 𝚘𝚏𝚏 - 𝙳𝚒𝚜𝚊𝚋𝚎 𝚊𝚞𝚝𝚘 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                quoted: message
            });
        }
    } catch (error) {
        console.error('Error handling areact command:', error);
        await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key },
            text: '⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚌𝚘𝚗𝚝𝚛𝚘𝚕𝚕𝚒𝚗𝚐 𝚊𝚞𝚝𝚘-𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜...',
            quoted: message
        });
    }
}

module.exports = {
    addCommandReaction,
    handleAreactCommand
};