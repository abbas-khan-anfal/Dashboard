import express from 'express';
import { addUserMessage, deleteUserMessage, fetchMessages, fetchSingleMessage } from '../../controllers/Message/Message.js';
const router = express.Router();
import { AdminRoleCheck } from '../../middlewares/AdminRoleCheck.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';

router.post('/add', addUserMessage);

router.delete('/delete', isDashboardUserAuthenticated, AdminRoleCheck, deleteUserMessage);

router.get('/fetchsinglemsg', isDashboardUserAuthenticated, AdminRoleCheck, fetchSingleMessage);

router.get('/fetch', isDashboardUserAuthenticated, AdminRoleCheck, fetchMessages);

export default router;