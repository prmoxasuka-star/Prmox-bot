const { ttdl } = require("ruhend-scraper");
const axios = require('axios');

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

async function tiktokCommand(sock, chatId, message) {
    try {
        // Check if message has already been processed
        if (processedMessages.has(message.key.id)) {
            return;
        }
        
        // Add message ID to processed set
        processedMessages.add(message.key.id);
        
        // Clean up old message IDs after 5 minutes
        setTimeout(() => {
            processedMessages.delete(message.key.id);
        }, 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            await sock.sendMessage(chatId, {
            react: { text: '🧐', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚃𝚒𝚔𝚃𝚘𝚔 𝚕𝚒𝚗𝚔 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚟𝚒𝚍𝚎𝚘..."
            });
        }

        // Extract URL from command
        const url = text.split(' ').slice(1).join(' ').trim();
        
        if (!url) {
           await sock.sendMessage(chatId, {
            react: { text: '🧐', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "❕ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚃𝚒𝚔𝚃𝚘𝚔 𝚕𝚒𝚗𝚔 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚟𝚒𝚍𝚎𝚘..."
            });
        }

        // Check for various TikTok URL formats
        const tiktokPatterns = [
            /https?:\/\/(?:www\.)?tiktok\.com\//,
            /https?:\/\/(?:vm\.)?tiktok\.com\//,
            /https?:\/\/(?:vt\.)?tiktok\.com\//,
            /https?:\/\/(?:www\.)?tiktok\.com\/@/,
            /https?:\/\/(?:www\.)?tiktok\.com\/t\//
        ];

        const isValidUrl = tiktokPatterns.some(pattern => pattern.test(url));
        
        if (!isValidUrl) {
                return await sock.sendMessage(chatId, {
            react: { text: '🧐', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "❕ 𝚃𝚑𝚊𝚝 𝚒𝚜 𝚗𝚘𝚝 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚃𝚒𝚔𝚃𝚘𝚔 𝚕𝚒𝚗𝚔. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚃𝚒𝚔𝚃𝚘𝚔 𝚟𝚒𝚍𝚎𝚘 𝚕𝚒𝚗𝚔..."
            });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        try {
            // Use only Siputzx API
            const apiUrl = `https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`;



            let videoUrl = null;
            let audioUrl = null;
            let title = null;

            // Call Siputzx API
            try {
                const response = await axios.get(apiUrl, { 
                    timeout: 15000,
                    headers: {
                        'accept': '*/*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (response.data && response.data.status) {
                    // Check if the API returned video data
                    if (response.data.data) {
                        // Check for urls array first (this is the main response format)
                        if (response.data.data.urls && Array.isArray(response.data.data.urls) && response.data.data.urls.length > 0) {
                            // Use the first URL from the urls array (usually HD quality)
                            videoUrl = response.data.data.urls[0];
                            title = response.data.data.metadata?.title || "TikTok Video";
                        } else if (response.data.data.video_url) {
                            videoUrl = response.data.data.video_url;
                            title = response.data.data.metadata?.title || "TikTok Video";
                        } else if (response.data.data.url) {
                            videoUrl = response.data.data.url;
                            title = response.data.data.metadata?.title || "TikTok Video";
                        } else if (response.data.data.download_url) {
                            videoUrl = response.data.data.download_url;
                            title = response.data.data.metadata?.title || "TikTok Video";
                        } else {
                            throw new Error("No video URL found in Siputzx API response");
                        }
                    } else {
                        throw new Error("No data field in Siputzx API response");
                    }
                } else {
                    throw new Error("Invalid Siputzx API response");
                }
            } catch (apiError) {
                console.error(`Siputzx API failed: ${apiError.message}`);
            }

            // If Siputzx API didn't work, try the original ttdl method
            if (!videoUrl) {
                try {
                    let downloadData = await ttdl(url);
                    if (downloadData && downloadData.data && downloadData.data.length > 0) {
                        const mediaData = downloadData.data;
                        for (let i = 0; i < Math.min(20, mediaData.length); i++) {
                            const media = mediaData[i];
                            const mediaUrl = media.url;

                            // Check if URL ends with common video extensions
                            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || 
                                          media.type === 'video';

                            if (isVideo) {
                                    await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
                                await sock.sendMessage(chatId, {
                                    video: { url: mediaUrl },
                                    mimetype: "video/mp4",
                                    caption: "𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 𝚋𝚢 ᴘʀᴍᴏ✗\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ"
                                }, { quoted: message });
                            } else {
                                    await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
                                await sock.sendMessage(chatId, {
                                    image: { url: mediaUrl },
                                    caption: "𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 𝚋𝚢 ᴘʀᴍᴏ✗\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ"
                                }, { quoted: message });
                            }
                        }
                        return;
                    }
                } catch (ttdlError) {
                    console.error("❗ 𝚃𝚃𝙳𝙸 𝚏𝚊𝚕𝚕𝚋𝚊𝚌𝚔 𝚊𝚕𝚜𝚘 𝚏𝚊𝚒𝚕𝚍:", ttdlError.message);
                }
            }

            // Send the video if we got a URL from the APIs
            if (videoUrl) {
                try {
                    // Download video as buffer
                    const videoResponse = await axios.get(videoUrl, {
                        responseType: 'arraybuffer',
                        timeout: 60000,
                        maxContentLength: 100 * 1024 * 1024, // 100MB limit
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'video/mp4,video/*,*/*;q=0.9',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Connection': 'keep-alive',
                            'Referer': 'https://www.tiktok.com/'
                        }
                    });
                    
                    const videoBuffer = Buffer.from(videoResponse.data);
                    
                    // Validate video buffer
                    if (videoBuffer.length === 0) {
                        throw new Error("Video buffer is empty");
                    }
                    
                    // Check if it's a valid video file (starts with video file signatures)
                    const isValidVideo = videoBuffer.length > 1000 && (
                        videoBuffer.toString('hex', 0, 4) === '000001ba' || // MP4
                        videoBuffer.toString('hex', 0, 4) === '000001b3' || // MP4
                        videoBuffer.toString('hex', 0, 8) === '0000001866747970' || // MP4
                        videoBuffer.toString('hex', 0, 4) === '1a45dfa3' // WebM
                    );
                    
                    if (!isValidVideo && videoBuffer.length < 10000) {
                        const bufferText = videoBuffer.toString('utf8', 0, 200);
                        if (bufferText.includes('error') || bufferText.includes('blocked') || bufferText.includes('403')) {
                            throw new Error("❗ 𝚁𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚎𝚛𝚛𝚘𝚛 𝚙𝚊𝚐𝚎 𝚒𝚗𝚜𝚝𝚎𝚊𝚍 𝚘𝚏 𝚟𝚒𝚍𝚎𝚘");
                        }
                    }
                    
                    const caption = title ? `*▶️ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁*\n\n┄┄┄┄┄┄┄┄┄┄┄\n🧸 𝚃𝚒𝚝𝚕𝚎: ${title}\n📊 𝚅𝚒𝚎𝚠𝚜: ${views}\n💕 𝙻𝚒𝚔𝚎𝚜 ${likes}\n 👤 𝙿𝚛𝚘𝚏𝚒𝚕𝚎: ${author}\n⏱️ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗: ${duration}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ` : "© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ";
                            await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
                    await sock.sendMessage(chatId, {
                        video: videoBuffer,
                        mimetype: "video/mp4",
                        caption: caption
                    }, { quoted: message });

                    // If we have audio URL, download and send it as well
                    if (audioUrl) {
                        try {
                            const audioResponse = await axios.get(audioUrl, {
                                responseType: 'arraybuffer',
                                timeout: 30000,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                                }
                            });
                            
                            const audioBuffer = Buffer.from(audioResponse.data);
                            
                            await sock.sendMessage(chatId, {
                                audio: audioBuffer,
                                mimetype: "audio/mp3",
                                caption: "🎵 Audio from TikTok"
                            }, { quoted: message });
                        } catch (audioError) {
                            console.error(`❗ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚊𝚞𝚍𝚒𝚘: ${audioError.message}`);
                        }
                    }
                    return;
                } catch (downloadError) {
                    console.error(`❗ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚟𝚒𝚍𝚎𝚘: ${downloadError.message}`);
                    // Fallback to URL method
                    try {
                    const caption = title ? `*▶️ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁*\n\n┄┄┄┄┄┄┄┄┄┄┄\n🧸 𝚃𝚒𝚝𝚕𝚎: ${title}\n📊 𝚅𝚒𝚎𝚠𝚜: ${views}\n💕 𝙻𝚒𝚔𝚎𝚜 ${likes}\n 👤 𝙿𝚛𝚘𝚏𝚒𝚕𝚎: ${author}\n⏱️ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗: ${duration}\n\n© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ` : "© ʙʏ ᴘʀᴍᴏ✗ ᴡᴇʙ";
                            await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });
                        
                        await sock.sendMessage(chatId, {
                            video: { url: videoUrl },
                            mimetype: "video/mp4",
                            caption: caption
                        }, { quoted: message });
                        return;
                    } catch (urlError) {
                        console.error(`❗ 𝚄𝚁𝙻 𝚖𝚎𝚝𝚑𝚘𝚍𝚜 𝚊𝚕𝚜𝚘 𝚏𝚊𝚒𝚕𝚎𝚍: ${urlError.message}`);
                    }
                }
            }

            // If we reach here, no method worked
await sock.sendMessage(chatId, {
            react: { text: '❕', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "⁉️ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚃𝚒𝚔𝚃𝚘𝚔 𝚟𝚒𝚍𝚎𝚘...𝙰𝚕𝚕 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚖𝚎𝚝𝚑𝚘𝚍𝚜 𝚏𝚊𝚒𝚕𝚎𝚍... 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗...."
            },{ quoted: message });
        } catch (error) {
            console.error('Error in TikTok download:', error);
            await sock.sendMessage(chatId, { 
                text: "Failed to download the TikTok video. Please try again with a different link."
            },{ quoted: message });
        }
    } catch (error) {
        console.error('Error in TikTok command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { 
            text: "⚠️ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚝𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛..."
        },{ quoted: message });
    }
}

module.exports = tiktokCommand; 