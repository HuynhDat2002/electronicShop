import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Reservation";
const COLLECTION_NAME = "Reservations";

const reservationSchema = new Schema(
  {
    reser_id: {
      type: String,
      required:true,
      unique: true,
      default: function () {
        return `reser_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
    },
    reser_inventory: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
    },
    reser_inventory_id: {
      type: String,
      required:true,
      index:true  
    },
    reser_order_id: String,
    reser_quantity: Number,
    reservedAt: {
      type: Date,
      default: Date.now(),
    },
    expiredAt: {
      type: Date,
    },
    reser_status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);


const reservationModel = model(DOCUMENT_NAME, reservationSchema);
export { reservationModel };

// const stock = await reservation.aggregate([
//   {
//     $match: {
//       inven_productId: new mongoose.Types.ObjectId(skuId)
//     }
//   },
//   {
//     $group: {
//       _id: "$inven_sku_id",
//       total_available: { $sum: "$inven_stock" }
//     }
//   }
// ]);

// const reserved = await Reservation.aggregate([
//   { $match: { reser_inventory_id: inven._id, reser_status: "pending", expireAt: { $gt: new Date() } } },
//   { $group: { _id: null, total: { $sum: "$reser_quantity" } } }
// ]);