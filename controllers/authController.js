import { validationResult, Result } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import  {sendMail}  from "../helpers/sendMail.js";

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

// @ route    POST api/users
// @ desc     authenticate (Login) user & get token
// @ access   Public
export const authenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Email is invalid" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is invalid" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
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
        const { password, ...others } = user._doc;
        res.json({
          token,
          user: { ...others },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @ route    PUT api/users/profile:id
// @desc      Update user
// @ access   Private
export const updateUser = async (req, res) => {
  try {
    const { password, currentPassword, ...others } = req.body;
    const user = await User.findById(req.params.id);

    let newPassword;

    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    // CHECK IF THE USER WANTS TO UPDATE THEIR PASSWORD
    if (req.body.password && user != null) {
      // IF CURRENT PASSWORD ISN'T GIVEN
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

// @ route    DELETE api/users/reset-password
// @ desc     reset-password
// @ access   Private
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    await sendMail({
      to: findUser.email,
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
    const { email, password } = req.body;

    let salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(password, salt);

    const updatedRecord = await User.findByIdAndUpdate(
      email,
      {
        $set: {
          ...others,
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
