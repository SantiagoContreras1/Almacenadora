import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
  updatePassword,
} from "./user.controller.js";
import {
  checkOwnAccount,
  checkRoleChange,
  validateCurrentPassword,
} from "../middlewares/validateUser.js";
import { validarJWT } from "../middlewares/validar-JWT.js";

const router = Router();

router.get("/", getUsers);
router.get("/checkEmail", checkEmail);
router.get("/:userId", getUserById);
router.put(
  "/:userId",
  validarJWT,
  checkOwnAccount,
  checkRoleChange,
  updateUser
);
router.patch("/password/:userId",
  validateCurrentPassword,
  updatePassword
)

router.delete(
  "/:userId",
  validarJWT,
  checkOwnAccount,
  deleteUser
);

export default router;
