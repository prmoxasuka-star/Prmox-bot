const { igdl } = require("ruhend-scraper");

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

// Function to extract unique media URLs with simple deduplication
function extractUniqueMedia(mediaData) {
    const uniqueMedia = [];
    const seenUrls = new Set();
    
    for (const media of mediaData) {
        if (!media.url) continue;
        
        // Only check for exact URL duplicates
        if (!seenUrls.has(media.url)) {
            seenUrls.add(media.url);
            uniqueMedia.push(media);
        }
    }
    
    return uniqueMedia;
}

// Function to validate media URL
function isValidMediaUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // Accept any URL that looks like media
    return url.includes('cdninstagram.com') || 
           url.includes('instagram') || 
           url.includes('http');
}

async function instagramCommand(sock, chatId, message) {
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
            react: { text: '🤭', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "🐋 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚗 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 𝚕𝚒𝚗𝚔 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚟𝚒𝚍𝚎𝚘..."
            });
        }

        // Check for various Instagram URL formats
        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];

        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));
        
        if (!isValidUrl) {
                await sock.sendMessage(chatId, {
            react: { text: '🧐', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "❗ 𝚃𝚑𝚊𝚝 𝚒𝚜 𝚗𝚘𝚝 𝚊 𝚟𝚊𝚕𝚒𝚍 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 𝚕𝚒𝚗𝚔... 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 𝚕𝚒𝚗𝚔..."
            });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        const downloadData = await igdl(text);
        
        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
                await sock.sendMessage(chatId, {
            react: { text: '❕', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "⛓️‍💥 𝙽𝚘 𝚖𝚎𝚍𝚒𝚊 𝚏𝚘𝚞𝚗𝚍 𝚊𝚝 𝚝𝚑𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎𝚍 𝚕𝚒𝚗𝚔... 𝚃𝚑𝚎 𝚙𝚘𝚜𝚝 𝚖𝚒𝚐𝚑𝚝 𝚋𝚎 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚘𝚛 𝚝𝚑𝚎 𝚕𝚒𝚗𝚔 𝚒𝚜 𝚒𝚗𝚟𝚊𝚕𝚒𝚍..."
            });
        }

        const mediaData = downloadData.data;
        
        // Simple deduplication - just remove exact URL duplicates
        const uniqueMedia = extractUniqueMedia(mediaData);
        
        // Limit to maximum 20 unique media items
        const mediaToDownload = uniqueMedia.slice(0, 20);
        
        if (mediaToDownload.length === 0) {
                await sock.sendMessage(chatId, {
            react: { text: '❕', key: message.key }
        });
            return await sock.sendMessage(chatId, { 
                text: "⛓️‍💥 𝙽𝚘 𝚟𝚊𝚕𝚒𝚍 𝚖𝚎𝚍𝚒𝚊 𝚏𝚘𝚞𝚗𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍. 𝚃𝚑𝚒𝚜 𝚖𝚒𝚐𝚑𝚝 𝚋𝚎 𝚊 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚙𝚘𝚜𝚝 𝚘𝚛 𝚝𝚑𝚎 𝚜𝚌𝚛𝚊𝚙𝚎𝚛 𝚏𝚊𝚒𝚕𝚎𝚍..."
            });
        }

        // Download all media silently without status messages
        for (let i = 0; i < mediaToDownload.length; i++) {
            try {
                const media = mediaToDownload[i];
                const mediaUrl = media.url;

                // Check if URL ends with common video extensions
                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || 
                              media.type === 'video' || 
                              text.includes('/reel/') || 
                              text.includes('/tv/');

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
                
                // Add small delay between downloads to prevent rate limiting
                if (i < mediaToDownload.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (mediaError) {
                console.error(`Error downloading media ${i + 1}:`, mediaError);
                // Continue with next media if one fails
            }
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
                await sock.sendMessage(chatId, {
            react: { text: '⁉️', key: message.key }
        });
        await sock.sendMessage(chatId, { 
            text: "⚠️ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚝𝚑𝚎 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 𝚛𝚎𝚚𝚞𝚎𝚜𝚝... 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛..."
        });
    }
}

module.exports = instagramCommand;
