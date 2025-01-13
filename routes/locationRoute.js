import express from "express";
import {
  getLocationByAddress,
  getAddressByCoordinates,
  getTrafficData,
  getRoutePlanning,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/geocode", getLocationByAddress);
router.get("/reverse-geocode", getAddressByCoordinates);

router.get("/traffic", getTrafficData);
router.get("/route", getRoutePlanning);


export default router;
