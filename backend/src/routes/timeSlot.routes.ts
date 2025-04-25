import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { getTimeSlots } from "../controllers/timeSlot.controller";

const timeSlotRouter = Router();

timeSlotRouter.get("/", jwtCheckToken, getTimeSlots)
timeSlotRouter.post("/", jwtCheckToken, getTimeSlots)

export default timeSlotRouter