import express from 'express';
const router = express.Router();

import { getProjects, newProject, getBudget, newBudgetItem } from "../controllers/projectsController";
import { verifyToken } from "../utils/authUtil";

router.get('/',verifyToken, getProjects);
router.post('/new-project',verifyToken, newProject);
router.post('/budget',verifyToken, getBudget);
router.post('/new-budget-item',verifyToken, newBudgetItem);

export default router;