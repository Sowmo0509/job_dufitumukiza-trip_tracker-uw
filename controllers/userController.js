import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { createResponse } from "../utils/responseHandler.js";

dotenv.config({ path: "../config/config.env" });

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.json(
        createResponse({ status: 404, message: "User not found" })
      );
    }
    res.json(
      createResponse({ result: {user:user}, message: "User fetched successfully" })
    );
  } catch (err) {
    if (err.name === "CastError") {
      return res.json(
        createResponse({ status: 400, message: "User doesn't exist" })
      );
    }
    console.error(err.message);
    res.json(
      createResponse({
        status: 500,
        message: "Server error",
        error: err?.message,
      })
    );
  }
};

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(createResponse({message:"Validation error",status:400, errors: errors.array() }));
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.send(createResponse({status:400,message:"User already exists"}));
    }

    // CREATE A NEW USER
    user = new User({
      name,
      email,
      password,
    });

    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
        res.json(
          createResponse({
            message: "User registered successfully",
            result: {token: token},
          })
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    res.json(
      createResponse({
        status: 500,
        message: "Server error",
        error: err?.message,
      })
    );
  }
};
