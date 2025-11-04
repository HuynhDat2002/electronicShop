'use strict';
import mongoose, { model, Schema, Types } from 'mongoose';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

const DOCUMENT_NAME = 'Attribute';
const COLLECTION_NAME = 'Attributes';

// Schema cho Variation (thuộc tính tạo biến thể)
const attributeSchema = new Schema(
  {
    attribute_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: function () {
        return `attri_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
      },
    },
    attribute_name: {
      type: String,
      required: true,
    }, // VD: "Thương hiệu", "Chip xử lý", "Hệ điều hành", "Camera", "Pin"
    attribute_slug: {
      type: String,
      unique: true,
      index: true,
    }, // "thuong-hieu", "chip-xu-ly","he-dieu-hanh","camera"
    attribute_status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    attribute_options: {
      type: [
        {
          id: {
            type: String,
            required: true,
            unique: true,
            index: true,
            default: function () {
              return `value_${Date.now()}_${Math.floor(1 + Math.random() * 10)}`;
            },
          },
          value: String,
          label: String,
        },
      ],
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

attributeSchema.index({ attribute_slug: 1, attribute_value_slug: 1 }, { unique: true });
attributeSchema.pre('save', async function (next) {
  this.attribute_slug = slugify(this.attribute_name, { lower: true });
  next();
});

// post spu ==============

const attributeModel = model(DOCUMENT_NAME, attributeSchema);

export { attributeModel };
