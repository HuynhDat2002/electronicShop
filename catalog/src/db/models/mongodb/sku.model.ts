import { model, Schema } from "mongoose";
import slugify from "slugify";
import { randomUUID } from "crypto";
import { NextFunction } from "express";

// ===== SKU SCHEMA (Improved) =====
const DOCUMENT_NAME = "SKU";
const COLLECTION_NAME = "SKUs";

const skuSchema = new Schema(
  {
    sku_id: {
      type: String,
      required: true,
      unique: true,
       default: function (){
        return `sku_${Date.now()}_${Math.floor(1+Math.random()*10)}`
      },
    },
    sku_spu_id: {
      type: Schema.Types.ObjectId,
      ref: "SPU",
      required: true,
    },
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
      sale: { type: Number },
      cost: { type: Number }, // Giá vốn
      currency: { type: String, default: "VND" },
    },

    // Default SKU cho SPU
    sku_default: {
      type: Boolean,
      default: false,
    },

    // Sort order
    sku_sort: {
      type: Number,
      default: 0,
    },

   sku_status: {
      type: String,
      enum: ["draft", "published", "deleted", "unPublished"],
      default: "unPublished",
    },
    // Stats
    sku_sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);


skuSchema.index({ skuCode: 1 });
skuSchema.index({ sku_spu_id: 1 });

// Virtual để lấy Variation objects đầy đủ (thay vì chỉ có ID)
skuSchema.virtual("fullVariations", {
  ref: "Variation",
  localField: "_id",
  foreignField: "variation_sku_id",
});

skuSchema.virtual("inven",{
  ref: "Inventory",
  localField: "_id",
  foreignField: "inven_sku_id",
});


skuSchema.pre("save", function (next) {
  this.sku_slug = slugify(this.sku_name, { lower: true });
  next();
});

const skuModel = model(DOCUMENT_NAME, skuSchema);
export { skuModel };



  //  sku_variationValues:[
  //   {
  //     variation_id:{
  //       type:Schema.Types.ObjectId,
  //       ref:'Variation',
  //     },
  //     name:String,
  //     value:String,
  //     code:String
  //   }
  //  ],// VD: [{"variation_id": ObjectId("color"),"name":"color", "value": "red","code":"#bb0000"}, {"variation": ObjectId("storage"), "value": "256GB"}]

  //   // Attributes cụ thể của SKU này
  //   sku_attributes: {
  //     type: Map,
  //     of: String,
  //     // vd: { "color": "purple", "storage": "128GB" }
  //   },



   // // Physical properties
    // sku_physical: {
    //   weight: Number, // gram
    //   dimensions: {
    //     length: Number,
    //     width: Number,
    //     height: Number,
    //   },
    // },