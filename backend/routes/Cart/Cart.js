import express from 'express';
import { addToCartHandler, deleteFromCartHandler, fetchCartItems, updateCartQtyHandler } from '../../controllers/Cart/Cart.js';
import isUserAuthenticated from '../../middlewares/NormalUserAuthh.js';

const router = express.Router();

router.post('/addtocart',isUserAuthenticated, addToCartHandler);

router.delete('/deletefromcart',isUserAuthenticated, deleteFromCartHandler);

router.get('/fetchcartitems',isUserAuthenticated, fetchCartItems);

router.get('/updateqty',isUserAuthenticated, updateCartQtyHandler);

export default router;