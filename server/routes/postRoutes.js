import { Router } from 'express';
import { createPost, getPosts, toggleLike, deletePost } from '../controllers/postController.js';

const router = Router();

router.post('/', createPost);
router.get('/', getPosts);
router.post('/:id/like', toggleLike);
router.delete('/:id', deletePost);

export default router;
