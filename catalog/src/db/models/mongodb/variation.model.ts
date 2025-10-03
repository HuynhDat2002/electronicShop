"use strict";
import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
import { randomUUID } from "crypto";

const DOCUMENT_NAME = "Variation";
const COLLECTION_NAME = "Variations";

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
    variation_sku_id: {
      type: Schema.Types.ObjectId,
      ref: "SKU",
    },
    variation_name: {
      type: String,
      required: true,
      unique: true,
    }, // VD: "Màu sắc", "Kích thước", "Dung lượng", "RAM"

    variation_slug: {
      type: String,
      required: true,
      unique: true,
    },
    variation_type: {
      type: String,
      enum: ["color", "size", "text", "number"],
      default: "text",
    },
    variation_options: [
      {
        value: String,
        label: String,
        code: String, // Chỉ dành cho type = 'color'
        image_url: String, // Hình ảnh đại diện cho option này
        sortOrder: {
          type: Number,
          default: 0,
        },
      },
    ], // VD: [{"value": "red", "label": "Đỏ", "colorCode": "#FF0000"}]
    variation_category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    variation_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
variationSchema.pre("save", function (next) {
  this.variation_slug = slugify(this.variation_name, { lower: true });
  next();
});

const variationModel = model(DOCUMENT_NAME, variationSchema);

export { variationModel };
