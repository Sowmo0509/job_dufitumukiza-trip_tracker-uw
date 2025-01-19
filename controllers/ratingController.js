import Trip from "../models/Trip.js";
import { createResponse } from "../utils/responseHandler.js";

export const submitRating = async (req, res) => {
  const { tripId, rating, feedback } = req.body;

  if (!tripId || !rating) {
    return res.json(createResponse({status:400, message: "Trip ID and rating are required." }));
  }

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.json(createResponse({status:404, message: "Trip not found." }));
    }

    if (trip.status !== "completed") {
      return res.json(createResponse({status:400, message: "Cannot rate an incomplete trip." }));
    }

    trip.rating = rating;
    trip.feedback = feedback;

    await trip.save();

    res.json(createResponse({message: "Rating submitted successfully.", result:{trip:trip} }));
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.json(createResponse({ status:500, message: "Failed to submit rating.", error:error?.message }));
  }
};

export const getRatingsForTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId).select("rating feedback");

    if (!trip) {
      return res.json(createResponse({status:404, message: "Trip not found." }));
    }

    res.json(createResponse({status:200, result: {rating: trip.rating, feedback: trip.feedback} }));
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.json(createResponse({ status:500, message: "Failed to fetch rating.", error:error?.message }));
  }
};

export const getUserAverageRating = async (req, res) => {
  const { userId } = req.params;

  try {
    const trips = await Trip.find({ userId, rating: { $exists: true } }).select("rating");

    if (trips.length === 0) {
      return res.json(createResponse({status:404, message: "No ratings found for the user." }));
    }

    const totalRatings = trips.reduce((sum, trip) => sum + trip.rating, 0);
    const averageRating = (totalRatings / trips.length).toFixed(2);

    res.json(createResponse({status:200, result:{ averageRating, totalRatings: trips.length}, message:"Failed to fetch ratings" }));
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.json(createResponse({ status:500, message: "Failed to calculate rating.", error:error?.message }));
  }
};
