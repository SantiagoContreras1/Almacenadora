import { Router } from "express";
import { check } from "express-validator";

import { esAdmin } from "../middlewares/products/validar-admin.js";
import { existeProveedorForDelete } from "../middlewares/proveedores/validar-proveedores.js";
import { validarJWT } from "../middlewares/validar-JWT.js";

import {
    saveProveedor,
    getProveedores,
    searchProveedorById,
    updateProveedor,
    deleteProveedor
} from "./proveedores.controller.js";

const router = Router()

router.get("/", getProveedores)
router.get("/search/:id", searchProveedorById)

router.post(
    "/save/",
    [
        validarJWT,
        esAdmin,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("telefono", "El teléfono es obligatorio").not().isEmpty(),
        check("email", "El correo electrónico es obligatorio").not().isEmpty(),
        check("categoria", "El ID de la categoría es obligatorio").not().isEmpty()
    ],
    saveProveedor
)

router.put(
    "/update/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "El ID es obligatorio").isMongoId(),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("telefono", "El teléfono es obligatorio").not().isEmpty(),
        check("email", "El correo electrónico es obligatorio").not().isEmpty(),
        check("categoria", "El ID de la categoría es obligatorio").not().isEmpty()
    ],
    updateProveedor
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        existeProveedorForDelete,
        esAdmin,
        check("id", "El ID es obligatorio").isMongoId()
    ],
    deleteProveedor
)

export default router