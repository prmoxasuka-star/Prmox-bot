const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');
const { channelInfo } = require('../lib/messageConfig');
const fetch = require('node-fetch');

async function welcomeCommand(sock, chatId, message, match) {
    // Check if it's a group
    if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜....' });
        return;
    }

    // Extract match from message
    const text = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleWelcome(sock, chatId, message, matchText);
}

async function handleJoinEvent(sock, id, participants) {
    // Check if welcome is enabled for this group
    const isWelcomeEnabled = await isWelcomeOn(id);
    if (!isWelcomeEnabled) return;

    // Get custom welcome message
    const customMessage = await getWelcome(id);

    // Get group metadata
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'No description available';

    // Send welcome message for each new participant
    for (const participant of participants) {
        try {
            // Handle case where participant might be an object or not a string
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            // Get user's display name
            let displayName = user; // Default to phone number
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact && contact.name) {
                    displayName = contact.name;
                } else {
                    // Try to get from group participants
                    const groupParticipants = groupMetadata.participants;
                    const userParticipant = groupParticipants.find(p => p.id === participantString);
                    if (userParticipant && userParticipant.name) {
                        displayName = userParticipant.name;
                    }
                }
            } catch (nameError) {
                console.log('❗𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚏𝚎𝚝𝚌𝚑 𝚞𝚜𝚎𝚛𝚗𝚊𝚖𝚎 𝚘𝚛 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛...');
            }
            
            // Process custom message with variables
            let finalMessage;
            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{description}/g, groupDesc);
            } else {
                // Default message if no custom message is set
                const now = new Date();
                const timeString = now.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                
                finalMessage = `*⚔️ 𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁 ⚔️*\n\n┄┄┄┄┄┄┄┄┄\n𝚆𝚎𝚕𝚌𝚘𝚖𝚎: @${displayName} 👋\n👥 𝙼𝚎𝚖𝚋𝚎𝚛 𝙲𝚘𝚞𝚗𝚝: #${groupMetadata.participants.length}\n⏳ 𝚃𝚒𝚖𝚎: ${timeString}\n\n*@${displayName}* 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 *${groupName}*....🎉\n🪏 𝙶𝚛𝚘𝚞𝚙 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗:\n${groupDesc}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;
            }
            
            // Try to send with image first (always try images)
            try {
                // Get user profile picture
                let profilePicUrl = `https://cdn.jsdelivr.net/gh/prmoxasuka-star/Prmox-bot/assets/prmox-unprofile.jpg`; // Default avatar
                try {
                    const profilePic = await sock.profilePictureUrl(participantString, 'image');
                    if (profilePic) {
                        profilePicUrl = profilePic;
                    }
                } catch (profileError) {
                    console.log('❗𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚏𝚎𝚝𝚌𝚑 𝚙𝚛𝚘𝚏𝚒𝚕𝚎 𝚙𝚒𝚌𝚝𝚞𝚛𝚎...');
                }
                
                // Construct API URL for welcome image
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${groupMetadata.participants.length}&avatar=${encodeURIComponent(profilePicUrl)}`;
                
                // Fetch the welcome image
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    
                    // Send welcome image with caption (custom or default message)
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString],
                        ...channelInfo
                    });
                    continue; // Skip to next participant
                }
            } catch (imageError) {
                console.log('❗ 𝙸𝚖𝚊𝚐𝚎 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚘𝚗 𝚏𝚊𝚒𝚕𝚎𝚍..,𝚏𝚊𝚕𝚕𝚒𝚗𝚐 𝚋𝚊𝚌𝚔 𝚝𝚘 𝚝𝚎𝚡𝚝...>');
            }
            
            // Send text message (either custom message or fallback)
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString],
                ...channelInfo
            });
        } catch (error) {
            console.error('Error sending welcome message:', error);
            // Fallback to text message
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            // Use custom message if available, otherwise use simple fallback
            let fallbackMessage;
            if (customMessage) {
                fallbackMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{description}/g, groupDesc);
            } else {
                fallbackMessage = `*✨ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝙳𝙴𝙰𝚁 ✨*\n\n┄┄┄┄┄┄┄┄┄┄\n🥳 𝙼𝚎𝚖𝚋𝚎𝚛: @${user}\n🐋 𝙶𝚛𝚘𝚞𝚙: ${groupName}\n𝙾𝚞𝚛 𝚐𝚛𝚘𝚞𝚙 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚊 𝚏𝚞𝚗 𝚊𝚗𝚍 𝚑𝚊𝚙𝚙𝚢𝚐𝚊𝚝𝚑𝚎𝚛𝚒𝚗𝚐 𝚏𝚘𝚛 𝚢𝚘𝚞...🎉\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;
            }
            
            await sock.sendMessage(id, {
                text: fallbackMessage,
                mentions: [participantString],
                ...channelInfo
            });
        }
    }
}

module.exports = { welcomeCommand, handleJoinEvent };