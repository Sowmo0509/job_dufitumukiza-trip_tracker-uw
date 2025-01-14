import express from "express";
import { syncOfflineData } from "../controllers/syncController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, syncOfflineData);

export default router;
