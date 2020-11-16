import express from 'express';
const router = express.Router();

import { getTasks } from "../controllers/tasksController";
import { verifyToken } from "../utils/authUtil";

router.post('/',verifyToken, getTasks);

export default router;