import { Router } from "express";
import authRoute from "./auth.routes";
import lectureRoute from "./lecture.routes";
import roomRouter from "./room.routes";
import courseRouter from "./course.routes";
import timeSlotRouter from "./timeSlot.routes";
import scheduleRouter from "./schedule.routes";
import classRouter from "./class.routes";
import adminRouter from "./admin.routes";

const apiRouter = Router()
apiRouter.use("/auth", authRoute)
apiRouter.use("/lecture", lectureRoute)
apiRouter.use("/room", roomRouter);
apiRouter.use("/course", courseRouter);
apiRouter.use("/timeslot", timeSlotRouter);
apiRouter.use("/schedule", scheduleRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/classes", classRouter);
export default apiRouter