import express from 'express';
const router = express.Router();

import { newUserRole, searchRole } from "../controllers/roleController";
import {verifyToken} from "../utils/authUtil";

router.post('/new-user-role', verifyToken, newUserRole);
router.post('/search-role', verifyToken, searchRole);

export default router;