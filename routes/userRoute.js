import express from 'express';
import { check, body } from 'express-validator';
import { getUserById, registerUser } from '../controllers/userController.js';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndUser } from '../middlewares/authMiddleware.js';
import { authenticateUser, changePassword, getLoggedInUser, resetPassword, updateUser } from '../controllers/authController.js';

const router = express.Router();

// Get registered user by ID (Admin)
router.get("/find/:id", verifyTokenAndAdmin, getUserById);

// Validation Middleware
const validateRegister = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

// POST /api/users/register
router.post('/register', validateRegister, registerUser);


// GET LOGGED IN USER
router.get("/profile", verifyToken, getLoggedInUser);

// AUTHENTICATE USER AND GET TOKEN
router.post(
  "/login",
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
  authenticateUser
);

// UPDATE USER
router.put("profile/:id", verifyTokenAndUser, updateUser);

// DELETE USER
router.delete("reset-password", verifyTokenAndUser, resetPassword);
router.delete("change-password", verifyTokenAndUser, changePassword);


export default router;
