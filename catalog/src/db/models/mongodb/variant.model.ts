'use strict';
import mongoose, { model, Schema, Types } from 'mongoose';
import slugify from 'slugify';
import { randomUUID } from 'crypto';
import { errorResponse } from '@/utils';

const DOCUMENT_NAME = 'Variant';
const COLLECTION_NAME = 'Variants';

const counterSchema = new Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
// Schema cho variant (thuộc tính tạo biến thể)
// Mỗi Variant document chứa TẤT CẢ các loại variants của một SPU
const variantSchema = new Schema(
  {
    variant_id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `variant_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
    },
    variant_spu: { type: Schema.Types.ObjectId, ref: 'SPU', required: true },
    variant_spu_id: {
      type: String,
      index: true,
      required: true,
      unique: true, // Mỗi SPU chỉ có 1 variant document
    },

    // Array chứa tất cả các loại variants (Color, Storage, RAM...)
    variant_list: {
      type: [
        {
          variant_name: {
            type: String,
            required: true,
          
          }, // VD: "Color", "Storage", "RAM"
          variant_slug: {
            type: String,
            required: true,
            unique:true
          },
          variant_options: {
            type: [
              {
                option_value: { type: String, required: true ,unique:true}, //"red", "256gb"
                option_label: { type: String, required: true }, // "đỏ", "256gb"
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },

    variant_status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Middleware

//pre slug ===============
variantSchema.pre('validate', function (next) {
  // Auto generate slug for each variant in variant_list
  if (this.variant_list && this.variant_list.length > 0) {
    this.variant_list.forEach((variant: any) => {
      if (variant.variant_name && !variant.variant_slug) {
        variant.variant_slug = slugify(variant.variant_name, { lower: true });
      }
    });
  }
  next();
});

//pre validate =============
variantSchema.pre('validate', async function (next) {
  if (!this.variant_spu && this.variant_spu_id) {
    const spu = await this.model('SPU').findOne({ spu_id: this.variant_spu_id });
    if (spu) this.variant_spu = spu._id;
    else{
      throw new errorResponse.NotFound('spu_id is not found');
    }
  }
  if (this.isNew) {
    (this as any)._wasNew = this.isNew;
  }
  next();
});


// post spu ==============
variantSchema.post('save', async function (doc) {
  if ((this as any)._wasNew) {
    const Spu = this.model('SPU');
    await Spu.findByIdAndUpdate(this.variant_spu, {
      $set: { spu_variants: this._id },
    });
  }
});

variantSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  const Spu = mongoose.model('SPU');
  await Spu.findByIdAndUpdate(doc.variant_spu, {
    $pull: { spu_variants: doc._id },
  });
});

function parseStorageValue(value: any) {
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


const variantModel = model(DOCUMENT_NAME, variantSchema);

export { variantModel };
