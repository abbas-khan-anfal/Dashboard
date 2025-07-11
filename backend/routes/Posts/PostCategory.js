import express from "express";
import { addPostCategory, deletePostCategory, fetchAllCategories, fetchPostCategories, fetchSigleCategory, updatePostCategory } from "../../controllers/Posts/PostCategory.js";
const router = express.Router();
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';
import { AdminRoleCheck } from '../../middlewares/AdminRoleCheck.js';

// route to add category
router.post('/add', isDashboardUserAuthenticated, AdminRoleCheck, addPostCategory);

// route to delete category
router.delete('/delete', isDashboardUserAuthenticated, AdminRoleCheck, deletePostCategory);

// route to update category
router.put('/update', isDashboardUserAuthenticated, AdminRoleCheck, updatePostCategory);

// route to fetch categories
router.get('/fetch', isDashboardUserAuthenticated, AdminRoleCheck, fetchPostCategories);

// route to fetch categories
router.get('/fetchall', isDashboardUserAuthenticated, fetchAllCategories);

// route to fetch single category
router.get('/singlecategory/:id', isDashboardUserAuthenticated, AdminRoleCheck, fetchSigleCategory);

export default router;