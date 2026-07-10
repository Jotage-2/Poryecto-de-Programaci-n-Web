import { Router } from 'express';
import { createGroup, getGroups, toggleMembership } from '../controllers/groupController.js';

const router = Router();

router.post('/', createGroup);
router.get('/', getGroups);
router.post('/:id/membership', toggleMembership);

export default router;
