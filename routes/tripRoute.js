import express from 'express';
import {
  startTrip,
  updateTrip,
  endTrip,
  getTripHistory,
  getTripDetails,
  addTripNotes,
  filterTripHistory,
} from '../controllers/tripController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - userId
 *         - destination
 *         - startTime
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user starting the trip
 *         destination:
 *           type: string
 *           description: The destination of the trip
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the trip
 *       example:
 *         userId: "12345"
 *         destination: "New York City"
 *         startTime: "2023-12-01T10:00:00Z"
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
 *       201:
 *         description: Trip started successfully
 *       400:
 *         description: Invalid input
 */
router.post('/start', startTrip);

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
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 */
router.put('/:tripId/update', updateTrip);

/**
 * @swagger
 * /trips/end:
 *   post:
 *     summary: End an ongoing trip
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trip ended successfully
 *       400:
 *         description: Error ending the trip
 */
router.post('/end', endTrip);

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
 *               notes: "This trip was smooth and on schedule."
 *     responses:
 *       201:
 *         description: Notes added successfully
 *       404:
 *         description: Trip not found
 */
router.post('/:tripId/notes', addTripNotes);

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
 *       404:
 *         description: No history found for the user
 */
router.get('/history/:userId', getTripHistory);

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
 *     responses:
 *       200:
 *         description: Filtered trip history retrieved successfully
 *       404:
 *         description: No filtered history found for the user
 */
router.get('/history/filter/:userId', filterTripHistory);

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
 */
router.get('/:tripId', getTripDetails);

export default router;
