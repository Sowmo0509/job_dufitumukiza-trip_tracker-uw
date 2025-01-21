import express from "express";
import { check, body } from "express-validator";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUser,
} from "../middlewares/authMiddleware.js";
import { getUserById, registerUser } from "./../controllers/userController.js";
import {
  authenticateUser,
  changePassword,
  getLoggedInUser,
  resetPassword,
  updateUser,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         password: password123
 */

/**
 * @swagger
 * /users/find/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/find/:id", verifyTokenAndAdmin, getUserById);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token, authorization denied
 *       403:
 *         description: Token is invalid or expired
 *       500:
 *         description: Server error
 *     description: |
 *       This endpoint allows you to fetch the profile of the logged-in user.
 *       The user must provide a valid token in the `x-auth-token` header. If the token is blacklisted or expired,
 *       a `403` error will be returned.
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's unique identifier
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *         role:
 *           type: string
 *           description: User's role in the system (e.g., admin, user)
 *       required:
 *         - id
 *         - name
 *         - email
 *         - role
 */
router.get("/profile", verifyToken, getLoggedInUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate user and return token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/login",
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
  authenticateUser
);

/**
 * @swagger
 * /users/profile/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user
 *               email:
 *                 type: string
 *                 description: The updated email of the user
 *               password:
 *                 type: string
 *                 description: The new password to set for the user
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user (required if updating the password)
 *           example:
 *             name: "John Doe Updated"
 *             email: "john.doe@example.com"
 *             currentPassword: "oldpassword123"
 *             password: "newpassword123"
 *       description: Leave password and current password field blank if you don't want to change it
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User updated successfully!"
 *                 result:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "1234567890abcdef12345678"
 *                         name:
 *                           type: string
 *                           example: "John Doe Updated"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *       400:
 *         description: Validation error or bad request
 *       500:
 *         description: Internal server error
 */
router.put("/profile/:id", verifyTokenAndUser, updateUser);


/**
 * @swagger
 * /users/reset-password/{id}:
 *   delete:
 *     summary: Reset user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input
 */
router.delete("/reset-password/:id", verifyTokenAndUser, resetPassword);

/**
 * @swagger
 * /users/change-password/{id}:
 *   delete:
 *     summary: Change user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 */
router.delete("/change-password/:id", verifyTokenAndUser, changePassword);

export default router;
