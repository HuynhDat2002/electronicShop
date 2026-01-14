import mongoose, { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const invenSchema = new Schema(
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
      ref: 'SKU',
      required: true,
    },
    inven_sku_id: { type: String, index: true, required: true }, // để tìm kiếm nhanh
    inven_location: {
      type: String,
      default: 'unknow',
    },
    inven_stock: {
      type: Number,
      default: 0,
      required: true,
    },
    inven_status: {
      type: String,
      enum: ['inStock', 'outOfStock', 'discontinued'],
      default: 'inStock',
      index: true,
    },
    inven_reserved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Reservation',
        },
      ],
      default: [],
    },
    inven_available: { type: Number },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

invenSchema.pre('validate', async function (next) {
  if (!this.inven_sku && this.inven_sku_id) {
    const sku = await this.model('SKU').findOne({ sku_id: this.inven_sku_id });
    if (sku) this.inven_sku = sku._id;
  }
  if (this.isNew) {
    (this as any)._wasNew = this.isNew;
  }
  next();
});

invenSchema.pre('save', async function (next) {
  if (!this.inven_available) {
    this.inven_available = this.inven_stock;
  }
  next();
});

invenSchema.post('save', async function (doc) {
  if ((this as any)._wasNew) {
    const Sku = this.model('SKU');
    await Sku.findByIdAndUpdate(this.inven_sku, {
      $addToSet: { sku_inventories: this._id },
    });
  }
});

invenSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  const Spu = mongoose.model('SKU');
  await Spu.findByIdAndUpdate(doc.inven_sku, {
    $pull: { sku_inventories: doc._id },
  });
});
const inventoryModel = model(DOCUMENT_NAME, invenSchema);
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
