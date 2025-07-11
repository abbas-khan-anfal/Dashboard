import express from 'express';
import { settingFileUploader } from '../../config/Cloudinary.js'
import { fetchSingleSetting, updateSiteSettings } from '../../controllers/Settings/Setting.js';
import { AdminRoleCheck } from '../../middlewares/AdminRoleCheck.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';

const router = express.Router();

router.get('/fetch', isDashboardUserAuthenticated, AdminRoleCheck, fetchSingleSetting);

// route to update settings
router.put('/update', isDashboardUserAuthenticated, AdminRoleCheck, settingFileUploader.single('site_logo'), updateSiteSettings);

export default router;