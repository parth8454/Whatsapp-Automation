import { Shop } from '../models/Shop.js';
import { Product } from '../models/Product.js';

// Update Meta Credentials & Groq Keys
export const updateShopSettings = async (req, res) => {
    try {
        const { shopId, whatsappPhoneNumberId, metaPermanentAccessToken, clientGroqApiKey } = req.body;

        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { whatsappPhoneNumberId, metaPermanentAccessToken, clientGroqApiKey },
            { new: true, runValidators: true }
        );

        if (!updatedShop) return res.status(404).json({ error: "Shop not found" });
        res.status(200).json({ message: "Dashboard settings securely updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Catalog CRUD: Add Product
export const addProduct = async (req, res) => {
    try {
        const { shopId, itemName, price } = req.body;

        const newProduct = await Product.create({ shopId, itemName, price });
        res.status(201).json({newProduct,message:"Added"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Catalog CRUD: Fetch Shop Inventory
export const getShopCatalog = async (req, res) => {
    try {
        const { shopId } = req.params;
        const catalog = await Product.find({ shopId });
        res.status(200).json(catalog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

