import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({});

export const getLocationByAddress = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const response = await client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data.results[0];
    res.json({
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    });
  } catch (error) {
    console.error("Error in getLocationByAddress:", error);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};

export const getAddressByCoordinates = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  try {
    const response = await client.reverseGeocode({
      params: {
        latlng: `${latitude},${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data.results[0];
    res.json({
      address: result.formatted_address,
    });
  } catch (error) {
    console.error("Error in getAddressByCoordinates:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

export const getTrafficData = async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ message: "Origin and destination are required." });
  }

  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        departure_time: "now",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const route = response.data.routes[0];
    const legs = route.legs[0];

    res.json({
      trafficStatus: legs.traffic_speed_entry ? "Moderate" : "Unknown",
      estimatedDuration: legs.duration_in_traffic?.value || legs.duration.value,
      distance: legs.distance.text,
      steps: legs.steps.map((step) => step.html_instructions.replace(/<[^>]+>/g, "")),
    });
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    res.status(500).json({ message: "Failed to fetch traffic data." });
  }
};

export const getRoutePlanning = async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ message: "Origin and destination are required." });
  }

  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const route = response.data.routes[0];
    const legs = route.legs[0];

    res.json({
      distance: legs.distance.text,
      duration: legs.duration.text,
      steps: legs.steps.map((step) => step.html_instructions.replace(/<[^>]+>/g, "")),
      route: legs.steps.map((step) => ({
        latitude: step.start_location.lat,
        longitude: step.start_location.lng,
      })),
    });
  } catch (error) {
    console.error("Error planning route:", error);
    res.status(500).json({ message: "Failed to plan route." });
  }
};
