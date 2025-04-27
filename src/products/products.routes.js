import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { esAdmin } from "../middlewares/products/validar-admin.js";
import { categoryExists } from "../middlewares/products/validar-categoria.js";

import {
  saveProduct,
  getProducts,
  searchProduct,
  updateProduct,
  deleteProduct,
} from "./products.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/search/:id", [validarJWT], searchProduct);

router.post(
  "/save/",
  [
    validarJWT,
    esAdmin,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("price", "El precio es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatorio").not().isEmpty(),
    categoryExists,
    validarCampos,
  ],
  saveProduct
);

router.put(
  "/update/:id",
  [
    validarJWT,
    esAdmin,
    check("id", "ID no válido").isMongoId(),
    categoryExists,
    validarCampos,
  ],
  updateProduct
);

router.delete(
  "/delete/:id",
  [
    validarJWT,
    esAdmin,
    check("id", "ID no válido").isMongoId(),
    validarCampos,
  ],

  deleteProduct
);

export default router;
