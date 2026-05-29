import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../whatsapp-auto/db.js';
import webhookRoutes from '../whatsapp-auto/routes/webhookRoutes.js';
import authRoutes from '../whatsapp-auto/routes/authRoutes.js';
import shopRoutes from '../whatsapp-auto/routes/shopRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount Independent Multi-Tenant Router Modules
app.use('/api/v1/webhook', webhookRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shop', shopRoutes);

app.get('/', (req, res) => {
    res.status(200).send('WhatsApp SaaS Engine Server is Live 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server configuration deployed successfully on port ${PORT}`);
});