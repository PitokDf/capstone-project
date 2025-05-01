import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { addTimeSlot, deleteTimeSlot, getTimeSlots, updateTimeSlot } from "../controllers/timeSlot.controller";
import { validateTimeslot, validateUpdateTimeslot } from "../validators/timeSlotValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";

const timeSlotRouter = Router();

timeSlotRouter.get("/", jwtCheckToken, getTimeSlots)
timeSlotRouter.post("/", jwtCheckToken, validateTimeslot, checkValidasiRequest, addTimeSlot)
timeSlotRouter.put("/:id", jwtCheckToken, validateUpdateTimeslot, checkValidasiRequest, updateTimeSlot)
timeSlotRouter.delete("/:id", jwtCheckToken, deleteTimeSlot)

export default timeSlotRouter