import express from 'express';
const router = express.Router();

import { getMessages } from "../controllers/messageController";
import { verifyToken } from "../utils/authUtil";

router.post('/', verifyToken ,getMessages);

export default router;