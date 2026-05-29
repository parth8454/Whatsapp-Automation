import axios from 'axios';

/**
 * Sends a standard text message to a customer via Meta WhatsApp Cloud API.
 * @param {Object} shop - The Mongoose Shop document representing the tenant.
 * @param {string} to - The customer's phone number with country code (e.g., "91XXXXXXXXXX").
 * @param {string} text - The message content to send.
 */
export const sendMetaTextMessage = async (shop, to, text) => {
    const { whatsappPhoneNumberId, metaPermanentAccessToken } = shop;

    // Guard clause to check if tenant has fully configured Meta credentials
    if (!whatsappPhoneNumberId || !metaPermanentAccessToken) {
        console.error(`Meta API Error: Missing configuration for Shop ID: ${shop._id}`);
        return null;
    }

    // Meta Graph API base endpoint for WhatsApp Cloud API
    const url = `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`;

    // Strict payload format required by Meta
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
            preview_url: false,
            body: text
        }
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${metaPermanentAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Message successfully sent via Meta API. Message ID: ${response.data.messages?.[0]?.id}`);
        return response.data;
    } catch (error) {
        console.error("Meta outbound API call failed:", error.response?.data || error.message);
        throw error;
    }
};