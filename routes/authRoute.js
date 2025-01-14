import express from "express";
import { logout, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
