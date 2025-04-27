import { Router } from "express";
import {register,login} from "./auth.controller.js"
import {loginValidator,registerValidator} from "../middlewares/login.js"

const router = Router()

router.post(
    "/register/",
    registerValidator,
    register
)

router.post(
    "/login/",
    loginValidator,
    login
)

export default router