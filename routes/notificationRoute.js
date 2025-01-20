import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  markNotificationAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - message
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user receiving the notification
 *         title:
 *           type: string
 *           description: The title of the notification
 *         message:
 *           type: string
 *           description: The body of the notification
 *         isRead:
 *           type: boolean
 *           description: Indicates whether the notification is read
 *       example:
 *         userId: "12345"
 *         title: "New Message"
 *         message: "You have a new message."
 *         isRead: false
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Failed to create notification
 */
router.post("/", createNotification);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose notifications to fetch
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Failed to fetch notifications
 */
router.get("/", getNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid notification ID
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Failed to update notification
 */
router.patch("/:id", markNotificationAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Failed to delete notification
 */
router.delete("/:id", deleteNotification);

export default router;
