import express from 'express';
import { verifyWebhook, handleIncomingMessage } from '../controllers/webhookController.js';

const router = express.Router();

// Meta sends a GET request here to verify the endpoint
router.get('/', verifyWebhook);

// Meta sends POST requests here when a customer messages a shop
router.post('/', handleIncomingMessage);

export default router;