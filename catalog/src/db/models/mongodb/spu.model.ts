'use strict';
import { model, Schema, Types } from 'mongoose';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

const DOCUMENT_NAME = 'SPU';
const COLLECTION_NAME = 'SPUs';

export const spuSchema = new Schema(
  {
    spu_id: {
      type: String,
      index: true,
      required: true,
      unique: true,
      default: function () {
        return `spu_${Date.now()}_${Math.floor(1 + Math.random() * 100000000)}`;
      },
    },
    spu_name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    spu_slug: {
      type: String,
      unique: true,
      index: true,
    },
    spu_image: {
      type: [
        {
          image_id: String,
          image_name: String,
          image_url: String,
        },
      ],
      default: [],
    },
    spu_ratingAverage: {
      type: Number,
      default: 0,
      required: true,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    spu_thumb: {
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
    spu_status: {
      type: String,
      enum: ['draft', 'published', 'deleted', 'unPublished'],
      default: 'unPublished',
      index: true,
    },
    spu_description: {
      type: String,
      trim: true,
      default: '',
    },
    spu_total_sold: {
      type: Number,
      required: true,
      default: 0,
    },
    spu_variants: {
      type: Schema.Types.ObjectId,
      ref: 'Variant',
      default: null, // Mỗi SPU chỉ có 1 variant document duy nhất
    },
    spu_skus: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'SKU',
        },
      ],
      default: [],
    },
    spu_attributes: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, ref: 'Attribute' },
          attribute_value_id:{type:String},
          attribute_name:{type:String},
          attribute_value:{type:String,required:true},
          attribute_label:{type:String}
        },
      ],
      default: [],
    },
    spu_default_sku: {
      type: Schema.Types.ObjectId,
      ref: 'SKU',
      default: null, // SKU mặc định để hiển thị thumbnail
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

spuSchema.index({
  spu_name: 'text',
  spu_id: 'text',
  spu_slug: 'text',
  spu_description: 'text',
});
spuSchema.index({
  isPublished: 1,
  spu_sold: -1,
  createdAt: -1,
  product_sold: -1,
});
spuSchema.index({ 'product_attributes.category': 1 });

// Middleware

// Virtual để lấy SKUs
spuSchema.virtual('skus', {
  ref: 'SKU',
  localField: 'spu_id',
  foreignField: 'sku_spu_id',
});

// Virtual để lấy Attribute objects đầy đủ (thay vì chỉ có ID)
spuSchema.virtual('fullAttributes', {
  ref: 'Attribute',
  localField: 'spu_id',
  foreignField: 'attribute_spu_id',
});

spuSchema.pre('save', function (next) {
  this.spu_slug = slugify(this.spu_name, { lower: true });
  next();
});

const spuModel = model(DOCUMENT_NAME, spuSchema);

export { spuModel };

//variantSchema.post('save', async function (doc) { const Spu = this.model('SPU'); // Khi variant được tạo, thêm ID của nó vào SPU await Spu.findByIdAndUpdate( doc.variant_spu_id, { $addToSet: { variants: doc._id } } // $addToSet giúp không trùng lặp ); });
