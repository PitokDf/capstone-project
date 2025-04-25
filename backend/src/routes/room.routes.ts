import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { addRoomValidator, updateRoomValidator } from "../validators/roomValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";
import { addRoom, deleteRoom, findRoomById, getAllRoom, updateRoom } from "../controllers/room.controller";

const roomRouter = Router()

roomRouter.post("/", jwtCheckToken, addRoomValidator, checkValidasiRequest, addRoom)
roomRouter.get("/", jwtCheckToken, getAllRoom)
roomRouter.get("/:id", jwtCheckToken, findRoomById)
roomRouter.delete("/:id", jwtCheckToken, deleteRoom)
roomRouter.put("/:id", jwtCheckToken, updateRoomValidator, checkValidasiRequest, updateRoom)

export default roomRouter;