import { Client } from "@googlemaps/google-maps-services-js";
import Trip from "../models/Trip.js";
import { createResponse } from "../utils/responseHandler.js";

const client = new Client({});

export const startTrip = async (req, res) => {
  const { userId, startLocation, travelMode } = req.body;

  try {
    if (!startLocation || !userId || !travelMode) {
      return res.json(createResponse({
        status: 400,
        message: "User ID, start location, and travel mode are required.",
      }));
    }

    const geocodeResponse = await client.geocode({
      params: {
        address: startLocation,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (!geocodeResponse.data.results.length) {
      return res.json(createResponse({
        status: 400,
        message: "Invalid address. Unable to geocode.",
      }));
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    const trip = new Trip({
      userId,
      startLocation: {
        lat,
        lng,
        address: startLocation,
      },
      travelMode,
    });

    const savedTrip = await trip.save();
    res.json(createResponse({
      result: savedTrip,
      message: "Trip started successfully.",
    }));
  } catch (error) {
    console.error("Error starting trip:", error);
    res.json(createResponse({
      status: 500,
      message: "Failed to start trip.",
      error: error?.message,
    }));
  }
};

export const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const { trafficCondition, weatherCondition } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip || trip.status !== "ongoing") {
      return res
        .json(createResponse({status:404, message: "Trip not found or already completed" }));
    }

    trip.trafficConditions.push(trafficCondition);
    trip.weatherConditions.push(weatherCondition);

    await trip.save();
    res.json(createResponse({result:trip, message:"Trip updated successfully"}));
  } catch (error) {
    res.json(createResponse({status:500, message: "Failed to update trip", error:error?.message }));
  }
};

export const endTrip = async (req, res) => {
  const { endLocation, notes, tripId } = req.body;

  try {
    if (!endLocation || !tripId) {
      return res.json(createResponse({
        status: 400,
        message: "End location and trip ID are required.",
      }));
    }

    const trip = await Trip.findById(tripId);
    if (!trip || trip.status !== "ongoing") {
      return res.json(createResponse({
        status: 404,
        message: "Trip not found or already completed.",
      }));
    }

    const geocodeResponse = await client.geocode({
      params: {
        address: endLocation,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (!geocodeResponse.data.results.length) {
      return res.json(createResponse({
        status: 400,
        message: "Invalid address. Unable to geocode.",
      }));
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    trip.endLocation = { lat, lng, address: endLocation };
    trip.notes = notes;
    trip.status = "completed";
    trip.timestamps.endedAt = new Date();

    const savedTrip = await trip.save();
    res.json(createResponse({
      result: savedTrip,
      message: "Trip ended successfully.",
    }));
  } catch (error) {
    console.error("Error ending trip:", error);
    res.json(createResponse({
      status: 500,
      message: "Failed to end trip.",
      error: error?.message,
    }));
  }
};

export const addTripNotes = async (req, res) => {
  const { tripId } = req.params;
  const { notes } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.json(createResponse({status:404, message: "Trip not found" }));
    }

    if (notes) {
      trip.notes = trip.notes ? `${trip.notes}\n${notes}` : notes;
    }

    const updatedTrip = await trip.save();
    res.json(createResponse({
      result:updatedTrip,
      message:"Add notes successfully"
    }));
  } catch (error) {
    res.json(createResponse({status:500, message: "Failed to add notes", error:error?.message }));
  }
};

export const getTripHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const trips = await Trip.find({ userId, status: "completed" }).sort({
      "timestamps.endedAt": -1,
    });
    res.json(createResponse({result:trips, message:"Trip history retrieved successfully"}));
  } catch (error) {
    res.json(createResponse({status:500, message: "Failed to retrieve trip history", error: error?.message }));
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

    const trips = await Trip.find(query).sort({ "timestamps.endedAt": -1 });

    res.json(createResponse({result:trips, message:"Filtered trip"}));
  } catch (error) {
    res.json(createResponse({status:500, message: "Failed to filter trip history", error: error?.message }));
  }
};

export const getTripDetails = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.json(createResponse({status:404, message: "Trip not found" }));
    }
    res.json(createResponse({
      result: trip,
      message:"Trip fetched successfully"
    }));
  } catch (error) {
    res.json(createResponse({status:500, message: "Failed to retrieve trip details", error }));
  }
};
