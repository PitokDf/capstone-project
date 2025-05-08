import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { prisma } from "../config/prisma";
import { time } from "console";

const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5)
}

export const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecond = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSecond / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecond < 60) return `${diffSecond} seconds ago`
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('id-ID')
}

function formatTimeRange(start: Date, end: Date): string {
    const now = new Date();

    const isToday = start.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === start.toDateString();

    let dayLabel = "";

    if (isToday) {
        dayLabel = "Today";
    } else if (isTomorrow) {
        dayLabel = "Tomorrow";
    } else {
        // Format nama hari dan tanggal: misalnya "Saturday, 3 May 2025"
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        dayLabel = start.toLocaleDateString('en-US', options);
    }

    // Format jam: 2 digit (tanpa detik)
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const startTime = start.toLocaleTimeString('en-US', timeOptions);
    const endTime = end.toLocaleTimeString('en-US', timeOptions);

    return `${dayLabel}, ${startTime} - ${endTime}`;
}



export const getStats = async (req: Request, res: Response) => {
    try {
        const totalClasses = await prisma.class.count()
        const totalLectures = await prisma.lecture.count()
        const timeSlots = await prisma.timeSlot.count()
        const totalCourses = await prisma.course.count() // ambil total mata kuliah

        // ambil data jadwal yang baru saja ditambahkan atau di update
        const recentSchedule = (await prisma.schedule.findMany({
            orderBy: { updatedAt: "desc" },
            take: 5,
            include:
            {
                course: true,
                lecture: { select: { name: true } },
                room: { select: { name: true } },
                timeSlot: { select: { day: true, starTime: true, endTime: true } }
            },
        })).map(schedule => {
            return {
                id: schedule.id,
                courseCode: schedule.course.code,
                courseName: schedule.course.name,
                lecturer: schedule.lecture.name,
                room: schedule.room.name,
                day: schedule.timeSlot.day,
                time: `${formatTime(schedule.timeSlot.starTime)} - ${formatTime(schedule.timeSlot.endTime)}`,
                updated: getTimeAgo(schedule.updatedAt)
            }
        })

        const upcomingEvents = (await prisma.schedule.findMany({
            where: {
                timeSlot: {
                    starTime: { gte: new Date() },
                }
            },
            include: { course: true, room: true, lecture: true, timeSlot: true },
            orderBy: { timeSlot: { starTime: "asc" } },
            take: 5
        })).map((event) => {
            return {
                title: event.course.name,
                time: formatTimeRange(event.timeSlot.starTime, event.timeSlot.endTime),
                lecturer: event.lecture.name,
                room: event.room.name
            }
        })

        const rooms = (await prisma.room.findMany({ include: { Schedule: true } }))
        const utilization = {
            '0-20%': 0,
            '20-40%': 0,
            '40-60%': 0,
            '60-80%': 0,
            '80-100%': 0
        }

        rooms.forEach(room => {
            const usage = room.Schedule.length
            const percentage = timeSlots > 0 ? (usage / timeSlots) * 100 : 0// usage = 10 -> (5 / 10) * 100 = 50% 
            if (percentage <= 20) utilization["0-20%"]++;
            else if (percentage <= 40) utilization["20-40%"]++;
            else if (percentage <= 60) utilization["40-60%"]++; // maka utilization.value akan nambah satu
            else if (percentage <= 80) utilization["60-80%"]++;
            else utilization["80-100%"]++;

        });

        const roomUtilization = Object.entries(utilization).map(([name, value]) => ({
            name, value
        }))
        return res.status(200).json({
            message: "Berhasil mendapatkan data.",
            data: {
                totalClasses,
                totalLectures,
                totalCourses,
                recentSchedule,
                upcomingEvents,
                roomUtilization
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}