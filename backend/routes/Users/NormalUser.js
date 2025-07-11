import express from 'express';
import { signup, login, logout, getUserDetails, updateUser, fetchAllUsers, deleteUser } from '../../controllers/Users/NormalUser.js';
import { userFileUploader } from '../../config/Cloudinary.js';
import isUserAuthenticated from '../../middlewares/NormalUserAuthh.js';
import { AdminRoleCheck } from '../../middlewares/AdminRoleCheck.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';

const router = express.Router();

// route for signup new user
router.post('/signup', signup);

// route for login user
router.post('/login', login);

// route to logout user
router.get('/logout', isUserAuthenticated, logout);

// route to get user
router.get('/getuser', isUserAuthenticated, getUserDetails);

// route to fetch all users
router.get('/fetchall', isDashboardUserAuthenticated, AdminRoleCheck, fetchAllUsers);

// route to fetch all users
router.get('/fetchsingleuser', isUserAuthenticated, getUserDetails);

// route to update user
router.put('/update', isUserAuthenticated, userFileUploader.single("userImg"), updateUser);

// delete user
router.delete('/deleteuser/:id', isDashboardUserAuthenticated, AdminRoleCheck, deleteUser);

export default router;