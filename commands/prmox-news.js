const axios = require('axios');

module.exports = async function (sock, chatId, message, args) {
    try {
        args = args || []; // 🔧 FIX: prevent undefined error

        await sock.sendMessage(chatId, {
            react: { text: '🗞️', key: message.key }
        });

        // ❗ country argument check
        if (!args[0]) {
            return await sock.sendMessage(chatId, {
                text: '❕ 𝚄𝚜𝚊𝚐𝚎: .𝚗𝚎𝚠𝚜 <𝚌𝚘𝚞𝚗𝚝𝚛𝚢>'
            });
        }

        const apiKey = 'YOUR_API_KEY';
        const country = args[0].toLowerCase();

        const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=5&apiKey=${apiKey}`;

        const response = await axios.get(url);
        const articles = response.data.articles;

        if (!articles || articles.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❗ ${country.toUpperCase()} 𝚗𝚘𝚝 𝚗𝚎𝚠𝚜 𝚏𝚘𝚞𝚗𝚍...`
            });
        }

        let newsMessage =
            `*📰 𝙻𝙰𝚃𝙴𝚂𝚃 𝙽𝙴𝚆𝚂 📰*\n` +
            `🌍 𝙲𝚘𝚞𝚗𝚝𝚛𝚢: ${country.toUpperCase()}\n\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄\n\n`;

        articles.forEach((article, index) => {
            newsMessage +=
                `*${index + 1}. ${article.title}*\n` +
                `${article.description || 'No description'}\n` +
                `🕒 ${new Date(article.publishedAt).toLocaleString()}\n\n`;
        });

        newsMessage += `© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;

        await sock.sendMessage(chatId, { text: newsMessage });

    } catch (error) {
        console.error(error);

        await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });

        await sock.sendMessage(chatId, {
            text: '⚠️ 𝚂𝚘𝚛𝚛𝚢,... 𝙸 𝚌𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚏𝚎𝚝𝚌𝚑 𝚗𝚎𝚠𝚜 𝚛𝚒𝚐𝚑𝚝 𝚗𝚘𝚠...'
        });
    }
};