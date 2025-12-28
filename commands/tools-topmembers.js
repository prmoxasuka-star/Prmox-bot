const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'messageCount.json');

function loadMessageCounts() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return {};
}

function saveMessageCounts(messageCounts) {
    fs.writeFileSync(dataFilePath, JSON.stringify(messageCounts, null, 2));
}

function incrementMessageCount(groupId, userId) {
    const messageCounts = loadMessageCounts();

    if (!messageCounts[groupId]) {
        messageCounts[groupId] = {};
    }

    if (!messageCounts[groupId][userId]) {
        messageCounts[groupId][userId] = 0;
    }

    messageCounts[groupId][userId] += 1;

    saveMessageCounts(messageCounts);
}

function topMembers(sock, chatId, isGroup) {
    if (!isGroup) {
        sock.sendMessage(chatId, { 
               react: { text: '☺️', key: message.key },
        text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙 𝚌𝚑𝚊𝚝𝚜...' });
        return;
    }

    const messageCounts = loadMessageCounts();
    const groupCounts = messageCounts[chatId] || {};

    const sortedMembers = Object.entries(groupCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Get top 5 members

    if (sortedMembers.length === 0) {
        sock.sendMessage(chatId, { 
        react: { text: '🫩', key: message.key },
        text: '❕ 𝙽𝚘 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚊𝚌𝚝𝚒𝚟𝚒𝚝𝚢 𝚛𝚎𝚌𝚘𝚛𝚍𝚎𝚍 𝚢𝚎𝚝...' });
        return;
    }
    
    let message = '*🏆 𝚃𝙾𝙿 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 🏆*\n\n┄┄┄┄┄┄┄┄┄┄┄\n🎟️ 𝚃𝚘𝚙 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 𝚋𝚊𝚜𝚎𝚍 𝚘𝚗 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚌𝚘𝚞𝚗𝚝:\n\n';
    sortedMembers.forEach(([userId, count], index) => {
        message += `${index + 1}. @${userId.split('@')[0]} - ${count} messages\n`;
    });
    sock.sendMessage(chatId, { text: message, mentions: sortedMembers.map(([userId]) => userId) });
}

module.exports = { incrementMessageCount, topMembers };
