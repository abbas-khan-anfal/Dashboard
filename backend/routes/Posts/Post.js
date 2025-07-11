import express from 'express';
import { postFileUploader } from '../../config/Cloudinary.js';
import { addPost, deletePost, fetchPosts, fetchSinglePost, searchPostHandler, updatePost } from '../../controllers/Posts/Post.js';
import isDashboardUserAuthenticated from '../../middlewares/DashUserAuth.js';

const router = express.Router();

// router for add post
router.post('/add', isDashboardUserAuthenticated, postFileUploader.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
]), addPost);

// router for delete post
router.delete('/delete', isDashboardUserAuthenticated, deletePost);

// router for update post
router.put('/update', isDashboardUserAuthenticated, postFileUploader.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
]), updatePost);

// router to fetch single post
router.get('/fetchsinglepost/:id', isDashboardUserAuthenticated, fetchSinglePost);

// router to fetch single post
router.get('/search', searchPostHandler);

// router to fetch posts
router.get('/fetch',isDashboardUserAuthenticated,  fetchPosts);

export default router;