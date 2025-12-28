const fs = require('fs');

const ANTICALL_PATH = './data/anticall.json';

function readState() {
    try {
        if (!fs.existsSync(ANTICALL_PATH)) return { enabled: false };
        const raw = fs.readFileSync(ANTICALL_PATH, 'utf8');
        const data = JSON.parse(raw || '{}');
        return { enabled: !!data.enabled };
    } catch {
        return { enabled: false };
    }
}

function writeState(enabled) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ enabled: !!enabled }, null, 2));
    } catch {}
}

async function anticallCommand(sock, chatId, message, args) {
    const state = readState();
    const sub = (args || '').trim().toLowerCase();

    if (!sub || (sub !== 'on' && sub !== 'off' && sub !== 'status')) {
            await sock.sendMessage(chatId, {
            react: { text: '🗃️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '*🍁 𝙰𝙽𝚃𝙸𝙲𝙰𝙻𝙻 🍁*\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄\n🔕 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕 𝚘𝚗 - 𝙴𝚗𝚊𝚋𝚕𝚎 𝚊𝚞𝚝𝚘 𝚋𝚕𝚘𝚌𝚔 𝚘𝚗 𝚒𝚗𝚌𝚘𝚖𝚒𝚗𝚐 𝚌𝚊𝚕𝚕𝚜...\n🔔 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕 𝚘𝚗 - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎 𝚘𝚗 𝚒𝚗𝚌𝚘𝚖𝚒𝚗𝚐 𝚌𝚊𝚕𝚕𝚜\n📑 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕 𝚜𝚝𝚊𝚝𝚞𝚜 - 𝚂𝚑𝚘𝚠𝚌𝚞𝚛𝚛𝚎𝚗𝚝 𝚜𝚝𝚊𝚝𝚞𝚜\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ' }, { quoted: message });
        return;
    }

    if (sub === 'status') {
            await sock.sendMessage(chatId, {
            react: { text: '🐋', key: message.key }
        });
        await sock.sendMessage(chatId, { text: `🍁 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕 𝚒𝚜 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢: *${state.enabled ? 'ON' : 'OFF'}*.` }, { quoted: message });
        return;
    }

    const enable = sub === 'on';
    writeState(enable);
            await sock.sendMessage(chatId, {
            react: { text: '🐋', key: message.key }
        });
    await sock.sendMessage(chatId, { text: `🍁 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕 𝚒𝚜 𝚗𝚘𝚠: *${enable ? 'ENABLED' : 'DISABLED'}*.` }, { quoted: message });
}

module.exports = { anticallCommand, readState };


