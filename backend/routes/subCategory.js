const express = require("express");
const SubCategoryController = require("../controllers/subCategoryController");
const authMiddleware = require("../middlewares/auth");
const adminAuthMiddleware = require("../middlewares/adminAuth");

const subCateogryRouter = express.Router();

subCateogryRouter.get("/", authMiddleware, SubCategoryController.index);
subCateogryRouter.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  SubCategoryController.store
);
subCateogryRouter.delete(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  SubCategoryController.delete
);

module.exports = subCateogryRouter;
