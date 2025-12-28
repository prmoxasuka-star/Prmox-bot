const fetch = require('node-fetch');

async function flirtCommand(sock, chatId, message) {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        const flirtMessage = json.result;

        // Send the flirt message
                await sock.sendMessage(chatId, {
            react: { text: '🥰', key: message.key }
        });
        await sock.sendMessage(chatId, { text: flirtMessage }, { quoted: message });
    } catch (error) {
        console.error('Error in flirt command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '☺️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '😘 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚏𝚕𝚒𝚛𝚝 𝚖𝚎𝚜𝚜𝚊𝚐𝚎...𝚙𝚛𝚝𝚢... 𝚙𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛...' }, { quoted: message });
    }
}

module.exports = { flirtCommand }; 