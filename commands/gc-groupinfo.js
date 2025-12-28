async function groupInfoCommand(sock, chatId, msg) {
    try {
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Get group profile picture
        let pp;
        try {
                await sock.sendMessage(chatId, {
            react: { text: '👥', key: message.key }
        });
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://h.uguu.se/UmeKwbAe.jpg'; // Default image
        }

        // Get admins from participants
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        
        // Get group owner
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        // Create info text
        const text = `=
*✨ 𝙶𝚁𝙾𝚄𝙿 𝙸𝙽𝙵𝙾 ✨*

┄┄┄┄┄┄┄┄┄┄┄┄
❯ ♻️ 𝙸𝙳 :
| ${groupMetadata.id}
❯ 🔖 𝙽𝚊𝚖𝚎 : 
| ${groupMetadata.subject}
❯ 👥 𝙼𝚎𝚖𝚋𝚎𝚛𝚜 :
| ${participants.length}
❯ 🧑‍✈️𝙶𝚛𝚘𝚞𝚙 𝙾𝚠𝚗𝚎𝚛 :
| @${owner.split('@')[0]}
❯ 🕵🏻‍♂️ 𝙰𝚍𝚖𝚒𝚗 :
${listAdmin}
❯ 📌 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 :
| ${groupMetadata.desc?.toString() || 'No description'}

© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ
`.trim();

        // Send the message with image and mentions
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('❗ 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚒𝚗𝚏𝚘 𝚌𝚘𝚖𝚖𝚊𝚗𝚍:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚒𝚗𝚏𝚘...' });
    }
}

module.exports = groupInfoCommand; 