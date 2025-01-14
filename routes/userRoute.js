import express from 'express';
import { check, body } from 'express-validator';
import { getUserById, registerUser } from '../controllers/userController.js';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndUser } from '../middlewares/authMiddleware.js';
import { authenticateUser, changePassword, getLoggedInUser, logout, refreshToken, resetPassword, updateUser } from '../controllers/authController.js';

const router = express.Router();

router.get("/find/:id", verifyTokenAndAdmin, getUserById);

const validateRegister = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

router.post('/register', validateRegister, registerUser);


router.get("/profile", verifyToken, getLoggedInUser);

router.post(
  "/login",
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
  authenticateUser
);

router.put("/profile/:id", verifyTokenAndUser, updateUser);

router.delete("/reset-password/:id", verifyTokenAndUser, resetPassword);
router.delete("/change-password/:id", verifyTokenAndUser, changePassword);

export default router;
