import express, { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@/helpers";
import { AttributeController } from "./attribute.controller";

const router = express.Router();

const attributeController = new AttributeController();

// ✅ CREATE
router.post("/attribute", asyncHandler(attributeController.create));

// ✅ UPDATE
router.patch("/attribute/:id", asyncHandler(attributeController.update));

// ✅ GET ALL (FIND)
router.get("/attributes", asyncHandler(attributeController.find));

// ✅ GET ONE (FIND ONE)
router.get("/attribute/:id", asyncHandler(attributeController.findOne));

// ✅ DELETE ONE
router.delete("/attribute/:id", asyncHandler(attributeController.delete));

// ✅ DELETE ALL
router.delete(
  "/attribute/delete/all",
  asyncHandler(attributeController.deleteAll)
);

export default router;