import { Router } from "express";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { getAllMovements, getWeeklyInventoryMovements} from "./movement.controller.js";

const router = Router();

router.get("/", [validarJWT], getAllMovements);
router.get("/weekly", getWeeklyInventoryMovements)


export default router