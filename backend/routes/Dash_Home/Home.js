import express from 'express';
import { fetchDashboardCardsData } from "../../controllers/Dash_Home/Home.js";
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';

const router = express.Router();

router.get('/home', isDashboardUserAuthenticated, fetchDashboardCardsData);

export default router;