import { validationResult, Result } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import  {sendMail}  from "../helpers/sendMail.js";
import TokenBlacklist from "../models/TokenBlacklist.js";

dotenv.config({ path: "../config/config.env" });

// @ route    GET api/users
// @desc      Get logged in user
// @ access   Private
export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const authenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
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

    // Respond with token and user details
    const { password: _, ...userDetails } = user._doc;
    res.json({
      token,
      user: userDetails,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, currentPassword, ...others } = req.body;
    const user = await User.findById(req.params.id);

    let newPassword;

    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    if (req.body.password && user != null) {
      if (!req.body.currentPassword) {
        return res.status(400).json({
          msg: "Provide your current password before you can update your password",
        });
      }
      let salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(req.body.password, salt);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Old password isn't correct" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        $set: {
          ...others,
          password: newPassword,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name == "CastError") {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    await sendMail({
      to: user?.email,
      from: "nitin@worldfoodchain.io",
      subject: "Password Change link",
      text: `Click on the link to change password ${process.env.CLIENT_URL}/change-password?id=${user?.id}&email=${user?.email} please do not share this link`,
    });
    res.status(200).json({ success: true, msg: "Change password email send" });
  } catch (err) {
    if (err.name == "CastError") {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const id = req?.params?.id;

    console.log(id,"--------")

    let salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(password, salt);

    const updatedRecord = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          password: newPassword,
        },
      },
    );

    if(updatedRecord){
      res.status(200).json({ success: true, msg: "Password updated successfully" });
    } else {
      res.status(500).json({ success: false, msg: "password not update, please try again" });
    }

  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token is required" });
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

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token validation failed:", err);
    res.status(403).json({ success: false, msg: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ msg: "No token provided" });
  }

  try {
    // Add the token to the blacklist
    await TokenBlacklist.create({ token });

    res.status(200).json({ success: true, msg: "User logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ msg: "Failed to logout" });
  }
};