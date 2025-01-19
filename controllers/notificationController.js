import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { createResponse } from "../utils/responseHandler.js";

export const createNotification = async (req, res) => {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.json(createResponse({status:400, message: "All fields are required" }));
  }

  try {
    const notification = await Notification.create({ userId, title, message });
    res.json(createResponse({result: {notifications:notification}}));
  } catch (error) {
    console.error("Error creating notification:", error);
    res.json(createResponse({status:500, message: "Failed to create notification", error:error?.message }));
  }
};

export const getNotifications = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.json(createResponse({status:400, message: "User ID is required" }));
  }

  try {
    const notifications = await Notification.find({ userId });
    res.json(createResponse({result: {notifications: notifications}, message:"Notification retieved successfully"
    }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.json(createResponse({error:error?.message, status:500, message:"Failed to fetch notifications"}))
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json(createResponse({status:400, message: "Invalid notification ID" }));
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.json(createResponse({status:400, message: "Notification not found" }));
    }

    res.json(createResponse({result:{notifications:notification}, status:200}));
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.json(createResponse({status:500, message: "Failed to update notification" }));
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.json(createResponse({status:404, message: "Notification not found" }));
    }

    res.json(createResponse({ message: "Notification deleted successfully" }));
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.json(createResponse({status:500, message: "Failed to delete notification",error:error?.message }));
  }
};
