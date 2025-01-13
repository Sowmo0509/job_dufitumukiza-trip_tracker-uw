import express from "express";
import { createNotification, deleteNotification, getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";


const router = express.Router();

router.post("/", createNotification);

router.get("/", getNotifications);

router.patch("/:id", markNotificationAsRead);

router.delete("/:id", deleteNotification);

export default router;
