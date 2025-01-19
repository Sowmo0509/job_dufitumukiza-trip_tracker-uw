import express from "express";
import { submitRating, getRatingsForTrip, getUserAverageRating } from "../controllers/ratingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       required:
 *         - tripId
 *         - rating
 *       properties:
 *         tripId:
 *           type: string
 *           description: The ID of the trip being rated
 *         rating:
 *           type: number
 *           description: The rating given to the trip
 *           minimum: 1
 *           maximum: 5
 *         feedback:
 *           type: string
 *           description: Additional feedback for the trip
 *       example:
 *         tripId: "1234567890abcdef12345678"
 *         rating: 4
 *         feedback: "The trip was smooth and enjoyable."
 */

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Submit a rating for a trip
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 trip:
 *                   $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Trip ID and rating are required
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to submit rating
 */
router.post("/", verifyToken, submitRating);

/**
 * @swagger
 * /ratings/{tripId}:
 *   get:
 *     summary: Get ratings for a specific trip
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trip
 *     responses:
 *       200:
 *         description: Trip ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 rating:
 *                   type: number
 *                 feedback:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to fetch ratings
 */
router.get("/:tripId", verifyToken, getRatingsForTrip);

/**
 * @swagger
 * /ratings/user/{userId}:
 *   get:
 *     summary: Get the average rating for a user
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User's average rating calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 averageRating:
 *                   type: string
 *                   description: Average rating for the user
 *                 totalRatings:
 *                   type: integer
 *                   description: Total number of ratings for the user
 *       404:
 *         description: No ratings found for the user
 *       500:
 *         description: Failed to calculate average rating
 */
router.get("/user/:userId", verifyToken, getUserAverageRating);

export default router;
