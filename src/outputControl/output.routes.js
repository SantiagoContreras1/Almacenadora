import { Router } from "express";
import {check} from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { esAdmin } from "../middlewares/products/validar-admin.js";
import { saveOutput, getOutputs, getoutputId, updateOutput, deleteOutput } from "./output.controller.js";

const router = Router();

router.post(
    "/save/",
    [
        validarJWT,
        esAdmin,
        check("product", "El producto es obligatorio").not().isEmpty(),
        check("quantity", "La cantidad es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    saveOutput
)

router.get(
    "/get/",
    [
        validarJWT,
        esAdmin,
    ],
    getOutputs
)

router.get(
    "/get/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "ID no válido").isMongoId(),
        validarCampos,
    ],
    getoutputId
)

router.put(
    "/update/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "ID no válido").isMongoId(),
        check("product", "El producto es obligatorio").not().isEmpty(),
        check("quantityRemoved", "La cantidad es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    updateOutput
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "ID no válido").isMongoId(),
        validarCampos,
    ],
    deleteOutput
)

export default router