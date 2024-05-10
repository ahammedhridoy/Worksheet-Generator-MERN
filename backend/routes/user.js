const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const adminAuthMiddleware = require("../middlewares/adminAuth");

const userRouter = express.Router();

userRouter.get("/", UserController.index);
userRouter.delete(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  UserController.delete
);

module.exports = userRouter;
