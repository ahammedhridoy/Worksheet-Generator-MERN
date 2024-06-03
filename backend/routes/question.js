const express = require("express");
const QuestionController = require("../controllers/questionController");
const authMiddleware = require("../middlewares/auth");
const adminAuthMiddleware = require("../middlewares/adminAuth");
const { upload } = require("../helpers/multer");

const questionRouter = express.Router();

questionRouter.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  upload.single("image"),
  QuestionController.store
);
questionRouter.get("/", authMiddleware, QuestionController.index);
questionRouter.get(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  QuestionController.show
);
questionRouter.delete(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  QuestionController.delete
);
questionRouter.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  upload.single("image"),
  QuestionController.update
);

module.exports = questionRouter;
