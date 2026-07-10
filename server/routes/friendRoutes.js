import { Router } from 'express';
import { sendRequest, respondRequest, getUserFriends, removeFriend } from '../controllers/friendController.js';

const router = Router();

router.post('/request', sendRequest);
router.post('/respond/:id', respondRequest);
router.delete('/remove', removeFriend);
router.get('/:userId', getUserFriends);

export default router;
