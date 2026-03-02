import express from "express";
import { signup, login, logout } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.get("/logout", logout as any);

export default router;
