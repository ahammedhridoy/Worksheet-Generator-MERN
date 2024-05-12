const express = require("express");
const CateogryController = require("../controllers/categoryController");
const adminAuthMiddleware = require("../middlewares/adminAuth");
const authMiddleware = require("../middlewares/auth");

const categoryRouter = express.Router();

categoryRouter.get("/", authMiddleware, CateogryController.index);
categoryRouter.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  CateogryController.store
);
categoryRouter.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  CateogryController.update
);
categoryRouter.delete(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  CateogryController.delete
);
categoryRouter.get(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  CateogryController.show
);

module.exports = categoryRouter;
