import express from 'express';
import { addProductCategory, deleteProductCategory, fetchAllProductCategories, fetchProductCategory, fetchSigleCategory, updateProductCategory } from '../../controllers/Products/ProductCategory.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';
import { AdminRoleCheck } from '../../middlewares/AdminRoleCheck.js';

const router = express.Router();

router.get('/fetch', isDashboardUserAuthenticated, AdminRoleCheck, fetchProductCategory);

router.post('/add', isDashboardUserAuthenticated, AdminRoleCheck, addProductCategory);

router.put('/update', isDashboardUserAuthenticated, AdminRoleCheck, updateProductCategory);

router.delete('/delete', isDashboardUserAuthenticated, AdminRoleCheck, deleteProductCategory);

// route to fetch categories
router.get('/fetchall', isDashboardUserAuthenticated, fetchAllProductCategories);

// route to fetch single category
router.get('/singlecategory/:id', isDashboardUserAuthenticated, AdminRoleCheck, fetchSigleCategory);

export default router;