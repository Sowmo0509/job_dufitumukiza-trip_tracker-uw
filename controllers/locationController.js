import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";
import { createResponse } from "../utils/responseHandler.js";

dotenv.config();

const client = new Client({});

export const getLocationByAddress = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.json(
      createResponse({ status: 400, message: "Address is required" })
    );
  }

  try {
    const response = await client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data.results[0];
    res.json(
      createResponse({
        result: {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
        },
        message:"Location fetched successfully"
      })
    );
  } catch (error) {
    console.error("Error in getLocationByAddress:", error);
    res.json(
      createResponse({ status: 500, message: "Failed to fetch location" })
    );
  }
};

export const getAddressByCoordinates = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.json(
      createResponse({ status: 400, message: "Latitude and longitude are required" })
    );
  }

  try {
    const response = await client.reverseGeocode({
      params: {
        latlng: `${latitude},${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data.results[0];
    res.json(createResponse({
      result: result?.formatted_address,
      message:"Address fetched successfully!"
    }));
  } catch (error) {
    console.error("Error in getAddressByCoordinates:", error);
    res.json(createResponse({status:500, message: "Failed to fetch address", error:error?.message }));
  }
};

export const getTrafficData = async (req, res) => {
  const { origin, destination, traffic_model = "best_guess" } = req.query;

  if (!origin || !destination) {
    return res.json(
      createResponse({ status: 400, message: "Origin and destination are required." })
    );
  }

  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        departure_time: "now",
        traffic_model,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (!response.data.routes.length) {
      return res.json(createResponse({status:404, message: "No route found." }));
    }

    const route = response.data.routes[0];
    const legs = route.legs[0];
    res.json(createResponse({
      result:{
      trafficModel: traffic_model,
      estimatedDuration: legs.duration_in_traffic?.text || legs.duration.text,
      distance: legs.distance.text,
      steps: legs.steps.map((step) =>
        step.html_instructions.replace(/<[^>]+>/g, "")
      )
    },
    message:"Traffic details fetched successfully"
    }));
  } catch (error) {
    console.error(
      "Error fetching traffic data:",
      error.response?.data || error.message
    );
    res.json(createResponse({status:500, message: "Failed to fetch traffic data", error:error?.message }));
  }
};

export const getRoutePlanning = async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res
      .json(createResponse({ message: "Origin and destination are required.", status:400 }));
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

    res.json(createResponse({
      result : {distance: legs.distance.text,
      duration: legs.duration.text,
      steps: legs.steps.map((step) =>
        step.html_instructions.replace(/<[^>]+>/g, "")
      ),
      route: legs.steps.map((step) => ({
        latitude: step.start_location.lat,
        longitude: step.start_location.lng,
      }))},
      message:"Route data feched successfully"
    }));
  } catch (error) {
    console.error("Error planning route:", error);
    res.json(createResponse({status:500, message: "Failed to fetch route data", error:error?.message }));  }
};
