import express from 'express';
import { PrismaClient } from '@prisma/client';
import { backtrack } from '../utils/bactracking-v2';

const scheduleRouter = express.Router();
const prisma = new PrismaClient();

scheduleRouter.get('/generate-schedule', async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        const lectures = await prisma.lecture.findMany();
        const rooms = await prisma.room.findMany();
        const timeSlots = await prisma.timeSlot.findMany();

        const schedule: any = [];
        const success = backtrack(courses, lectures, rooms, timeSlots, schedule);

        if (success) {
            await prisma.schedule.deleteMany()
            const schedules = await prisma.schedule.createManyAndReturn({ data: schedule });
            res.status(200).json({ message: 'Penjadwalan berhasil', data: schedule, schedules });
        } else {
            res.status(400).json({ message: 'Penjadwalan gagal' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

export default scheduleRouter;
