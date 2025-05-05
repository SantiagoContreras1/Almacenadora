// inputs.routes.js
import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { validarProductoExiste } from "../middlewares/validar-producto.js";
import { saveInput, getInputs, deleteInput, updateInput, getinputId} from "./input.controller.js"; 

const router = Router();

router.post(
    "/save/",
    [
        validarJWT,
        check("product", "El ID del producto es obligatorio y debe ser un ID válido").isMongoId(),
        check("quantity", "La cantidad añadida es obligatoria, debe ser un número y mayor que 0").isNumeric().toFloat().custom(value => value > 0),
        validarCampos,
        validarProductoExiste,

    ],
    saveInput
);

router.get(
    "/",
    [
        validarJWT
    ],
    getInputs
)

router.get(
    "/:id",
    [
        validarJWT
    ],
    getinputId
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("quantity", "La cantidad añadida es obligatoria, debe ser un número y mayor que 0").isNumeric().toFloat().custom(value => value > 0),
        validarCampos,
    ],
    updateInput
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id", "El ID es obligatorio").isMongoId(),
        check("confirm", "El valor de confirm es obligatorio").isBoolean(),
        validarCampos
    ],
    deleteInput
)

export default router;