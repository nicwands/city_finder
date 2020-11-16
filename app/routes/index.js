// Main router entry point, sets up all route modules

import express from 'express';
const router = express.Router();

import indexRouter from './indexRouter';
import loginRouter from './tokenRouter';
import signupRouter from './signupRouter';
import usersRouter from './usersRouter';
import projectsRouter from './projectsRouter';
import messageRouter from './messageRouter';
import tasksRouter from './tasksRouter';
import roleRouter from './roleRouter';

router.use('/', indexRouter);
router.use('/get-token', loginRouter);
router.use('/signup', signupRouter);
router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/messages', messageRouter);
router.use('/tasks', tasksRouter);
router.use('/roles', roleRouter);

export default router;