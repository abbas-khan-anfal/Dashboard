import express from 'express';
import { addProductToWishlist, DeleteWishlist, fetchWishlistItems } from '../../controllers/Wishlist/Wishlist.js';
import isUserAuthenticated from '../../middlewares/NormalUserAuthh.js';

const router = express.Router();

router.post('/add',isUserAuthenticated, addProductToWishlist);

router.delete('/delete',isUserAuthenticated, DeleteWishlist);

router.get('/fetch',isUserAuthenticated, fetchWishlistItems);

export default router;