import { model, Schema } from 'mongoose';
import slugify from 'slugify';
import { randomUUID } from 'crypto';
import { NextFunction } from 'express';
import mongoose from 'mongoose';
// ===== SKU SCHEMA (Improved) =====
const DOCUMENT_NAME = 'SKU';
const COLLECTION_NAME = 'SKUs';

sku_variants: [
  {
    variant_name: 'Color',
    variant_slug: 'color',
    option_value: 'blue',
    option_label: 'Xanh dương',
  },
  {
    variant_name: 'Storage',
    variant_slug: 'storage',
    option_value: '256gb',
    option_label: '256GB',
  },
];

const skuSchema = new Schema(
  {
    sku_id: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: function () {
        return `sku_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
    },
    sku_spu: { type: Schema.Types.ObjectId, ref: 'SPU', required: true }, // để populate
    sku_spu_id: { type: String, index: true, required: true }, // để tìm kiếm nhanh
    // SKU specific info
    sku_name: {
      type: String,
      required: true, // vd: "iPhone 14 Plus 128GB Purple"
    },
    sku_slug: {
      type: String,
      index: true,
      unique: true,
    },
    // Pricing
    sku_price: {
      original: { type: Number, required: true },
      sale: { type: Number, default: 0 },
      cost: { type: Number }, // Giá vốn
      currency: { type: String, default: 'VND' },
    },

    // Default SKU cho SPU
    sku_default: {
      type: Boolean,
      default: false,
    },

    sku_status: {
      type: String,
      enum: ['draft', 'published', 'deleted', 'unPublished'],
      default: 'published',
      index: true,
    },
    // Status
    sku_sold: {
      type: Number,
      default: 0,
    },
    sku_image: {
      type: {
        image_id: String,
        image_name: String,
        image_url: String,
      },
      default: {
        image_id: '',
        image_name: '',
        image_url: '',
      },
    },
    sku_inventories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Inventory',
        },
      ],
      default: [],
    },
    sku_variants: {
      type: [
        {
          variant_name: { type: String, required: true }, // "Color", "Storage"
          variant_slug: { type: String, required: true }, // "color", "storage"
          option_value: { type: String, required: true }, // "red", "128gb"
          option_label: { type: String, required: true }, // "Đỏ", "128GB"
        },
      ],
      default: [],
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// skuSchema.virtual('inven', {
//   ref: 'Inventory',
//   localField: '_id',
//   foreignField: 'inven_sku_id',
// });
// skuSchema.set('toObject', { virtuals: true });
// skuSchema.set('toJSON', { virtuals: true });

//===========pre==========================
skuSchema.pre('save', function (next) {
  this.sku_slug = slugify(this.sku_name, { lower: true });
  next();
});

skuSchema.pre('save', async function (next) {
  const price = this.sku_price;
  if (price && !price.cost) {
    price.cost = price.original ?? 0;
  }
  if (!this.isNew || this.isModified('sku_sold')) {
    const oldDoc = (await mongoose.model('SKU').findById(this._id).lean()) as { sku_sold?: number };
    (this as any)._oldSold = oldDoc?.sku_sold ?? 0;
  }
  next();
});
skuSchema.pre('validate', async function (next) {
  if (!this.sku_spu && this.sku_spu_id) {
    const spu = await this.model('SPU').findOne({ spu_id: this.sku_spu_id });
    if (spu) this.sku_spu = spu._id;
  }
  if (this.isNew) {
    (this as any)._wasNew = this.isNew;
  }
  next();
});

//==============after===================
skuSchema.post('save', async function (doc) {
  const diff = (doc.sku_sold ?? 0) - ((this as any)._oldSold ?? 0);
  if (diff === 0) return;
  await this.model('SPU').findByIdAndUpdate(doc.sku_spu, {
    $inc: { spu_total_sold: diff },
  });
});

skuSchema.post('save', async function (doc) {
  if ((this as any)._wasNew) {
    const Spu = this.model('SPU');
    await Spu.findByIdAndUpdate(this.sku_spu, {
      $addToSet: { spu_skus: this._id },
    });
  }
});
const deleteHooks = ['findOneAndDelete', 'findByIdAndDelete'];

skuSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  const Spu = mongoose.model('SPU');
  await Spu.findByIdAndUpdate(doc.sku_spu, {
    $pull: { spu_skus: doc._id },
  });
});
// deleteHooks.forEach((event: any) => {
//   skuSchema.post(event, async function (doc) {
//     if (!doc) return;
//     const Spu = mongoose.model('SPU');
//     await Spu.findByIdAndUpdate(doc.sku_spu, {
//       $pull: { spu_skus: doc._id },
//     });
//   });
// });

const skuModel = model(DOCUMENT_NAME, skuSchema);
export { skuModel };
