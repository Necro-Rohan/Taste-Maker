import express from 'express';
import { getProfile, updateProfile, updateEmail, updatePassword, disableAccount, permanentDelete } from '../controllers/profile.controller.js';

const router = express.Router();

router.get('/me', getProfile);

router.patch('/update', updateProfile);
router.patch('/update-email', updateEmail);
router.patch('/update-password', updatePassword);

router.post('/disable', disableAccount)

router.delete('/delete', permanentDelete)


export default router;