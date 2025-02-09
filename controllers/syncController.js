import Trip from "../models/Trip.js";
import { createResponse } from "../utils/responseHandler.js";

/**
 * Sync Offline Data
 * @route POST /api/sync
 * @access Private
 */
export const syncOfflineData = async (req, res) => {
  const { userId, offlineData } = req.body;

  if (!userId || !offlineData) {
    return res.json(
      createResponse({
        status: "400",
        message: "User ID and offline data are required.",
      })
    );
  }

  const results = [];

  try {
    for (const item of offlineData) {
      const { type, action, data } = item;

      switch (type) {
        case "trip":
          if (action === "update") {
            const updatedTrip = await Trip.findByIdAndUpdate(
              data.tripId,
              {
                $set: {
                  startLocation: data.startLocation,
                  endLocation: data.endLocation,
                  travelMode: data.travelMode,
                  trafficConditions: data.trafficConditions,
                  weatherConditions: data.weatherConditions,
                  distance: data.distance,
                  duration: data.duration,
                  notes: data.notes,
                  status: data.status,
                },
              },
              { new: true }
            );
            results.push({
              type,
              action,
              status: updatedTrip ? "success" : "failed",
              data: updatedTrip || null,
            });
          } else if (action === "create") {
            const newTrip = await Trip.create({
              userId,
              ...data,
            });
            results.push({
              type,
              action,
              status: "success",
              data: newTrip,
            });
          }
          break;

        case "note":
          if (action === "addNote") {
            const trip = await Trip.findById(data.tripId);
            if (trip) {
              trip.notes = data.notes;
              await trip.save();
              results.push({
                type,
                action,
                status: "success",
                data: trip,
              });
            } else {
              results.push({
                type,
                action,
                status: "failed",
                msg: "Trip not found",
              });
            }
          }
          break;

        default:
          results.push({
            type,
            action,
            status: "failed",
            msg: `Unsupported type: ${type}`,
          });
      }
    }

    res.json(
      createResponse({
        result: results,
        message: "Data synchronized successfully.",
      })
    );
  } catch (error) {
    console.error(createResponse({
      status: "500",
      error: "Failed to synchronize data.",
    }));
  }
};
