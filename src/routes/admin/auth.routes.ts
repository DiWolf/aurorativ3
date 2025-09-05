import { Router } from "express";
import {
  showLogin,
  login,
  showRegister,
  register,
  logout,
} from "@controllers/admin/auth.controller";

const router = Router();

// Mostrar formularios
router.get("/login", showLogin);
router.get("/register", showRegister);

// Procesar formularios
router.post("/login", login);
router.post("/register", register);

// Logout
router.get("/logout", logout);

export default router;
