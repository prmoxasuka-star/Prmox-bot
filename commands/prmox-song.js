const axios = require('axios');
const yts = require('yt-search');

    function sanitizeFileName(name) {
    return name.replace(/[\\/:*?"<>|]/g, '').substring(0, 50);
}
const AXIOS_DEFAULTS = {
	timeout: 60000,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Accept': 'application/json, text/plain, */*'
	}
};

async function tryRequest(getter, attempts = 3) {
	let lastError;
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			return await getter();
		} catch (err) {
			lastError = err;
			if (attempt < attempts) {
				await new Promise(r => setTimeout(r, 1000 * attempt));
			}
		}
	}
	throw lastError;
}

async function getIzumiDownloadByUrl(youtubeUrl) {
	const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=mp3`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	console.log(res.data);
	if (res?.data?.result?.download) return res.data.result;
	throw new Error('Izumi youtube?url returned no download');
}

async function getIzumiDownloadByQuery(query) {
	const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube-play?query=${encodeURIComponent(query)}`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	console.log(res.data);
	if (res?.data?.result?.download) return res.data.result;
	throw new Error('Izumi youtube-play returned no download');
}

async function getOkatsuDownloadByUrl(youtubeUrl) {
	const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	console.log(res.data);
	// Okatsu response shape: { status, creator, title, format, thumb, duration, cached, dl }
	if (res?.data?.dl) {
		return {
			download: res.data.dl,
			title: res.data.title,
			thumbnail: res.data.thumb,
		};
	}
	throw new Error('Okatsu ytmp3 returned no download');
}

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        if (!text) {
                await sock.sendMessage(chatId, {
            react: { text: '🙃', key: message.key }
        });
            await sock.sendMessage(chatId, { text: '🍁 𝚄𝚜𝚊𝚐𝚎: .𝚜𝚘𝚗𝚐 <𝚂𝚘𝚗𝚐 𝚗𝚊𝚖𝚎 𝚘𝚛 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝙻𝚒𝚗𝚔>' }, { quoted: message });
            return;
        }

let video;
await sock.sendMessage(chatId, {
    react: { text: '🔄', key: message.key }
});
if (text.includes('youtube.com') || text.includes('youtu.be')) {
    video = { url: text };
} else {
    const search = await yts(text);
    if (!search || !search.videos.length) {
            await sock.sendMessage(chatId, {
            react: { text: '🥴', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '❕ 𝙽𝚘 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚞𝚗𝚍...' }, { quoted: message });
        return;
    }
    video = search.videos[0];
}

// ⚠️ Add this check
if (!video.url) {
    await sock.sendMessage(chatId, { text: '❗ 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚐𝚎𝚝 𝚟𝚒𝚍𝚎𝚘 𝚞𝚛𝚕...' }, { quoted: message });
    return;
}
        // Inform user
        
                await sock.sendMessage(chatId, {
            react: { text: '📥', key: message.key }
        });
            if (video.thumbnail) {
    await sock.sendMessage(chatId, {
        image: { url: video.thumbnail },
            caption: `*🎵 𝚂𝚘𝚗𝚐 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛*\n\n╌╌╌╌╌╌╌╌╌╌\n🧸 𝚃𝚒𝚝𝚕𝚎: *${video.title}*\n📊 𝚅𝚒𝚎𝚠𝚜: *${video.views}*\n🏗️ 𝙲𝚑𝚊𝚗𝚗𝚎𝚕: *${video.author?.name || `Unknown Channel`}*\n⏱️ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗: *${video.timestamp}*\n📆 U𝚙𝚕𝚘𝚊𝚍𝚎𝚍 𝚘𝚗: *${video.ago}*\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`
    }, { quoted: message });
}

		// Try Izumi primary by URL, then by query, then Okatsu fallback
let audioData;
try {
    // Primary: Izumi by URL
    if (video.url) audioData = await getIzumiDownloadByUrl(video.url);
} catch (e1) {
    try {
        // Secondary: Izumi search by title
        const query = video.title || text;
        audioData = await getIzumiDownloadByQuery(query);
    } catch (e2) {
        // Fallback: Okatsu
        if (video.url) audioData = await getOkatsuDownloadByUrl(video.url);
        else throw new Error('No valid URL for fallback download');
    }
}

if (!audioData) {
    await sock.sendMessage(chatId, {
        text: '❗ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚏𝚊𝚒𝚕𝚎𝚍... 𝙰𝚕𝚕 𝚜𝚎𝚛𝚟𝚎𝚛𝚜 𝚊𝚛𝚎 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚞𝚗𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎...'
    }, { quoted: message });
    return;
}

const audioUrl = audioData.download || audioData.dl || audioData.url;

if (!audioUrl) {
    await sock.sendMessage(chatId, {
        text: '❗ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚝𝚛𝚒𝚎𝚟𝚎 𝚊𝚞𝚍𝚒𝚘 𝚏𝚒𝚕𝚎..'
    }, { quoted: message });
    return;
}
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
await sock.sendMessage(chatId, {
    audio: { url: audioUrl },
    mimetype: 'audio/mpeg',
    fileName: `PRMOX-WEB-${sanitizeFileName(audioData.title || video.title || 'song')}.mp3`,
    ptt: false
}, { quoted: message });

    } catch (err) {
        console.error('Song command error:', err);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { text: '⚠️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚜𝚘𝚗𝚐...' }, { quoted: message });
    }
}

module.exports = songCommand;
