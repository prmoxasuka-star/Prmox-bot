const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

async function wastedCommand(sock, chatId, message) {
    let userToWaste;
    
    // Check for mentioned users
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToWaste = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToWaste = message.message.extendedTextMessage.contextInfo.participant;
    }
    
    if (!userToWaste) {
                    await sock.sendMessage(chatId, {
            react: { text: '☠️', key: message.key }
        });
        await sock.sendMessage(chatId, { 
            text: '‼️ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚎𝚗𝚝𝚒𝚘𝚗 𝚜𝚘𝚖𝚎𝚘𝚗𝚎 𝚘𝚛 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚎𝚒𝚛 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚘 𝚠𝚊𝚜𝚝𝚎 𝚝𝚑𝚎𝚖...', 
            ...channelInfo 
        }, { quoted: message });
        return;
    }

    try {
        // Get user's profile picture
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToWaste, 'image');
        } catch {
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg'; // Default image if no profile pic
        }

        // Get the wasted effect image
        const wastedResponse = await axios.get(
            `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(profilePic)}`,
            { responseType: 'arraybuffer' }
        );

        // Send the wasted image
                await sock.sendMessage(chatId, {
            react: { text: '💀', key: message.key }
        });
        await sock.sendMessage(chatId, {
            image: Buffer.from(wastedResponse.data),
            caption: `*☠️ 𝚆𝙰𝚂𝚃𝙴𝙳 ☠️*\n\n┄┄┄┄┄┄┄┄\n⚰️ 𝚆𝚊𝚜𝚝𝚎𝚍 : ${userToWaste.split('@')[0]}\n   *𝚁𝙴𝚂𝚃 𝙸𝙽 𝙿𝙸𝙴𝙲𝙴𝚂....🩸*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
            mentions: [userToWaste],
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in wasted command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { 
            text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚌𝚛𝚎𝚊𝚝𝚎 𝚠𝚊𝚜𝚝𝚎𝚍 𝚒𝚖𝚊𝚐𝚎...',
            ...channelInfo 
        }, { quoted: message });
    }
}

module.exports = wastedCommand; 