import express from 'express';
import { updateShopSettings, addProduct, getShopCatalog } from '../controllers/shopController.js';

const router = express.Router();

router.put('/settings', updateShopSettings);
router.post('/products', addProduct);
router.get('/:shopId/products', getShopCatalog);

export default router;