import { Router } from "express";
import authRoute from "./auth.routes";
import lectureRoute from "./lecture.routes";
import roomRouter from "./room.routes";
import courseRouter from "./course.routes";
import timeSlotRouter from "./timeSlot.routes";
import scheduleRouter from "./schedule.routes";
import classRouter from "./class.routes";
import adminRouter from "./admin.routes";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

const apiRouter = Router()
apiRouter.use("/auth", authRoute)
apiRouter.use("/lecture", lectureRoute)
apiRouter.use("/room", roomRouter);
apiRouter.use("/course", courseRouter);
apiRouter.use("/timeslot", timeSlotRouter);
apiRouter.use("/schedule", scheduleRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/classes", classRouter);
apiRouter.get('/verify', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token required' });
        }

        const token = authHeader.substring(7);
        const decoded = verify(token, config.jwtSecret);

        return res.status(200).json({
            message: 'Token valid',
            user: decoded
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
})
export default apiRouter