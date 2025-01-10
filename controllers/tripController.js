import mongoose from "mongoose";
import Trip from "../models/Trip.js";

export const startTrip = async (req, res) => {
  const { userId, startLocation, travelMode } = req.body;
  console.log(userId, startLocation, travelMode, "====")

  try {
    const trip = new Trip({
      userId: userId,
      startLocation,
      travelMode,
    });

    console.log(trip,"---")
    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to start trip", error });
  }
};

export const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const { currentLocation, trafficCondition, weatherCondition } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip || trip.status !== "ongoing") {
      return res
        .status(404)
        .json({ message: "Trip not found or already completed" });
    }

    trip.trafficConditions.push(trafficCondition);
    trip.weatherConditions.push(weatherCondition);

    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to update trip", error });
  }
};

export const endTrip = async (req, res) => {
  const { endLocation, notes, tripId } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip || trip.status !== "ongoing") {
      return res
        .status(404)
        .json({ message: "Trip not found or already completed" });
    }

    trip.endLocation = endLocation;
    trip.notes = notes;
    trip.status = "completed";
    trip.timestamps.endedAt = new Date();

    const savedTrip = await trip.save();
    res.status(200).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to end trip", error });
  }
};

export const addTripNotes = async (req, res) => {
  const { tripId } = req.params;
  const { notes } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (notes) {
      trip.notes = trip.notes ? `${trip.notes}\n${notes}` : notes;
    }

    const updatedTrip = await trip.save();
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to add notes", error });
  }
};

export const getTripHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const trips = await Trip.find({ userId, status: "completed" }).sort({
      "timestamps.endedAt": -1,
    });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve trip history", error });
  }
};

export const filterTripHistory = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate, travelMode, trafficCondition } = req.query;

  try {
    const query = { userId, status: "completed" };

    if (startDate || endDate) {
      query["timestamps.endedAt"] = {};
      if (startDate) {
        query["timestamps.endedAt"].$gte = new Date(startDate);
      }
      if (endDate) {
        query["timestamps.endedAt"].$lte = new Date(endDate);
      }
    }

    if (travelMode) {
      query.travelMode = travelMode;
    }

    if (trafficCondition) {
      query.trafficConditions = trafficCondition;
    }

    console.log(query, "======")

    const trips = await Trip.find(query).sort({ "timestamps.endedAt": -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to filter trip history", error });
  }
};

export const getTripDetails = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve trip details", error });
  }
};
