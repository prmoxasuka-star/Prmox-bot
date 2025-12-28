const axios = require('axios');
const mumaker = require('mumaker');

// Base channel info template
const channelInfo = {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363423930246587@newsletter',
        newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
        serverMessageId: -1
    }
};
        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });
// Reusable message templates
const messageTemplates = {
    error: (message) => ({
        text: message,
        contextInfo: channelInfo
    }),
    success: (text, imageUrl) => ({
        image: { url: imageUrl },
        caption: "*🀄 𝚃𝙴𝚇𝚃 𝚃𝙾 𝙸𝙼𝙰𝙶𝙴 𝙼𝙰𝙺𝙴𝚁*\n\n┄┄┄┄┄┄┄┄┄\n〽️ 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚘𝚛: ephoto360\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ",
        contextInfo: channelInfo
    })
};

async function textmakerCommand(sock, chatId, message, q, type) {
    try {
        if (!q) {
            return await sock.sendMessage(
                chatId,
                messageTemplates.error("❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚝𝚎𝚡𝚝 𝚝𝚘 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎...")
            );
        }

        // Extract text
        const text = q.split(' ').slice(1).join(' ');

        if (!text) {
            return await sock.sendMessage(
                chatId,
                messageTemplates.error("❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚝𝚎𝚡𝚝 𝚝𝚘 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎...")
            );
        }

        let result;

        switch (type) {
            case 'metallic':
                result = await mumaker.ephoto("https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html", text);
                break;
            case 'ice':
                result = await mumaker.ephoto("https://en.ephoto360.com/ice-text-effect-online-101.html", text);
                break;
            case 'snow':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html", text);
                break;
            case 'impressive':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html", text);
                break;
            case 'matrix':
                result = await mumaker.ephoto("https://en.ephoto360.com/matrix-text-effect-154.html", text);
                break;
            case 'light':
                result = await mumaker.ephoto("https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html", text);
                break;
            case 'neon':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html", text);
                break;
            case 'devil':
                result = await mumaker.ephoto("https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html", text);
                break;
            case 'purple':
                result = await mumaker.ephoto("https://en.ephoto360.com/purple-text-effect-online-100.html", text);
                break;
            case 'thunder':
                result = await mumaker.ephoto("https://en.ephoto360.com/thunder-text-effect-online-97.html", text);
                break;
            case 'leaves':
                result = await mumaker.ephoto("https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html", text);
                break;
            case '1917':
                result = await mumaker.ephoto("https://en.ephoto360.com/1917-style-text-effect-523.html", text);
                break;
            case 'arena':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html", text);
                break;
            case 'hacker':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html", text);
                break;
            case 'sand':
                result = await mumaker.ephoto("https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html", text);
                break;
            case 'blackpink':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html", text);
                break;
            case 'glitch':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html", text);
                break;
            case 'fire':
                result = await mumaker.ephoto("https://en.ephoto360.com/flame-lettering-effect-372.html", text);
                break;
            default:
                return await sock.sendMessage(
                    chatId,
                    messageTemplates.error("❗ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚝𝚎𝚡𝚝 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚘𝚛 𝚝𝚢𝚙𝚎...")
                );
        }

        if (!result || !result.image) {
            throw new Error('No image URL received from the API');
        }

        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

        await sock.sendMessage(
            chatId,
            messageTemplates.success(text, result.image)
        );

    } catch (error) {
        console.error('Error in textmaker command:', error);

        await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });

        await sock.sendMessage(
            chatId,
            messageTemplates.error("⚠️ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍..𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗....")
        );
    }
}

module.exports = textmakerCommand;