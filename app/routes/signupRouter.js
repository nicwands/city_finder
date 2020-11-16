import express from 'express';
const router = express.Router();

import { getSignup } from "../controllers/signupController";

router.post('/', getSignup);

export default router;