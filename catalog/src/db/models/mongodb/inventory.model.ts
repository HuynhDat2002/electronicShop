import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inven_id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `inven_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
      index: true,
    },
    inven_sku: {
      type: Schema.Types.ObjectId,
      ref: "SKU",
      index: true,
    },
    inven_sku_id: { type: String, index: true, required: true }, // để tìm kiếm nhanh
    inven_location: {
      type: String,
      default: "unknow",
    },
    inven_stock: {
      type: Number,
      default: 0,
      required: true,
    },
    inven_available: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Virtual để lấy SKUs
inventorySchema.virtual("reser", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "reser_inventory_id",
});

const inventoryModel = model(DOCUMENT_NAME, inventorySchema);
export { inventoryModel };
// const stock = await Inventory.aggregate([
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

// const inven = await Inventory.findById(invenId_HCM);

// const reserved = await Reservation.aggregate([
//   { $match: { reser_inventory_id: inven._id, reser_status: "pending", expireAt: { $gt: new Date() } } },
//   { $group: { _id: null, total: { $sum: "$reser_quantity" } } }
// ]);

// const reservedQty = reserved[0]?.total || 0;
// const available = inven.stock - reservedQty;

// console.log("Available:", available);
