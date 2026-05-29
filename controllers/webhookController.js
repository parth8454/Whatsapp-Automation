import Groq from "groq-sdk";
import { Shop } from "../models/Shop.js";
import { Product } from "../models/Product.js";
import { sendMetaTextMessage } from "../Services/metaApiService.js"; 

// GET endpoint remains intact for verification challenge
export const verifyWebhook = (req, res) => {
    const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            return res.status(200).send(challenge);
        }
        return res.sendStatus(403);
    }
    res.status(400).send("Bad Request");
};

// Production RAG Automation Workflow
export const handleIncomingMessage = async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];

        // Drop out safely if payload is empty or not text (e.g., user sent a sticker)
        if (!message || message.type !== 'text') {
            return res.status(200).send("EVENT_RECEIVED");
        }

        const customerPhone = message.from;
        const customerQuery = message.text.body;
        const shopPhoneId = change.metadata.phone_number_id;

        // 1. Relational Boundary Check: Map the request to the specific tenant shop
        const currentShop = await Shop.findOne({ whatsappPhoneNumberId: shopPhoneId });
        if (!currentShop) {
            console.error(`Tenant lookup failed for Phone ID: ${shopPhoneId}`);
            return res.status(200).send("EVENT_RECEIVED"); 
        }

        // 2. Zero-Liability Gatekeeper: Verify the client provided their own Groq Key
        const merchantKey = currentShop.clientGroqApiKey;
        if (!merchantKey) {
            await sendMetaTextMessage(currentShop, customerPhone, "Store automated assistant is under configuration. Please check back shortly.");
            return res.status(200).send("EVENT_RECEIVED");
        }

        // 3. Context Retrieval: Fetch active menu items belonging strictly to this merchant
        const localCatalog = await Product.find({ shopId: currentShop._id, isAvailable: true });

        // 4. Construct System Instructions with Real-Time Database State
        const targetSystemInstruction = `
            You are an elite, highly concise automated AI sales representative for "${currentShop.businessName}".
            
            Here is the live, official store inventory data fetched straight from our system database:
            ${JSON.stringify(localCatalog)}
            
            OPERATING RULES:
            1. Formulate responses using concise, friendly, colloquial "Hinglish" or clear plain English or hindi. Keep output under 3 short lines.
            2. Base your facts exclusively on the inventory data provided above. 
            3. If an item is out of stock or absent from the database, politely state so, then cross-reference and suggest the closest available matching alternative.
            4. Never invent prices, options, or information outside of the provided catalog data.
        `;

        // 5. Instantiate isolated client-billed inference container
        const groq = new Groq({ apiKey: merchantKey });

        // 6. Run inference via ultra-fast Llama hardware endpoints
        const aiChatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: targetSystemInstruction },
                { role: "user", content: customerQuery }
            ],
            model: "llama-3.1-8b-instant" 
        });

        const replyText = aiChatCompletion.choices[0].message.content;

        // 7. Route raw response text back via Meta APIs to the user
        await sendMetaTextMessage(currentShop, customerPhone, replyText);

        return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
        console.error("Critical Runtime Webhook Failure:", error);
        // Always acknowledge Meta with 200 to prevent automated webhook circuit-breaking
        return res.status(200).send("EVENT_RECEIVED");
    }
};