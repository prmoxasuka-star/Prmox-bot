const settings = require('../settings');
const { isSudo } = require('./index');

/**
 * Check if a user is owner or sudo
 * @param {string} senderId - User's JID/LID
 * @param {object} sock - Baileys socket (optional)
 * @param {string} chatId - Chat ID (optional)
 * @returns {Promise<boolean>} True if owner/sudo
 */
async function isOwnerOrSudo(senderId, sock = null, chatId = null) {
    // Validate input
    if (!senderId || typeof senderId !== 'string') {
        console.warn('⚠️ [isOwner] Invalid senderId:', senderId);
        return false;
    }

    try {
        // Normalize JID/LID
        const normalizeId = (id) => {
            if (!id) return '';
            // Remove any protocol prefixes and extract base number
            return id.replace(/^[^0-9]+/, '').split(/[@:]/)[0] || '';
        };

        const ownerNumber = settings.ownerNumber || '';
        const ownerClean = normalizeId(ownerNumber);
        const senderClean = normalizeId(senderId);
        
        // Direct owner check
        if (ownerClean && senderClean === ownerClean) {
            return true;
        }
        
        // Check if sender contains owner number (for LID cases)
        if (ownerClean && senderId.includes(ownerClean)) {
            return true;
        }

        // Full JID comparison (with @s.whatsapp.net)
        if (ownerNumber.includes('@') && senderId === ownerNumber) {
            return true;
        }
        
        // Check for sudo users
        try {
            if (await isSudo(senderId)) {
                return true;
            }
        } catch (sudoError) {
            console.error('⚠️ [isOwner] Error checking sudo:', sudoError.message);
        }

        // Group-specific checks (only if sock and chatId are provided)
        if (sock && chatId && chatId.endsWith('@g.us')) {
            return await checkGroupOwner(senderId, sock, chatId, ownerClean);
        }

        return false;
    } catch (error) {
        console.error('❌ [isOwner] Unexpected error:', error.message);
        return false;
    }
}

/**
 * Check if user is owner in group context
 */
async function checkGroupOwner(senderId, sock, chatId, ownerClean) {
    try {
        // Get bot's own LID for comparison
        const botLid = sock.user?.lid || '';
        const botLidClean = botLid.split(/[@:]/)[0] || '';
        
        // Check if sender is bot itself (for commands from bot's own messages)
        if (botLidClean && senderId.includes(botLidClean)) {
            return true;
        }

        // Get group metadata
        let metadata;
        try {
            metadata = await sock.groupMetadata(chatId);
        } catch (groupError) {
            console.warn('⚠️ [isOwner] Failed to fetch group metadata:', groupError.message);
            return false;
        }

        if (!metadata?.participants) {
            return false;
        }

        // Check each participant
        for (const participant of metadata.participants) {
            if (!participant?.id) continue;
            
            const participantId = participant.id;
            const participantLid = participant.lid || '';
            
            // Direct ID match
            if (participantId === senderId) {
                // Check if this participant is the owner
                const participantClean = participantId.split(/[@:]/)[0] || '';
                if (participantClean === ownerClean) {
                    return true;
                }
            }
            
            // LID match
            if (participantLid && senderId.includes(participantLid.split(/[@:]/)[0])) {
                const participantLidClean = participantLid.split(/[@:]/)[0];
                if (participantLidClean === ownerClean) {
                    return true;
                }
            }
        }
        
        return false;
    } catch (error) {
        console.error('⚠️ [isOwner] Group check error:', error.message);
        return false;
    }
}

module.exports = isOwnerOrSudo;