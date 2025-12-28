const axios = require('axios');

module.exports = async function (sock, chatId, message, city) {
    try {
        const apiKey = '4902c0f2550f58298ad4146a92b65e10';  // Replace with your OpenWeather API Key
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const weather = response.data;
        const weatherText = `📍 Weather in ${weather.name}: ${weather.weather[0].description}.\n\n┄┄┄┄┄┄┄┄\n 🌡️ 𝚃𝚎𝚖𝚙𝚎𝚛𝚊𝚝𝚞𝚛𝚎: ${weather.main.temp}°C\n🌬️ 𝚆𝚒𝚗𝚍 𝚜𝚙𝚎𝚎𝚍: ${weather.main.wind}\n🫧 𝙿𝚛𝚎𝚜𝚜𝚞𝚛𝚎: ${weather.main.pressure}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;
                await sock.sendMessage(chatId, {
            react: { text: '⛅', key: message.key }
        });
        await sock.sendMessage(chatId, { text: weatherText }, { quoted: message }   );
    } catch (error) {
        console.error('Error fetching weather:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️𝚂𝚘𝚛𝚛𝚢, 𝙸 𝚌𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚏𝚎𝚝𝚌𝚑 𝚝𝚑𝚎 𝚠𝚎𝚊𝚝𝚑𝚎𝚛 𝚛𝚒𝚐𝚑𝚝 𝚗𝚘𝚠...' }, { quoted: message } );
    }
};
