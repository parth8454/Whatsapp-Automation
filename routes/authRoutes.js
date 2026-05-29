import express from 'express';
import { registerShop, loginShop } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerShop);
router.post('/login', loginShop);

export default router;