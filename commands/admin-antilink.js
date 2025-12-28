const { bots } = require('../lib/antilink');
const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

async function handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
    try {
        if (!isSenderAdmin) {
                await sock.sendMessage(chatId, {
            react: { text: '🤭', key: message.key }
        });
            await sock.sendMessage(chatId, { text:'❕ 𝙵𝚘𝚛 𝙶𝚛𝚘𝚞𝚙 𝙰𝚍𝚖𝚒𝚗𝚐 𝙾𝚗𝚕𝚢...' }, { quoted: message });
            return;
        }

        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            const usage = `*🔗 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝚂𝙴𝚃𝚄𝙿 🔗*\n\n┄┄┄┄┄┄┄┄┄┄\n01. ${prefix}𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚘𝚗\n02. ${prefix}𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚘𝚏𝚏\n03. ${prefix}𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚜𝚎𝚝 𝚠𝚊𝚛𝚗/𝚍𝚎𝚕𝚎𝚝𝚎 𝚘𝚛 𝚔𝚒𝚌𝚔\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;
            await sock.sendMessage(chatId, { text: usage }, { quoted: message });
            return;
        }

        switch (action) {
            case 'on':
                const existingConfig = await getAntilink(chatId, 'on');
                if (existingConfig?.enabled) {
                        await sock.sendMessage(chatId, {
            react: { text: '🔗', key: message.key }
        });
                    await sock.sendMessage(chatId, { text: '🍁 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚗' }, { quoted: message });
                    return;
                }
                const result = await setAntilink(chatId, 'on', 'delete');
                        await sock.sendMessage(chatId, {
            react: { text: '🔗', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: result ? '🍁 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝚘𝚗' : '🍁 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚝𝚞𝚛𝚗 𝚘𝚗 𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔' 
                },{ quoted: message });
                break;

            case 'off':
                    await sock.sendMessage(chatId, {
            react: { text: '⛓️‍💥', key: message.key }
        });
                await removeAntilink(chatId, 'on');
                await sock.sendMessage(chatId, { text: '🍁 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏' }, { quoted: message });
                break;

            case 'set':
                if (args.length < 2) {
                        await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
                    await sock.sendMessage(chatId, { 
                        text: `❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚙𝚎𝚌𝚒𝚏𝚢 𝚊𝚗 𝚊𝚌𝚝𝚒𝚘𝚗: ${prefix}antilink set delete | kick | warn.` 
                    }, { quoted: message });
                    return;
                }
                const setAction = args[1];
                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                        await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
                    await sock.sendMessage(chatId, { 
                        text: '❗ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚌𝚝𝚒𝚘𝚗...' 
                    }, { quoted: message });
                    return;
                }
                const setResult = await setAntilink(chatId, 'on', setAction);
                        await sock.sendMessage(chatId, {
            react: { text: '🐋', key: message.key }
        });
                await sock.sendMessage(chatId, { 
                    text: setResult ? `🏷️ 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚊𝚌𝚝𝚒𝚘𝚗 𝚜𝚎𝚝 𝚝𝚘 ${setAction}` : '❕ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚜𝚎𝚝 𝙰𝙽𝚝𝚒𝚕𝚒𝚗𝚔 𝚊𝚌𝚝𝚒𝚘𝚗' 
                }, { quoted: message });
                break;

            case 'get':
                const status = await getAntilink(chatId, 'on');
                const actionConfig = await getAntilink(chatId, 'on');
                await sock.sendMessage(chatId, { 
                    text: `*⚔️ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝚃𝙸𝙾𝙽 ⚔️*\n\n┄┄┄┄┄┄┄┄┄┄┄\n📑 𝚂𝚝𝚊𝚝𝚞𝚜:${status ? 'ON' : 'OFF'}\n💣 𝙰𝚌𝚝𝚒𝚘𝚗: ${actionConfig ? actionConfig.action : 'Not set\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ'}` 
                }, { quoted: message });
                break;

            default:
                        await sock.sendMessage(chatId, {
            react: { text: '❕', key: message.key }
        });
                await sock.sendMessage(chatId, { text: `🧐 𝚄𝚜𝚎 ${prefix} 𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚏𝚘𝚛 𝚞𝚜𝚊𝚐𝚎...` });
        }
    } catch (error) {
        console.error('Error in antilink command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '❕', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔...' });
    }
}

async function handleLinkDetection(sock, chatId, message, userMessage, senderId) {
    const antilinkSetting = getAntilinkSetting(chatId);
    if (antilinkSetting === 'off') return;

    console.log(`Antilink Setting for ${chatId}: ${antilinkSetting}`);
    console.log(`Checking message for links: ${userMessage}`);
    
    // Log the full message object to diagnose message structure
    console.log("Full message object: ", JSON.stringify(message, null, 2));

    let shouldDelete = false;

    const linkPatterns = {
        whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/i,
        whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/i,
        telegram: /t\.me\/[A-Za-z0-9_]+/i,
        // Matches:
        // - Full URLs with protocol (http/https)
        // - URLs starting with www.
        // - Bare domains anywhere in the string, even when attached to text
        //   e.g., "helloinstagram.comworld" or "testhttps://x.com"
        allLinks: /https?:\/\/\S+|www\.\S+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/i,
    };

    // Detect WhatsApp Group links
    if (antilinkSetting === 'whatsappGroup') {
        console.log('🐋 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚐𝚛𝚘𝚞𝚙 𝚕𝚒𝚗𝚔 𝚙𝚛𝚘𝚝𝚎𝚌𝚝𝚒𝚘𝚗 𝚒𝚜 𝚎𝚗𝚊𝚋𝚕𝚎𝚍...');
        if (linkPatterns.whatsappGroup.test(userMessage)) {
            console.log('🪀 𝙳𝚎𝚝𝚎𝚌𝚝𝚎𝚍 𝚊 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚐𝚛𝚘𝚞𝚙 𝚕𝚒𝚗𝚔...');
            shouldDelete = true;
        }
    } else if (antilinkSetting === 'whatsappChannel' && linkPatterns.whatsappChannel.test(userMessage)) {
        shouldDelete = true;
    } else if (antilinkSetting === 'telegram' && linkPatterns.telegram.test(userMessage)) {
        shouldDelete = true;
    } else if (antilinkSetting === 'allLinks' && linkPatterns.allLinks.test(userMessage)) {
        shouldDelete = true;
    }

    if (shouldDelete) {
        const quotedMessageId = message.key.id; // Get the message ID to delete
        const quotedParticipant = message.key.participant || senderId; // Get the participant ID

        console.log(`🛡️ 𝙰𝚝𝚝𝚎𝚖𝚙𝚝𝚒𝚗𝚐 𝚝𝚘 𝚍𝚎𝚕𝚎𝚝𝚎 𝚖𝚊𝚜𝚜𝚎𝚐𝚎 𝚠𝚒𝚝𝚑 𝚒𝚍: ${quotedMessageId}\n🐤 𝙵𝚛𝚘𝚖 𝚙𝚊𝚛𝚝𝚒𝚌𝚒𝚙𝚊𝚗𝚝: ${quotedParticipant}`);

        try {
                await sock.sendMessage(chatId, {
            react: { text: '🤫', key: message.key }
        });
            await sock.sendMessage(chatId, {
                delete: { remoteJid: chatId, fromMe: false, id: quotedMessageId, participant: quotedParticipant },
            });
            console.log(`💬 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝙸𝙳: ${quotedMessageId}\n┄┄┄┄┄┄┄┄┄┄\n *🛡️ 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈 🛡️*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`);
        } catch (error) {
            console.error('❕ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚎𝚕𝚎𝚝𝚎 𝚖𝚊𝚜𝚜𝚎𝚐𝚎:', error);
        }

        const mentionedJidList = [senderId];
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: `⚠️ 𝚆𝚊𝚛𝚗𝚒𝚗𝚐!@${senderId.split('@')[0]}, 𝚙𝚘𝚜𝚝𝚒𝚗𝚐 𝚕𝚒𝚗𝚔𝚜 𝚒𝚜 𝚗𝚘𝚝 𝚊𝚕𝚕𝚘𝚠𝚎𝚍...`, mentions: mentionedJidList });
    } else {
        console.log('No link detected or protection not enabled for this type of link.');
    }
}

module.exports = {
    handleAntilinkCommand,
    handleLinkDetection,
};
