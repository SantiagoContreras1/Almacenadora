import { Router } from "express";
import { getNotifications } from "./notificaction.controller.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { esAdmin } from "../middlewares/products/validar-admin.js";

const router = Router();

router.get("/", [validarJWT, esAdmin], getNotifications);

export default router;
