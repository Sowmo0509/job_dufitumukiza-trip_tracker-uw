import Trip from "../models/Trip.js";

export const submitRating = async (req, res) => {
  const { tripId, rating, feedback } = req.body;

  if (!tripId || !rating) {
    return res.status(400).json({ msg: "Trip ID and rating are required." });
  }

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found." });
    }

    if (trip.status !== "completed") {
      return res.status(400).json({ msg: "Cannot rate an incomplete trip." });
    }

    trip.rating = rating;
    trip.feedback = feedback;

    await trip.save();

    res.status(200).json({ success: true, msg: "Rating submitted successfully.", trip });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ msg: "Failed to submit rating." });
  }
};

export const getRatingsForTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId).select("rating feedback");

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found." });
    }

    res.status(200).json({ success: true, rating: trip.rating, feedback: trip.feedback });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ msg: "Failed to fetch ratings." });
  }
};

export const getUserAverageRating = async (req, res) => {
  const { userId } = req.params;

  try {
    const trips = await Trip.find({ userId, rating: { $exists: true } }).select("rating");

    if (trips.length === 0) {
      return res.status(404).json({ msg: "No ratings found for the user." });
    }

    const totalRatings = trips.reduce((sum, trip) => sum + trip.rating, 0);
    const averageRating = (totalRatings / trips.length).toFixed(2);

    res.status(200).json({ success: true, averageRating, totalRatings: trips.length });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ msg: "Failed to calculate average rating." });
  }
};
