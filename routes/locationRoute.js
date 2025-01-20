import express from "express";
import {
  getLocationByAddress,
  getAddressByCoordinates,
  getTrafficData,
  getRoutePlanning,
} from "../controllers/locationController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GeocodeResponse:
 *       type: object
 *       properties:
 *         latitude:
 *           type: number
 *           description: Latitude of the location
 *         longitude:
 *           type: number
 *           description: Longitude of the location
 *         formattedAddress:
 *           type: string
 *           description: Formatted address of the location
 *       example:
 *         latitude: 37.7749
 *         longitude: -122.4194
 *         formattedAddress: "San Francisco, CA, USA"
 *     ReverseGeocodeResponse:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           description: Address of the given coordinates
 *       example:
 *         address: "1 Market St, San Francisco, CA, USA"
 */

/**
 * @swagger
 * /locations/geocode:
 *   get:
 *     summary: Get latitude and longitude by address
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Address to geocode
 *     responses:
 *       200:
 *         description: Geocode data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeocodeResponse'
 *       400:
 *         description: Address is required
 *       500:
 *         description: Failed to fetch location
 */
router.get("/geocode", getLocationByAddress);

/**
 * @swagger
 * /locations/reverse-geocode:
 *   get:
 *     summary: Get address by latitude and longitude
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReverseGeocodeResponse'
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Failed to fetch address
 */
router.get("/reverse-geocode", getAddressByCoordinates);

/**
 * @swagger
 * /locations/traffic:
 *   get:
 *     summary: Get traffic data between two locations
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         required: true
 *         description: Origin location
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         required: true
 *         description: Destination location
 *       - in: query
 *         name: traffic_model
 *         schema:
 *           type: string
 *           enum: [best_guess, pessimistic, optimistic]
 *           default: best_guess
 *         description: Traffic model to use
 *     responses:
 *       200:
 *         description: Traffic data retrieved successfully
 *       400:
 *         description: Origin and destination are required
 *       500:
 *         description: Failed to fetch traffic data
 */
router.get("/traffic", getTrafficData);

/**
 * @swagger
 * /locations/route:
 *   get:
 *     summary: Get route planning data between two locations
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         required: true
 *         description: Origin location
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         required: true
 *         description: Destination location
 *     responses:
 *       200:
 *         description: Route planning data retrieved successfully
 *       400:
 *         description: Origin and destination are required
 *       500:
 *         description: Failed to plan route
 */
router.get("/route", getRoutePlanning);

export default router;
