import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { esAdmin } from "../middlewares/products/validar-admin.js";

import {
  saveClient,
  getClients,
  searchClientById,
  updateClient,
  deleteClient,
} from "./client.controller.js";
import { validarJWT } from "../middlewares/validar-JWT.js";

const router = Router();

router.get("/", validarJWT, getClients);

router.post(
  "/save",
  [
    validarJWT,
    esAdmin,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("telefono", "El teléfono es obligatorio").not().isEmpty(),
    check("email", "El correo electrónico es obligatorio").not().isEmpty(),
    check("tipo", "El tipo es obligatorio (individual o empresa)").isIn([
      "individual",
      "empresa",
    ]),
    validarCampos,
  ],
  saveClient
);

router.get(
  "/:id",
  [validarJWT, check("id").isMongoId(), validarCampos],
  searchClientById
);

router.put(
  "/update/:id",
  [
    validarJWT,
    esAdmin,
    check("id", "El ID no es válido").isMongoId(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("telefono", "El teléfono es obligatorio").not().isEmpty(),
    check("email", "El correo electrónico es obligatorio").not().isEmpty(),
    check("tipo", "El tipo es obligatorio (individual o empresa)").isIn([
      "individual",
      "empresa",
    ]),
    validarCampos,
  ],
  updateClient
);

router.delete(
  "/delete/:id",
  [validarJWT, esAdmin, check("id").isMongoId(), validarCampos],
  deleteClient
);

export default router;
