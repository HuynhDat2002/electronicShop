import express from "express";
import { asyncHandler } from "@/helpers";
import { ReservationController } from "./reservation.controller";

const router = express.Router();

const reservationController = new ReservationController();

// ✅ CREATE
router.post("/reservation", asyncHandler(reservationController.create));

// ✅ UPDATE
router.patch("/reservation/:id", asyncHandler(reservationController.update));

// ✅ GET ALL (FIND)
router.get("/reservations", asyncHandler(reservationController.find));

// ✅ GET ONE (FIND ONE)
router.get("/reservation/:id", asyncHandler(reservationController.findOne));

// ✅ DELETE ONE
router.delete("/reservation/:id", asyncHandler(reservationController.delete));

// ✅ DELETE ALL
router.delete(
  "/reservation/delete/all",
  asyncHandler(reservationController.deleteAll)
);

export default router;