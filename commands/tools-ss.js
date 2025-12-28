const fetch = require('node-fetch');

async function handleSsCommand(sock, chatId, message, match) {
    if (!match) {
        await sock.sendMessage(chatId, {
            react: { text: '🃏', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: `*👓 𝚂𝙲𝚁𝙴𝙴𝙽𝚂𝙷𝙾𝚃 𝚂𝙴𝚃𝚄𝙿 👓*\n\n┄┄┄┄┄┄┄┄┄┄\n01. .𝚜𝚜 <𝚞𝚛𝚕>\n02. .𝚜𝚜𝚠𝚎𝚋 <𝚞𝚛𝚕>\n03. .𝚜𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 <𝚞𝚛𝚕>\n\n𝙾𝚗𝚕𝚢 𝚃𝚊𝚔𝚎 𝚊 𝚜𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 𝚘𝚏 𝚊𝚗𝚢 𝚠𝚎𝚋𝚜𝚒𝚝𝚎\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
            quoted: message
        });
        return;
    }

    try {
        // Show typing indicator
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);

        // Extract URL from command
        const url = match.trim();
        
        // Validate URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            await sock.sendMessage(chatId, {
                react: { text: '🙃', key: message.key }
            });
            return sock.sendMessage(chatId, {
                text: '❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚄𝚁𝙻 𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐 𝚠𝚒𝚝𝚑 𝚑𝚝𝚝𝚙:// 𝚘𝚛 𝚑𝚝𝚝𝚙𝚜://',
                quoted: message
            });
        }

        // Call the API
        const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=light&device=desktop`;
        const response = await fetch(apiUrl, { headers: { 'accept': '*/*' } });
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Get the image buffer - FIXED THIS PART
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        // Send the screenshot
        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: `Screenshot of: ${url}`
        }, {
            quoted: message
        });

        // Send success reaction
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

    } catch (error) {
        console.error('Error in ss command:', error);
        await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚝𝚊𝚔𝚎 𝚜𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝...𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 𝚊 𝚏𝚎𝚠 𝚖𝚔𝚗𝚞𝚝𝚎𝚜...',
            quoted: message
        });
    }
}

module.exports = {
    handleSsCommand
};