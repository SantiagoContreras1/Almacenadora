import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js"
import { esAdmin } from "../middlewares/products/validar-admin.js";
import { categoryExists, categoryExistsForDelete } from "../middlewares/products/validar-categoria.js";

import {saveCategory,getCategories,updateCategory,deleteCategory} from "./category.controller.js"

const router = Router()

router.get("/get/",getCategories)

router.post(
    "/save/",
    [
        validarJWT,
        esAdmin,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatorio").not().isEmpty(),
        categoryExists,
        validarCampos
    ],
    saveCategory
)

router.put(
    "/update/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "El nombre es obligatorio").isMongoId(),
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatorio").not().isEmpty(),
        categoryExists,
        validarCampos
    ],
    updateCategory
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "El ID es obligatorio").isMongoId(),
        categoryExistsForDelete,
        check("confirm", "El valor de confirm es obligatorio").isBoolean(),
        validarCampos
    ],
    deleteCategory
)

export default router