// All main index.js routes

import express from 'express';
const router = express.Router();

import { getIndexData } from "../controllers/indexController";
import { verifyToken } from "../utils/authUtil";

router.get('/', verifyToken, getIndexData);

export default router;