import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
} from "./user.controller.js";
import {
  checkOwnAccount,
  checkRoleChange,
  validateCurrentPassword,
  validatePasswordOnDelete,
} from "../middlewares/validateUser.js";

const router = Router();

router.get("/", getUsers);
router.get("/checkEmail", checkEmail);
router.get("/:userId", getUserById);
router.put(
  "/:userId",
  checkOwnAccount,
  checkRoleChange,
  validateCurrentPassword,
  updateUser
);
router.delete(
  "/:userId",
  checkOwnAccount,
  validatePasswordOnDelete,
  deleteUser
);

export default router;
