import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { createResponse } from "../utils/responseHandler.js";
dotenv.config({ path: "../config/config.env" });

export const verifyToken = async (req, res, next) => {
  const token = req.header("x-auth-token") || req.header("Authorization");

  if (!token) {
    return res.json(createResponse({ status: 401, message: "No token, authorization denied" }));
  }

  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.json(createResponse({ status: 403, message: "Token is invalid or expired" }));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded == "string") {
      throw new Error("Invalid token");
    }
    req.user = {
      id: decoded.user.id,
      role: decoded.user.role,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.json(createResponse({ status: 403, error: error?.message, message: "Token is not valid" }));
  }
};

export const verifyTokenAndUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.id === req.params.id) {
      next();
    } else {
      res.json(createResponse({ status: 403, message: "You're not allowed to do that!" }));
    }
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    try {
      if (req.user?.role != "admin") {
        return res.json(createResponse({ status: 403, message: "Access denied" }));
      }
      next();
    } catch (error) {
      return res.json(createResponse({ status: 401, message: "Invalid token" }));
    }
  });
};
