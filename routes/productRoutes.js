import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createProduct,updateProduct,deleteProduct, sellProduct, viewBuyers, getAllProducts } from '../controllers/productController.js';

const router = express.Router();


router.post('/create', authMiddleware(['retailer']), createProduct);
router.put('/update', authMiddleware(['retailer']), updateProduct);
router.delete('/delete', authMiddleware(['retailer']), deleteProduct);
router.put('/sell/:productId', authMiddleware(['retailer']), sellProduct);
router.get('/buyers', authMiddleware(['user']), viewBuyers);


router.get('/', getAllProducts);

export default router;
