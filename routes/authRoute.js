import express from "express";
import { logout, refreshToken, registerUserWithOTP, verifyOTPAndRegister } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token issued during login
 *       example:
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *       401:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the user and blacklist the token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: No token provided
 *       500:
 *         description: Failed to logout
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/register/otp:
 *   post:
 *     summary: Send OTP for mobile registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Mobile number is required
 *       500:
 *         description: Failed to send OTP
 */
router.post("/register/otp", registerUserWithOTP);

/**
 * @swagger
 * /auth/register/verify:
 *   post:
 *     summary: Verify OTP and complete registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Failed to register user
 */
router.post("/register/verify", verifyOTPAndRegister);


export default router;
