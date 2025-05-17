import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { addTimeSlot, deleteTimeSlot, getTimeSlots, statTimeSlot, timeSlotBulkDelete, updateTimeSlot } from "../controllers/timeSlot.controller";
import { validateTimeslot, validateUpdateTimeslot } from "../validators/timeSlotValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";

const timeSlotRouter = Router();

timeSlotRouter.get("/", getTimeSlots)
timeSlotRouter.get("/stats", jwtCheckToken, statTimeSlot)
timeSlotRouter.post("/", jwtCheckToken, validateTimeslot, checkValidasiRequest, addTimeSlot)
timeSlotRouter.put("/:id", jwtCheckToken, validateUpdateTimeslot, checkValidasiRequest, updateTimeSlot)
timeSlotRouter.delete("/:id", jwtCheckToken, deleteTimeSlot)
timeSlotRouter.delete("/bulk-delete/:ids", jwtCheckToken, timeSlotBulkDelete)

export default timeSlotRouter