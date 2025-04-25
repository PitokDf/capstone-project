import { Router } from "express"
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { getAllUser } from "../controllers/user.controller";

const userRouter = Router()

userRouter.get("/", jwtCheckToken, getAllUser)

export default userRouter;