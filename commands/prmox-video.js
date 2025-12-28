const axios = require('axios');
const yts = require('yt-search');

// Izumi API configuration
const izumi = {
    baseURL: "https://izumiiiiiiii.dpdns.org"
};

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

async function getIzumiVideoByUrl(youtubeUrl) {
    const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=720`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.download) return res.data.result;
    throw new Error('Izumi video api returned no download');
}

async function getOkatsuVideoByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.mp4) {
        return { download: res.data.result.mp4, title: res.data.result.title };
    }
    throw new Error('Okatsu ytmp4 returned no mp4');
}

async function videoCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { react: { text: '🧐', key: message.key } });
            await sock.sendMessage(chatId, { text: '🔍 𝚆𝚑𝚊𝚝 𝚟𝚒𝚍𝚎𝚘 𝚍𝚘 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍?' }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        let videoUrl = '';
        let videoTitle = '';
        let videoThumbnail = '';
        let videoViews = '';
        let videoChannel = '';
        let videoDate = '';

        // If input is a YouTube URL
        if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {
            videoUrl = searchQuery;
            // Get video info from URL
            const { videos } = await yts(videoUrl);
            if (videos && videos.length > 0) {
                const vid = videos[0];
                videoTitle = vid.title;
                videoThumbnail = vid.thumbnail;
                videoViews = vid.views;
                videoChannel = vid.author.name;
                videoDate = vid.ago;
            }
        } else {
            // Search YouTube
            const { videos } = await yts(searchQuery);
            if (!videos || videos.length === 0) {
                await sock.sendMessage(chatId, { react: { text: '❕', key: message.key } });
                await sock.sendMessage(chatId, { text: '🎬 𝙽𝚘 𝚟𝚒𝚍𝚎𝚘𝚜 𝚏𝚘𝚞𝚗𝚍...' }, { quoted: message });
                return;
            }
            const vid = videos[0];
            videoUrl = vid.url;
            videoTitle = vid.title;
            videoThumbnail = vid.thumbnail;
            videoViews = vid.views;
            videoChannel = vid.author.name;
            videoDate = vid.ago;
        }

        // Send thumbnail immediately
        try {
            const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
            const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : undefined);
            if (thumb) {
                await sock.sendMessage(chatId, {
                    image: { url: thumb },
                    caption: `*▶️ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝚁𝙴𝚁*\n\n┄┄┄┄┄┄┄┄┄┄\n🧸 𝚃𝚒𝚝𝚕𝚎: *${videoTitle}*\n📊 𝚅𝚒𝚎𝚠𝚜: *${videoViews}*\n🏗️ 𝙲𝚑𝚊𝚗𝚗𝚎𝚕: *${videoChannel}*\n📆 𝚄𝚙𝚕𝚘𝚊𝚍𝚎𝚍 𝚘𝚗: *${videoDate}*\n\n© 𝚋𝚢 ᴘʀᴍᴏ✗ ᴡᴇʙ`
                }, { quoted: message });
            }
        } catch (e) {
            console.error('[VIDEO] thumb error:', e?.message || e);
        }

        // Validate YouTube URL
        let urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) {
            await sock.sendMessage(chatId, { react: { text: '🥴', key: message.key } });
            await sock.sendMessage(chatId, { text: '❗ 𝚃𝚑𝚒𝚜 𝚒𝚜 𝚗𝚘𝚝 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝚕𝚒𝚗𝚔...' }, { quoted: message });
            return;
        }

        // Get video: try Izumi first, then Okatsu fallback
        let videoData;
        try {
            videoData = await getIzumiVideoByUrl(videoUrl);
        } catch (e1) {
            videoData = await getOkatsuVideoByUrl(videoUrl);
        }

        // Send video
        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
        await sock.sendMessage(chatId, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `PRMOX-WEB-${videoData.title || videoTitle || 'video'}.mp4`,
            caption: `🔖 ${videoData.title || videoTitle || 'Video'}\n\n> 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 𝚋𝚢 ᴘʀᴍᴏ✗\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ`
        }, { quoted: message });

    } catch (error) {
        console.error('❗ Video downloader Command Error: ', error?.message || error);
        await sock.sendMessage(chatId, { react: { text: '⁉️', key: message.key } });
        await sock.sendMessage(chatId, { text: '⚠️ Download failed: ' + (error?.message || 'Unknown error') }, { quoted: message });
    }
}

module.exports = videoCommand;