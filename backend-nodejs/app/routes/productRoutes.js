import express from 'express';
import { 
  getProductByBarcode, 
  createProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { validateRequest, productSchema } from '../middleware/validation.js';

const router = express.Router();

// GET /{barcode} - Main barcode scanning endpoint (mounted on /scan)
router.get('/:barcode', getProductByBarcode);

// GET /products - Get all products
router.get('/products', getAllProducts);

// POST /products - Create new product
router.post('/products', validateRequest(productSchema), createProduct);

// PUT /products/{barcode} - Update product
router.put('/products/:barcode', validateRequest(productSchema), updateProduct);

// DELETE /products/{barcode} - Delete product
router.delete('/products/:barcode', deleteProduct);

export default router;
