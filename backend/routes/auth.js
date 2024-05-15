const express = require("express");
const AuthController = require("../controllers/authController");
const adminAuthMiddleware = require("../middlewares/adminAuth");
const authMiddleware = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post(
  "/register",
  // authMiddleware,
  // adminAuthMiddleware,
  AuthController.register
);
authRouter.post("/logout", authMiddleware, AuthController.logout);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);

module.exports = authRouter;
