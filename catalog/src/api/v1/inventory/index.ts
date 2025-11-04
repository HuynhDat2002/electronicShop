import express from "express";
import { asyncHandler } from "@/helpers";
import { InventoryController } from "./inventory.controller";

const router = express.Router();

const inventoryController = new InventoryController();

// ✅ CREATE
router.post("/inventory", asyncHandler(inventoryController.create));

// ✅ UPDATE
router.patch("/inventory/:id", asyncHandler(inventoryController.update));

// ✅ GET ALL (FIND)
router.get("/inventories", asyncHandler(inventoryController.find));

// ✅ GET ONE (FIND ONE)
router.get("/inventory/:id", asyncHandler(inventoryController.findOne));

// ✅ DELETE ONE
router.delete("/inventory/:id", asyncHandler(inventoryController.delete));

// ✅ DELETE ALL
router.delete(
  "/inventory/delete/all",
  asyncHandler(inventoryController.deleteAll)
);

export default router;