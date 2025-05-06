import express from 'express';
import { PrismaClient } from '@prisma/client';
import { backtrack } from '../utils/bactracking-v2';
import { jwtCheckToken } from '../middlewares/jwtCheckToken';
import { addSchedules, deleteSchedules, generateSchedule, getSchedules, updateSchedules } from '../controllers/schedule.controller';
import { validateSchedule } from '../validators/scheduleValidator';
import { checkValidasiRequest } from '../middlewares/checkValidasi';
import { generateOptimizedSchedule } from '../utils/bactracking-v3';

const scheduleRouter = express.Router();
const prisma = new PrismaClient();

scheduleRouter.post('/generate', jwtCheckToken, generateSchedule);

scheduleRouter.get("/", jwtCheckToken, getSchedules)
scheduleRouter.post("/", jwtCheckToken, validateSchedule, checkValidasiRequest, addSchedules)
scheduleRouter.put("/:id", jwtCheckToken, validateSchedule, checkValidasiRequest, updateSchedules)
scheduleRouter.delete("/:id", jwtCheckToken, deleteSchedules)
export default scheduleRouter;
