import express from 'express';
import { addProduct, deleteProduct, fetchProducts, fetchSingleProduct, searchProductHandler, updateProduct } from '../../controllers/Products/Product.js';
import { productFileUploader } from '../../config/Cloudinary.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';

const router = express.Router();

// router for add product
router.post('/add', isDashboardUserAuthenticated, productFileUploader.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
]), addProduct);

// router for delete product
router.delete('/delete', isDashboardUserAuthenticated, deleteProduct);

// router for update product
router.put('/update', isDashboardUserAuthenticated, productFileUploader.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
]), updateProduct);

// router to fetch products
router.get('/fetchproducts', isDashboardUserAuthenticated, fetchProducts);

// router to fetch single product
router.get('/fetchsingleproduct/:id', isDashboardUserAuthenticated, fetchSingleProduct);

// router to fetch single product
router.get('/search', searchProductHandler);

export default router;