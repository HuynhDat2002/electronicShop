"use strict";
import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
import { randomUUID } from "crypto";

const DOCUMENT_NAME = "Attribute";
const COLLECTION_NAME = "Attributes";

// Schema cho Variation (thuộc tính tạo biến thể)
const attributeSchema = new Schema(
  {
    attribute_id: {
      type: String,
      required: true,
      unique: true,
        
       default: function (){
        return `attri_${Date.now()}_${Math.floor(1+Math.random()*10)}`
      },
    },
    attribute_spu_id:{
       type: Schema.Types.ObjectId,
      ref: "SPU",
    },
    attribute_name: {
      type: String,
      required: true,
      unique: true,
    }, // VD: "Thương hiệu", "Chip xử lý", "Hệ điều hành", "Camera", "Pin"
    attribute_slug: {
      type: String,
      required: true,
      unique: true,
    }, // "thuong-hieu", "chip-xu-ly","he-dieu-hanh","camera"
    attribute_type: {
      type: String,
      enum: ["text", "number", "boolean", "array"],
      default: "text",
    },
    // VD: "mAh", "MP", "inch"
    attribute_category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    }, // Thuộc tính này áp dụng cho category nào
    attribute_isRequired: {
      type: Boolean,
      default: false,
    },
    attribute_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection:COLLECTION_NAME
  }
);


// Indexes
attributeSchema.index({ attribute_name: 1, attribute_category: 1 });


// Middleware
attributeSchema.pre("save", function (next) {
  this.attribute_slug = slugify(this.attribute_name, { lower: true });
  next();
});



const attributeModel = model(DOCUMENT_NAME, attributeSchema);

export { attributeModel };









