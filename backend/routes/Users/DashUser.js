import express from 'express';
import { signup, login, logout, getUserDetails, updateUser, fetchAllUsers, deleteUser, fetchSingleUser, editUserProfile } from '../../controllers/Users/DashUser.js';
import { userFileUploader } from '../../config/Cloudinary.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';
import { AdminRoleCheck } from '../../middlewares/AdminRoleCheck.js';

const router = express.Router();

// route for signup new user
router.post('/signup', isDashboardUserAuthenticated, AdminRoleCheck, signup);

// route for login user
router.post('/login', login);

// route to logout user
router.get('/logout', isDashboardUserAuthenticated, logout);

// route to get user
router.get('/getuser', isDashboardUserAuthenticated, getUserDetails);

// route to update user by admin
router.put('/update', isDashboardUserAuthenticated, AdminRoleCheck, userFileUploader.single("userImg"), updateUser);

// route to edit profile by user
router.put('/edituserprofile', isDashboardUserAuthenticated, userFileUploader.single("userImg"), editUserProfile);

// route to fetch all users
router.get('/fetchall', isDashboardUserAuthenticated, AdminRoleCheck, fetchAllUsers);

// delete user
router.delete('/deleteuser/:id', isDashboardUserAuthenticated, AdminRoleCheck, deleteUser);

// delete user
router.get('/fetchsingleuser/:id', isDashboardUserAuthenticated, AdminRoleCheck, fetchSingleUser);

export default router;