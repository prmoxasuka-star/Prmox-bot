// isAdmin.js
async function isAdmin(sock, chatId, senderId) {
    try {
        // Early return if invalid inputs
        if (!sock || !chatId || !senderId) return { isSenderAdmin: false, isBotAdmin: false };

        // Safely get group metadata
        const metadata = await sock.groupMetadata(chatId).catch(() => null);
        if (!metadata) return { isSenderAdmin: false, isBotAdmin: false };
        
        const participants = Array.isArray(metadata.participants) ? metadata.participants : [];

        // Bot identifiers
        const botId = sock.user?.id || '';
        const botLid = sock.user?.lid || '';
        const botNumber = botId.split(/[:@]/)[0];       // pure phone number
        const botLidNumeric = botLid.split(/[:@]/)[0];  // numeric part only

        // Sender identifiers
        const senderNumber = senderId.split(/[:@]/)[0];
        const senderIdWithoutSuffix = senderId.split('@')[0];

        // Helper function to safely check admin status - IMPROVED VERSION
        const checkAdmin = (targetId, targetNumber, targetIdWithoutSuffix) => {
            for (const p of participants) {
                if (!p || !p.id) continue;

                const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
                const pId = p.id ? p.id.split('@')[0] : '';
                const pLid = p.lid ? p.lid.split(/[:@]/)[0] : '';
                const pFullId = p.id || '';
                const pFullLid = p.lid || '';
                
                // Check admin status in multiple possible formats
                const isAdminFlag = (
                    p.admin === 'admin' || 
                    p.admin === 'superadmin' ||
                    p.admin === true ||
                    (typeof p.admin !== 'undefined' && p.admin !== null && p.admin !== 'false')
                );

                const matches = (
                    targetId === pFullId ||
                    targetId === pFullLid ||
                    targetNumber === pPhoneNumber ||
                    targetNumber === pId ||
                    targetIdWithoutSuffix === pPhoneNumber ||
                    targetIdWithoutSuffix === pId ||
                    (pLid && targetIdWithoutSuffix === pLid) ||
                    // Additional matching for different ID formats
                    pFullId.includes(targetIdWithoutSuffix) ||
                    (pFullLid && pFullLid.includes(targetIdWithoutSuffix))
                );

                if (matches && isAdminFlag) return true;
            }
            return false;
        };

        const isBotAdmin = checkAdmin(botId, botNumber, botLidNumeric);
        const isSenderAdmin = checkAdmin(senderId, senderNumber, senderIdWithoutSuffix);

        // Alternative check using group participants directly
        if (!isSenderAdmin) {
            // Sometimes the senderId might be in a different format
            for (const p of participants) {
                if (!p || !p.id) continue;
                
                // Check if this participant is the sender
                const isSender = (
                    p.id === senderId ||
                    p.id.includes(senderIdWithoutSuffix) ||
                    (p.lid && p.lid.includes(senderIdWithoutSuffix))
                );
                
                if (isSender) {
                    // Check admin status
                    if (p.admin === 'admin' || p.admin === 'superadmin' || p.admin === true) {
                        return { isSenderAdmin: true, isBotAdmin };
                    }
                }
            }
        }

        return { isSenderAdmin, isBotAdmin };

    } catch (err) {
        // Catch any unexpected errors and ensure safe return
        console.error('⚠️ 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚒𝚜𝙰𝚍𝚖𝚒𝚗', err);
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

module.exports = isAdmin;