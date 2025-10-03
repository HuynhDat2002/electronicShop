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
      required: true,
      unique: true,
      default: function () {
        return `spu_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
    },
    spu_name: {
      type: String,
      required: true,
      trim: true,
    },
    spu_slug: {
      type: String,
      unique: true,
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
      default:{
        image_id: "",
        image_name: "",
        image_url: "",
      }     
    },
    spu_status: {
      type: String,
      enum: ['draft', 'published', 'deleted', 'unPublished'],
      default: 'unPublished',
    },
    spu_description: {
      type: String,
      trim: true,
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
  localField: '_id',
  foreignField: 'sku_spu_id',
});

// Virtual để lấy Attribute objects đầy đủ (thay vì chỉ có ID)
spuSchema.virtual('fullAttributes', {
  ref: 'Attribute',
  localField: '_id',
  foreignField: 'attribute_spu_id',
});

spuSchema.pre('save', function (next) {
  this.spu_slug = slugify(this.spu_name, { lower: true });
  next();
});

const spuModel = model(DOCUMENT_NAME, spuSchema);

export { spuModel };

// spu_variations: [
//   {
//     variation: {
//       type: Schema.Types.ObjectId,
//       ref: "Variation",
//       required: true,
//     },
//     options: [String],
//   },
// ], // VD: [{"variation": "color", "options": [{value:"red",code:"#bb0000"}, {value:"blue",code:"#1338be"}]}, {"variation": "storage", "options": ["128GB", "256GB"]}]
// spu_attributes: [
//   {
//     attribute: {
//       type: Schema.Types.ObjectId,
//       ref: "Attribute",
//       required: true,
//     },
//     value: Schema.Types.Mixed,
//   },
// ], // VD: [{"attribute": "brand", "value": "Apple"}, {"attribute": "os", "value": "iOS 17"}]

// {
//   "_id": "123",
//   "name": "iPhone 14 Plus 256GB",
//   "sections": [
//     {
//       "title": "Cấu hình máy được hỗ trợ bởi bộ vi xử lý mạnh mẽ",
//       "content": "Ngoài việc sở hữu chipset A15 Bionic thế hệ mới..."
//     },
//     {
//       "title": "Sở hữu các tính năng hiện đại cùng camera trước có độ phân giải cao",
//       "content": "Bên cạnh cụm camera sau được thiết kế chéo độc đáo..."
//     }
//   ]
// }
