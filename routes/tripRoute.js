import express from "express";
import {
  startTrip,
  updateTrip,
  endTrip,
  getTripHistory,
  getTripDetails,
  addTripNotes,
  filterTripHistory,
} from "../controllers/tripController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - userId
 *         - startLocation
 *         - travelMode
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user starting the trip
 *         startLocation:
 *           type: string
 *           description: The starting location of the trip
 *         travelMode:
 *           type: string
 *           description: The mode of travel (e.g., car, bike, walk)
 *       example:
 *         userId: "12345"
 *         startLocation: "New York City"
 *         travelMode: "car"
 */

/**
 * @swagger
 * /trips/start:
 *   post:
 *     summary: Start a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: Trip started successfully
 *       500:
 *         description: Failed to start trip
 */
router.post("/start", startTrip);

/**
 * @swagger
 * /trips/{tripId}/update:
 *   put:
 *     summary: Update an ongoing trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trip to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trafficCondition:
 *                 type: string
 *                 description: Traffic condition during the trip
 *               weatherCondition:
 *                 type: string
 *                 description: Weather condition during the trip
 *             example:
 *               trafficCondition: "heavy"
 *               weatherCondition: "rainy"
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found or already completed
 *       500:
 *         description: Failed to update trip
 */
router.put("/:tripId/update", updateTrip);

/**
 * @swagger
 * /trips/end:
 *   post:
 *     summary: End an ongoing trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *                 description: The ID of the trip to end
 *               endLocation:
 *                 type: string
 *                 description: The ending location of the trip
 *               notes:
 *                 type: string
 *                 description: Additional notes about the trip
 *             example:
 *               tripId: "1234567890abcdef12345678"
 *               endLocation: "Los Angeles"
 *               notes: "Smooth trip with clear traffic."
 *     responses:
 *       200:
 *         description: Trip ended successfully
 *       404:
 *         description: Trip not found or already completed
 *       500:
 *         description: Failed to end trip
 */
router.post("/end", endTrip);

/**
 * @swagger
 * /trips/{tripId}/notes:
 *   post:
 *     summary: Add notes to a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trip to add notes to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Notes to add to the trip
 *             example:
 *               notes: "This trip was smooth and enjoyable."
 *     responses:
 *       200:
 *         description: Notes added successfully
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to add notes
 */
router.post("/:tripId/notes", addTripNotes);

/**
 * @swagger
 * /trips/history/{userId}:
 *   get:
 *     summary: Get trip history for a user
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Trip history retrieved successfully
 *       500:
 *         description: Failed to retrieve trip history
 */
router.get("/history/:userId", getTripHistory);

/**
 * @swagger
 * /trips/history/filter/{userId}:
 *   get:
 *     summary: Filter trip history for a user
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering trip history
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering trip history
 *       - in: query
 *         name: travelMode
 *         schema:
 *           type: string
 *         description: Travel mode (e.g., car, bike)
 *       - in: query
 *         name: trafficCondition
 *         schema:
 *           type: string
 *         description: Traffic condition during the trips
 *     responses:
 *       200:
 *         description: Filtered trip history retrieved successfully
 *       500:
 *         description: Failed to filter trip history
 */
router.get("/history/filter/:userId", filterTripHistory);

/**
 * @swagger
 * /trips/{tripId}:
 *   get:
 *     summary: Get details of a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trip
 *     responses:
 *       200:
 *         description: Trip details retrieved successfully
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to retrieve trip details
 */
router.get("/:tripId", getTripDetails);

export default router;
