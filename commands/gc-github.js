const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');


async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/prmoxasuka-star/Prmox-bot');
            await sock.sendMessage(chatId, {
            react: { text: '🪢', key: message.key }
        });
    if (!res.ok) throw new Error('❗ 𝙴𝚛𝚛𝚘𝚛 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚛𝚎𝚙𝚘𝚜𝚒𝚝𝚘𝚛𝚢 𝚍𝚊𝚝𝚊, 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛...');
    const json = await res.json();

    let txt = `*✨ 𝙿𝚁𝙼𝙾𝚇 𝙶𝙸𝚃𝙷𝚄𝙱 ✨*\n\n`;
    txt += `┄┄┄┄┄┄┄┄┄┄\n`;
    txt += `🔰 𝙽𝚊𝚖𝚎 : ${json.name}\n`;
    txt += `🔰 𝙷𝚘𝚜𝚝 : ᴘʀᴍᴏ✗ ᴡᴇʙ\n`;
    txt += `🔰 𝚆𝚊𝚝𝚌𝚑𝚎𝚛𝚜 : ${json.watchers_count}\n`;
    txt += `🔰 𝚂𝚒𝚣𝚎 : ${(json.size / 1024).toFixed(2)} MB\n`;
    txt += `🔰 𝙻𝚊𝚜𝚝 𝚄𝚙𝚍𝚊𝚝𝚎𝚍 : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `🔰 𝚄𝚁𝙻 : ${json.html_url}\n`;
    txt += `🔰 𝙵𝚘𝚛𝚔𝚜 : ${json.forks_count}\n`;
    txt += `🔰 𝚂𝚝𝚊𝚛𝚜 : ${json.stargazers_count}\n\n`;
    txt += `© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`;

    // Use the local asset image
    const imgPath = path.join(__dirname, '../assets/prmox-github.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });
  } catch (error) {
          await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
    await sock.sendMessage(chatId, { text: '⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚛𝚎𝚙𝚘𝚜𝚒𝚝𝚘𝚛𝚢 𝚒𝚗𝚏𝚘...' }, { quoted: message });
  }
}

module.exports = githubCommand; 