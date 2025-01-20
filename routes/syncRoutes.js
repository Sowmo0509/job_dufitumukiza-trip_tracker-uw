import express from "express";
import { syncOfflineData } from "../controllers/syncController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OfflineDataItem:
 *       type: object
 *       required:
 *         - type
 *         - action
 *         - data
 *       properties:
 *         type:
 *           type: string
 *           description: The type of data being synchronized (e.g., trip, note)
 *         action:
 *           type: string
 *           description: The action to perform (e.g., update, create, addNote)
 *         data:
 *           type: object
 *           description: The specific data payload for the action
 *       example:
 *         type: "trip"
 *         action: "update"
 *         data:
 *           tripId: "1234567890abcdef12345678"
 *           startLocation: "Point A"
 *           endLocation: "Point B"
 *           travelMode: "car"
 *           trafficConditions: "heavy"
 *           weatherConditions: "clear"
 *           distance: 15
 *           duration: 30
 *           notes: "Smooth drive"
 *           status: "completed"
 *
 *     SyncRequest:
 *       type: object
 *       required:
 *         - userId
 *         - offlineData
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user performing the sync
 *         offlineData:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OfflineDataItem'
 *       example:
 *         userId: "12345"
 *         offlineData:
 *           - type: "trip"
 *             action: "update"
 *             data:
 *               tripId: "1234567890abcdef12345678"
 *               startLocation: "Point A"
 *               endLocation: "Point B"
 *               travelMode: "car"
 *               trafficConditions: "heavy"
 *               weatherConditions: "clear"
 *               distance: 15
 *               duration: 30
 *               notes: "Smooth drive"
 *               status: "completed"
 *
 *     SyncResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the sync was successful
 *         message:
 *           type: string
 *           description: Status message
 *         results:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               action:
 *                 type: string
 *               status:
 *                 type: string
 *               data:
 *                 type: object
 *               msg:
 *                 type: string
 *       example:
 *         success: true
 *         message: "Data synchronized successfully"
 *         results:
 *           - type: "trip"
 *             action: "update"
 *             status: "success"
 *             data:
 *               tripId: "1234567890abcdef12345678"
 *               startLocation: "Point A"
 *               endLocation: "Point B"
 *               travelMode: "car"
 *               trafficConditions: "heavy"
 *               weatherConditions: "clear"
 *               distance: 15
 *               duration: 30
 *               notes: "Smooth drive"
 *               status: "completed"
 */

/**
 * @swagger
 * /sync:
 *   post:
 *     summary: Sync offline data to the server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncRequest'
 *     responses:
 *       200:
 *         description: Data synchronized successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse'
 *       400:
 *         description: User ID and offline data are required
 *       500:
 *         description: Failed to synchronize data
 */
router.post("/", verifyToken, syncOfflineData);

export default router;