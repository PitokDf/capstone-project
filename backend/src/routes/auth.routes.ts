import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/authValidator";
import { login as loginController, logout, register as registerController } from "../controllers/auth.controller";
import { checkValidasiRequest } from "../middlewares/checkValidasi";

const authRoute = Router()

authRoute.post("/login", loginValidator, checkValidasiRequest, loginController)
authRoute.post("/register", registerValidator, checkValidasiRequest, registerController)
authRoute.post("/logout", logout)

export default authRoute