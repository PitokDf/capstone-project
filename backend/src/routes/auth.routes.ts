import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/authValidator";
import { login as loginController, register as registerController } from "../controllers/auth.controller";

const authRoute = Router()

authRoute.post("/login", loginValidator, loginController)
authRoute.post("/register", registerValidator, registerController)

export default authRoute