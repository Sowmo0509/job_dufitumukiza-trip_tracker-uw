import express from "express";
import { submitRating, getRatingsForTrip, getUserAverageRating } from "../controllers/ratingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, submitRating);

router.get("/:tripId", verifyToken, getRatingsForTrip);

router.get("/user/:userId", verifyToken, getUserAverageRating);

export default router;
