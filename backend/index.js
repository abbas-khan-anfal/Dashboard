import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/MongoDB.js';
import NormalUserRouter from './routes/Users/NormalUser.js';
import DashUserRoute from './routes/Users/DashUser.js';
import MessageRouter from './routes/Message/Message.js';
import cookieParser from 'cookie-parser';
import ProductRouter from './routes/Products/Product.js';
import ProductCategoryRouter from './routes/Products/ProductCategory.js';
import PostCategoryRouter from './routes/Posts/PostCategory.js';
import PostRouter from './routes/Posts/Post.js';
import SettingRouter from './routes/Settings/Setting.js';
import dashHomeRouter from './routes/Dash_Home/Home.js'
import WishlistRouter from './routes/Wishlist/Wishlist.js';
import CartRouter from './routes/Cart/Cart.js';
import { fileErrorHandler } from './utils/GlobalErrorDetector.js';
import rateLimit from 'express-rate-limit';

// app config
const app = express();

// for development only
// const port = process.env.PORT || 5000;

// call mongoDB connection function
connectDB();

// middlewares
app.use(express.json());
// app.use(cors({
//     origin: [process.env.FRONTEND_URL],
//     methods : ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));

// for vercel deployment
app.use(cors({
    origin: 'https://dashboard-frontend-two-drab.vercel.app',
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

// limit the api using rateLimit
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 200,
    message : "Too many request please try again later",
    standardHeaders : true,
    legacyHeaders : false
});
app.use(limiter);

// endpoints

// normal user endpoint
app.use('/api/normaluser', NormalUserRouter);

// dashboard user endpoint
app.use('/api/dashuser', DashUserRoute);

// message endpoint
app.use('/api/message', MessageRouter);

// product endpoints
app.use('/api/product', ProductRouter);
app.use('/api/productcategory', ProductCategoryRouter);

// post endpoints
app.use('/api/post', PostRouter)
app.use('/api/postcategory', PostCategoryRouter);

// setting endpoint
app.use('/api/setting', SettingRouter);

// wishlist endpoint
app.use('/api/wishlist', WishlistRouter);

// cart endpoint
app.use('/api/cart', CartRouter);

// dashboard home endpoint
app.use('/api/dashboardhome', dashHomeRouter);

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// global file error detector
app.use(fileErrorHandler);


// listen server for development only
// app.listen(port, () => {
//     console.log(`App Listening on port ${port}`);
// });


// for vercel deployment
export default app;