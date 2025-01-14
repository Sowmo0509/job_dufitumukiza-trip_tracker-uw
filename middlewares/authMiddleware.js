import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TokenBlacklist from "../models/TokenBlacklist.js";
dotenv.config({ path: "../config/config.env" });

export const verifyToken = async (
  req,
  res,
  next
) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(403).json({ message: "Token is invalid or expired" });
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
    return res.status(403).json({ message: "Token is not valid" });
  }
};

// TO CHECK IF THE USER IS THE ONE MAKING THE REQUEST
export const verifyTokenAndUser = (
  req,
  res,
  next
) => {
  verifyToken(req, res, () => {
    if (req.user?.id === req.params.id) {
      next();
    } else {
      res.status(403).json({ message: "You're not allowed to do that!" });
    }
  });
};

// VERIFY IF THE USER IS AN ADMIN
export const verifyTokenAndAdmin = (
  req,
  res,
  next
) => {
  verifyToken(req, res, () => {
    try {
      if (req.user?.role != "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  });
};

// export const verifiedUser = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Fetch the user from the database based on the user ID in the token
//     const user = await User.findById(req.user?.id);

//     if (user?.verified) {
//       next();
//     } else {
//       res.status(403).json({ message: "You need to be verified to do this" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

