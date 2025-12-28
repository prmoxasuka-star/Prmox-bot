const fs = require('fs');

function isBanned(userId) {
    try {
        const bannedUsers = JSON.parse(fs.readFileSync('./data/banned.json', 'utf8'));
        return bannedUsers.includes(userId);
    } catch (error) {
        console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚌𝚑𝚎𝚔𝚒𝚗𝚐 𝚋𝚊𝚗𝚗𝚎𝚍 𝚜𝚝𝚊𝚝𝚞𝚜:', error);
        return false;
    }
}

module.exports = { isBanned }; 