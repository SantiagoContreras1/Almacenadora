// inputs.routes.js
import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { validarProductoExiste } from "../middlewares/validar-producto.js";
import { saveInput, getInputs, deleteInput, updateInput, getinputId, getMovementsInventory, getTopMovedProducts} from "./input.controller.js"; 
import { get } from "mongoose";

const router = Router();

router.post(
    "/save/",
    [
        validarJWT,
        check("product", "El ID del producto es obligatorio y debe ser un ID válido").isMongoId(),
        check("quantityAdded", "La cantidad añadida es obligatoria, debe ser un número y mayor que 0").isNumeric().toFloat().custom(value => value > 0),
        validarCampos,
        validarProductoExiste,

    ],
    saveInput
);

router.get(
    "/get/",
    [
        validarJWT
    ],
    getInputs
)

router.get(
    "/get/:id",
    [
        validarJWT
    ],
    getinputId
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("quantityAdded", "La cantidad añadida es obligatoria, debe ser un número y mayor que 0").isNumeric().toFloat().custom(value => value > 0),
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

router.get(
    "/movements/:id",
    [
        validarJWT,
        validarCampos,
        validarProductoExiste,
    ],
    getMovementsInventory
)

router.get(
    "/moreActive/:id",
    [
            
    ],
    getTopMovedProducts
)

export default router;