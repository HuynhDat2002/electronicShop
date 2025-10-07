'use strict';
import { model, Schema, Types } from 'mongoose';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

const DOCUMENT_NAME = 'Variation';
const COLLECTION_NAME = 'Variations';

const counterSchema = new Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
// Schema cho Variation (thuộc tính tạo biến thể)
const variationSchema = new Schema(
  {
    variation_id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `variation_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
    },
    variation_spu_id: {
      type: Schema.Types.ObjectId,
      ref: 'SPU',
    },
    variation_name: {
      type: String,
      required: true,
      unique: true,
    }, // VD: "Color", "Storage", "RAM" // use english

    variation_slug: {
      type: String,
      required: true,
      unique: true,
    },

    variation_options: {
      type: [
        {
          option_value: String, //"red", "256gb",
          option_label: String, // "đỏ", "256gb"
          option_code: String, //"#FF0000","256gb" -- có thể bỏ trống          
        },
      ],
      default: [],
    }, // VD: [{"value": "red", "label": "Đỏ", "colorCode": "#FF0000"}]
    variation_status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Indexes
variationSchema.index({ variation_name: 1, variation_category: 1 });

// Middleware
variationSchema.pre('save', function (next) {
  this.variation_slug = slugify(this.variation_name, { lower: true });
  next();
});
variationSchema.pre('save', function (next) {
  if (this.variation_options && this.variation_options.length > 0) {
    this.variation_options.sort((a, b) => {
      // Nếu option là dung lượng (chứa GB / TB)
      const aVal = parseStorageValue(a.option_label || a.option_value);
      const bVal = parseStorageValue(b.option_label || b.option_value);
      return aVal - bVal;
    });
  }
  next();
});

function parseStorageValue(value) {
  if (!value) return 0;
  value = value.toString().toLowerCase().trim();

  // Nếu là số
  if (/^\d+$/.test(value)) return Number(value);

  // Nếu là dung lượng (VD: 256gb, 1tb)
  if (value.endsWith('gb')) return Number(value.replace('gb', '')) * 1;
  if (value.endsWith('tb')) return Number(value.replace('tb', '')) * 1024;

  // Nếu là RAM (VD: 8g, 16g)
  if (value.endsWith('g')) return Number(value.replace('g', ''));

  // Nếu là chữ màu sắc thì giữ nguyên thứ tự cũ
  return Number.MAX_SAFE_INTEGER;
}
const variationModel = model(DOCUMENT_NAME, variationSchema);

export { variationModel };
