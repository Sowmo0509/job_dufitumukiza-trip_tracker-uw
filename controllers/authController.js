import { validationResult, Result } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendMail } from "../helpers/sendMail.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { createResponse } from "../utils/responseHandler.js";
import { client } from "../utils/twilloClient.js";

dotenv.config({ path: "../config/config.env" });

const otpStore = new Map();

export const registerUserWithOTP = async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res
      .json(
        createResponse({ status: 400, message: "Mobile number is required." })
      );
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(mobileNumber, otp);

    await client.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from: "+15005550006",
      to: mobileNumber,
    });

    res.json(createResponse({ result:{otp: otp},  message: "OTP sent successfully." }));
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json(createResponse({ status:500, message: "Failed to send OTP.", error:error?.message }));
  }
};

export const verifyOTPAndRegister = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res
      .json(createResponse({ status:400, message: "Mobile number and OTP are required." }));
  }

  const storedOtp = otpStore.get(mobileNumber);
  if (!storedOtp || storedOtp !== parseInt(otp, 10)) {
    return res
      .json(createResponse({ status:400, message: "Invalid or expired OTP." }));
  }

  otpStore.delete(mobileNumber);

  try {
    const existingUser = await User.findOne({ mobileNumber: mobileNumber });
    if (existingUser) {
      return res.json(createResponse({
        message: "User already registered.",
        result:{user:existingUser}
      }));
    }

    const newUser = await User.create({
      mobileNumber:mobileNumber,
      verified: true
    });

    res
      .json(createResponse({
        message: "User registered successfully.",
        result: {
          user: newUser,
        }
      }));
  } catch (error) {
    console.error("Error registering user:", error);
    res.json(createResponse({ status:500, message: "Failed to register user.", error: error?.message }));
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.json(
        createResponse({ message: "User doesn't exist", status: 400 })
      );
    }
    res.json(
      createResponse({
        result: { user: user },
        message: "User fetched successfully",
      })
    );
  } catch (err) {
    return res.json(
      createResponse({
        message: "ServerError",
        status: 400,
        error: err?.message,
      })
    );
  }
};

export const authenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(
      createResponse({
        error: errors.array(),
        status: 400,
        message: "validation error",
      })
    );
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json(
        createResponse({ message: "User not found", status: 400 })
      );
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json(
        createResponse({ message: "Invalid email or password", status: 400 })
      );
    }

    const blacklistedToken = await TokenBlacklist.findOne({ userId: user.id });
    if (blacklistedToken) {
      await TokenBlacklist.deleteOne({ userId: user.id });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userDetails } = user._doc;
    res.json(
      createResponse({
        result: { token: token, user: userDetails },
        message: "User authenticated successfully",
      })
    );
  } catch (err) {
    console.error(err.message);
    return res.json(
      createResponse({
        message: "ServerError",
        status: 500,
        error: err?.message,
      })
    );
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log(req.body, "-----")
    const { password, currentPassword, ...others } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.json(
        createResponse({
          message: "User doesn't exist",
          status: 400,
        })
      );
    }

    let newPassword = null;

    if (password) {
      if (!currentPassword) {
        return res.json(
          createResponse({
            message:
              "Provide your current password before you can update your password",
            status: 400,
          })
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.json(
          createResponse({
            message: "Current password is incorrect",
            status: 400,
          })
        );
      }

      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...others,
          ...(newPassword && { password: newPassword }),
        },
      },
      { new: true }
    );

    res.json(
      createResponse({
        result: { user: updatedUser },
        message: "User updated successfully!",
      })
    );
  } catch (err) {
    // Handle invalid user ID error
    if (err.name === "CastError") {
      return res.json(
        createResponse({
          message: "Invalid user ID",
          status: 400,
          error: err?.message,
        })
      );
    }

    // Handle server errors
    console.error("Error updating user:", err);
    res.json(
      createResponse({
        message: "Server error",
        status: 500,
        error: err?.message,
      })
    );
  }
};



export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.json(
        createResponse({
          message: "User doesn't exist",
          status: 400,
        })
      );
    }
    await sendMail({
      to: user?.email,
      from: "nitin@worldfoodchain.io",
      subject: "Password Change link",
      text: `Click on the link to change password ${process.env.CLIENT_URL}/change-password?id=${user?.id}&email=${user?.email} please do not share this link`,
    });
    res.json(
      createResponse({
        message: "Change password email send",
      })
    );
  } catch (err) {
    if (err.name == "CastError") {
      return res.json(
        createResponse({
          message: "User doesn't exist",
          status: 400,
        })
      );
    }
    console.error(err.message);
    res.json(
      createResponse({
        status: "403",
        message: "Server Error!!.",
        error: err.message,
      })
    );
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const id = req?.params?.id;

    let salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(password, salt);

    const updatedRecord = await User.findByIdAndUpdate(id, {
      $set: {
        password: newPassword,
      },
    });

    if (updatedRecord) {
      res.json(
        createResponse({
          message: "Password updated successfully",
          result: { user: updatedRecord },
        })
      );
    } else {
      res.json(
        createResponse({
          message: "password not update, please try again",
          status: 500,
        })
      );
    }
  } catch (error) {
    console.log(error);
    createResponse({
      status: "403",
      message: "Invalid password!!.",
      error: err.message,
    });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.json({
      status: "401",
      message: "Refresh token is required.",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const payload = {
      user: {
        id: decoded.user.id,
        role: decoded.user.role,
      },
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.json(
      createResponse({
        result: { accessToken: newAccessToken },
        message: "Access token refreshed successfully.",
      })
    );
  } catch (err) {
    console.error("Refresh token validation failed:", err);
    res.json(
      createResponse({
        status: "403",
        message: "Invalid refresh token.",
        error: err.message,
      })
    );
  }
};

export const logout = async (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.json(
      createResponse({
        status: 400,
        message: "Token not found",
      })
    );
  }

  try {
    await TokenBlacklist.create({ token });

    res.json(
      createResponse({
        message: "User logged out successfully",
      })
    );
  } catch (err) {
    console.error("Logout error:", err);
    res.json(
      createResponse({
        status: 500,
        message: "Server error",
        error: err?.message,
      })
    );
  }
};
