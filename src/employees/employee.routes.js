import { Router } from "express";
import {check} from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { esAdmin } from "../middlewares/products/validar-admin.js";
import { saveEmployee,getEmployees,updateEmployee,deleteEmployee, getEmployeeId } from "./employee.controller.js";

const router = Router()

router.post(
    "/save/",
    [
        validarJWT,
        esAdmin,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("apellido", "El apellido es obligatorio").not().isEmpty(),
        check("puesto", "El puesto es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveEmployee
)

router.get(
    "/get/",
    getEmployees
)

router.get(
    "/get/:id",
    getEmployeeId
)

router.put(
    "/update/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "El ID es obligatorio").isMongoId(),
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("apellido", "El apellido es obligatorio").not().isEmpty(),
        check("puesto", "El puesto es obligatorio").not().isEmpty(),
        validarCampos
    ],
    updateEmployee
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "El ID es obligatorio").isMongoId(),
        check("confirm", "El valor de confirm es obligatorio").isBoolean(),
        validarCampos
    ],
    deleteEmployee
)

export default router