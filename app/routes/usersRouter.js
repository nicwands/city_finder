import express from 'express';
const router = express.Router();

import { getUsers, searchUsers, getUserResume, getCurrentUser, updateUser, uploadImage } from "../controllers/usersController";
import { verifyToken } from "../utils/authUtil";

router.get('/', verifyToken , getUsers);
router.post('/search', verifyToken , searchUsers);
router.post('/get-resume', verifyToken , getUserResume);
router.get('/current', verifyToken , getCurrentUser);
router.post('/update', verifyToken , updateUser);
router.post('/upload-image', verifyToken , uploadImage);

export default router;