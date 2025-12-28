const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363423930246587@newsletter',
            newsletterName: 'ᴘʀᴍᴏ✗ ᴡᴇʙ',
            serverMessageId: -1
        }
    }
};

const configPath = path.join(__dirname, '../data/autoStatus.json');

if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
        configPath,
        JSON.stringify({ enabled: false, reactOn: false }, null, 2)
    );
}

function readConfig() {
    return JSON.parse(fs.readFileSync(configPath));
}

async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!msg.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, {
                react: { text: '🤭', key: msg.key }
            });
            await sock.sendMessage(chatId, {
                text: '❕ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚋𝚢 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛...',
                ...channelInfo
            });
            return;
        }

        let config = readConfig();

        if (!args || args.length === 0) {
            const status = config.enabled ? 'enabled' : 'disabled';
            const reactStatus = config.reactOn ? 'enabled' : 'disabled';

            await sock.sendMessage(chatId, {
                react: { text: '🥏', key: msg.key }
            });
            await sock.sendMessage(chatId, {
                text:
`*🪀 𝙰𝚄𝚃𝙾 𝚂𝚃𝙰𝚃𝚄𝚂 𝚂𝙴𝚃𝚄𝙿 🪀*

┄┄┄┄┄┄┄┄
🏮 𝙰𝚞𝚝𝚘 𝚜𝚝𝚊𝚝𝚞𝚜 𝚟𝚒𝚎𝚠: ${status}
🏓 𝙰𝚞𝚝𝚘 𝚂𝚝𝚊𝚝𝚞𝚜 𝚁𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜: ${reactStatus}

┄┄┄┄┄┄┄┄
📑 𝙰𝚌𝚝𝚒𝚘𝚗𝚜:
01. .𝚊𝚞𝚝𝚘𝚜𝚝𝚊𝚝𝚞𝚜 𝚘𝚗
02. .𝚊𝚞𝚝𝚘𝚜𝚝𝚊𝚝𝚞𝚜 𝚘𝚏𝚏
03. .𝚊𝚞𝚝𝚘𝚜𝚝𝚊𝚝𝚞𝚜 𝚛𝚎𝚊𝚌𝚝 𝚘𝚗
04. .𝚊𝚞𝚝𝚘𝚜𝚝𝚊𝚝𝚞𝚜 𝚛𝚎𝚊𝚌𝚝 𝚘𝚏𝚏

© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                ...channelInfo
            });
            return;
        }

        const command = args[0].toLowerCase();

        if (command === 'on' || command === 'off') {
            config.enabled = command === 'on';
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await sock.sendMessage(chatId, {
                react: { text: '📬', key: msg.key }
            });
            await sock.sendMessage(chatId, {
                text: `*🎈 𝙰𝚄𝚃𝙾 𝚂𝚃𝙰𝚃𝚄𝚂 𝚅𝙸𝙴𝚆 🎈*\n\n👀 𝙰𝚞𝚝𝚘 𝚜𝚝𝚊𝚝𝚞𝚜 𝚟𝚒𝚎𝚠 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 *${command === 'on' ? 'enabled' : 'disabled'}*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                ...channelInfo
            });
        }

        else if (command === 'react' && args[1]) {
            const state = args[1].toLowerCase();
            if (state !== 'on' && state !== 'off') return;

            config.reactOn = state === 'on';
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await sock.sendMessage(chatId, {
                react: { text: '📬', key: msg.key }
            });
            await sock.sendMessage(chatId, {
                text: `*🎈 𝙰𝚄𝚃𝙾 𝚂𝚃𝙰𝚃𝚄𝚂 𝚁𝙴𝙰𝙲𝚃𝙸𝙾𝙽𝚂 🎈*\n\n💚 𝙰𝚞𝚝𝚘 𝚜𝚝𝚊𝚝𝚞𝚜 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗𝚜 *${state === 'on' ? 'enabled' : 'disabled'}*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`,
                ...channelInfo
            });
        }

    } catch (error) {
        console.error(error);
    }
}

/* ✅ MISSING FUNCTION FIXED */
async function handleStatusUpdate(sock, status) {
    const config = readConfig();
    if (!config.enabled) return;

    try {
        await sock.readMessages([status.key]);

        if (config.reactOn) {
            await sock.sendMessage(
                status.key.remoteJid,
                { react: { text: '👀', key: status.key } }
            );
        }
    } catch (e) {
        console.error('AutoStatus error:', e);
    }
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
};