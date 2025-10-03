"use strict";
import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
import { NextFunction } from "express";

// ===== SPU SCHEMA (Improved) =====
const DOCUMENT_NAME_SPU = "SPU";
const COLLECTION_NAME_SPU = "SPUs";

const spuSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `SPU_${new Types.ObjectId().toString()}`,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_slug: {
      type: String,
      unique: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 0"],
      max: [5, "Rating must be above 5"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product_ratingsQuantity: {
      type: Number,
      default: 0,
    },

    // Cải tiến product_variations để rõ ràng hơn
    product_variations: [
      {
        name: {
          type: String,
          required: true, // vd: 'color', 'storage', 'size'
        },
        display_name: {
          type: String,
          required: true, // vd: 'Màu sắc', 'Bộ nhớ', 'Kích thước'
        },
        options: [
          {
            value: String, // 'red', '128GB'
            display_name: String, // 'Đỏ', '128GB'
            image: String, // URL ảnh cho option này
            extra_data: Schema.Types.Mixed, // Thêm data như color_code, price_modifier
          },
        ],
      },
    ],

    product_thumb: {
      type: String,
      required: true,
    },
    product_images: [
      {
        type: String,
      },
    ],
    product_description: {
      type: String,
      trim: true,
    },

    // Price range từ các SKU
    product_price_range: {
      min: { type: Number },
      max: { type: Number },
    },

    // Tổng quantity từ các SKU
    product_total_stock: {
      type: Number,
      default: 0,
    },

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    // Cải tiến product_attributes
    product_attributes: {
      brand: { type: String },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
      specifications: Schema.Types.Mixed, // Thông số kỹ thuật
      features: [String], // Tính năng nổi bật
      tags: [String], // Tags cho SEO
    },

    // Trạng thái sản phẩm
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

    // Thống kê
    product_sold: {
      type: Number,
      default: 0,
    },
    product_views: {
      type: Number,
      default: 0,
    },

    // SEO
    seo: {
      meta_title: String,
      meta_description: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_SPU,
  }
);

// ===== SKU SCHEMA (Improved) =====
const DOCUMENT_NAME_SKU = "SKU";
const COLLECTION_NAME_SKU = "SKUs";

const skuSchema = new Schema(
  {
    sku_id: {
      type: String,
      required: true,
      unique: true,
    },

    // Reference to SPU
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    spu_ref: {
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
    },

    // Tier index để map với product_variations của SPU
    sku_tier_idx: {
      type: [Number],
      default: [0], // [0, 1] có nghĩa là option đầu tiên của variation đầu, option thứ 2 của variation thứ 2
    },

    // Attributes cụ thể của SKU này
    sku_attributes: {
      type: Map,
      of: String,
      // vd: { "color": "purple", "storage": "128GB" }
    },

    // Pricing
    sku_price: {
      original: { type: Number, required: true },
      sale: { type: Number },
      cost: { type: Number }, // Giá vốn
      currency: { type: String, default: "VND" },
    },

    // Inventory management
    sku_stock: {
      required: true,
      quantity: { type: Number, default: 0, min: 0 },
      reserved: { type: Number, default: 0 }, // Đang trong giỏ hàng
      available: { type: Number, default: 0 }, // quantity - reserved
      min_stock: { type: Number, default: 0 },
      max_stock: { type: Number, default: 1000 },
    },

    // SKU specific images
    sku_images: [String],

    // Physical properties
    sku_physical: {
      weight: Number, // gram
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
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

    // Status
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

    // Stats
    sku_sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_SKU,
  }
);

// ===== INDEXES =====
// SPU Indexes
spuSchema.index({ product_name: "text", product_description: "text" });
spuSchema.index({ product_shop: 1, isPublished: 1 });
spuSchema.index({ "product_attributes.category": 1 });
spuSchema.index({ product_sold: -1 }); // For bestsellers
spuSchema.index({ createdAt: -1 }); // For newest products

// SKU Indexes
skuSchema.index({ product_id: 1, isPublished: 1 });
skuSchema.index({ sku_id: 1 });
skuSchema.index({ "sku_stock.available": 1 });
skuSchema.index({ "sku_price.sale": 1 });

// ===== MIDDLEWARE =====
// SPU Pre-save middleware
spuSchema.pre("save", function (next) {
  if (this.isModified("product_name")) {
    this.product_slug = slugify(this.product_name, { lower: true });
  }
  next();
});

// SKU Pre-save middleware
skuSchema.pre("save", function (next) {
  // Auto calculate available stock
  if (
    this.isModified("sku_stock.quantity") ||
    this.isModified("sku_stock.reserved")
  ) {
    this.sku_stock.available =
      this.sku_stock.quantity - this.sku_stock.reserved;
  }

  // Generate slug
  if (this.isModified("sku_name")) {
    this.sku_slug = slugify(this.sku_name, { lower: true });
  }

  next();
});

// ===== STATIC METHODS =====
// SPU Methods
spuSchema.statics.findWithAvailableSKUs = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "SKUs",
        localField: "product_id",
        foreignField: "product_id",
        as: "skus",
        pipeline: [
          { $match: { "sku_stock.available": { $gt: 0 }, isPublished: true } },
        ],
      },
    },
    {
      $match: {
        skus: { $ne: [] }, // Chỉ lấy SPU có ít nhất 1 SKU available
        isPublished: true,
      },
    },
  ]);
};

// SKU Methods
skuSchema.statics.updateStock = async function (
  skuId: string,
  quantity: number
) {
  const session = await this.db.startSession();

  try {
    return await session.withTransaction(async () => {
      const sku = await this.findOneAndUpdate(
        {
          sku_id: skuId,
          "sku_stock.available": { $gte: quantity },
        },
        {
          $inc: {
            "sku_stock.quantity": -quantity,
            "sku_stock.available": -quantity,
            sku_sold: quantity,
          },
        },
        { new: true, session }
      );

      if (!sku) {
        throw new Error("Insufficient stock");
      }

      return sku;
    });
  } finally {
    await session.endSession();
  }
};

// ===== INSTANCE METHODS =====
// SPU instance methods
spuSchema.methods.updatePriceRange = async function () {
  const SKU = model("SKU");
  const priceStats = await SKU.aggregate([
    { $match: { product_id: this.product_id, isPublished: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$sku_price.sale" },
        maxPrice: { $max: "$sku_price.sale" },
        totalStock: { $sum: "$sku_stock.available" },
      },
    },
  ]);

  if (priceStats.length > 0) {
    this.product_price_range = {
      min: priceStats[0].minPrice,
      max: priceStats[0].maxPrice,
    };
    this.product_total_stock = priceStats[0].totalStock;
    await this.save();
  }
};

// ===== MODELS =====
const spuModel = model(DOCUMENT_NAME_SPU, spuSchema);
const skuModel = model(DOCUMENT_NAME_SKU, skuSchema);

export { spuModel, skuModel };

// Variation 2: Màu sắc
// {
//   variation_id: "VAR_COLOR_IP14P",
//   name: "Màu sắc",
//   type: "color",
//   sort: 2,
//   is_required: true,
//   options: [
//     {
//       value_id: "COLOR_PURPLE_IP14P",
//       value_name: "Purple",
//       value_code: "#9BB5FF",
//       value_image: "https://example.com/iphone14plus/purple-variant.jpg",
//       price_modifier: 0,
//       sort: 1,
//       is_active: true,
//       special_info: {
//         is_new_color: true,
//         marketing_label: "Màu mới 2024"
//       }
//     },
//     {
//       value_id: "COLOR_BLUE_IP14P",
//       value_name: "Blue",
//       value_code: "#4F7CAC",
//       value_image: "https://example.com/iphone14plus/blue-variant.jpg",
//       price_modifier: 0,
//       sort: 2,
//       is_active: true,
//       special_info: {
//         is_popular: true,
//         marketing_label: "Bán chạy nhất"
//       }
//     },
//     {
//       value_id: "COLOR_MIDNIGHT_IP14P",
//       value_name: "Midnight",
//       value_code: "#1D1D1F",
//       value_image: "https://example.com/iphone14plus/midnight-variant.jpg",
//       price_modifier: 0,
//       sort: 3,
//       is_active: true
//     },
//     {
//       value_id: "COLOR_RED_IP14P",
//       value_name: "(PRODUCT)RED",
//       value_code: "#BA0C2F",
//       value_image: "https://example.com/iphone14plus/red-variant.jpg",
//       price_modifier: 1000000,     // +1 triệu (phiên bản đặc biệt)
//       sort: 4,
//       is_active: true,
//       special_info: {
//         is_limited_edition: true,
//         marketing_label: "Phiên bản đặc biệt",
//         charity_info: "Hỗ trợ quỹ chống AIDS"
//       }
//     }
//   ]
// }

const brandAttribute = {
  attribute_id: "ATTR_BRAND_001",
  attribute_name: "Thương hiệu",
  attribute_slug: "thuong-hieu",
  attribute_type: "select",
  attribute_category: ["electronics", "smartphone"],
  attribute_values: [
    {
      value_id: "BRAND_APPLE",
      value_name: "Apple",
      value_sort: 1,
      is_active: true,
    },
    {
      value_id: "BRAND_SAMSUNG",
      value_name: "Samsung",
      value_sort: 2,
      is_active: true,
    },
  ],
  is_variation: false, // Không tạo SKU
  is_global: true, // Dùng chung nhiều sản phẩm
  shop_id: "GLOBAL",
};
const chipAttribute = {
  attribute_id: "ATTR_CHIP_001",
  attribute_name: "Chip xử lý",
  attribute_slug: "chip-xu-ly",
  attribute_type: "select",
  attribute_category: ["electronics", "smartphone"],
  attribute_values: [
    {
      value_id: "CHIP_A16_BIONIC",
      value_name: "A16 Bionic",
      value_sort: 1,
      is_active: true,
    },
    {
      value_id: "CHIP_A15_BIONIC",
      value_name: "A15 Bionic",
      value_sort: 2,
      is_active: true,
    },
  ],
  is_variation: false,
  is_global: true,
  shop_id: "GLOBAL",
};
const osAttribute = {
  attribute_id: "ATTR_OS_001",
  attribute_name: "Hệ điều hành",
  attribute_slug: "he-dieu-hanh",
  attribute_type: "select",
  attribute_category: ["electronics", "smartphone"],
  attribute_values: [
    {
      value_id: "OS_IOS",
      value_name: "iOS",
      value_sort: 1,
      is_active: true,
    },
    {
      value_id: "OS_ANDROID",
      value_name: "Android",
      value_sort: 2,
      is_active: true,
    },
  ],
  is_variation: false,
  is_global: true,
  shop_id: "GLOBAL",
};

const sku_256gb_blue = {
  sku_id: "SKU_IP14P_256GB_BLUE",
  sku_code: "IP14P-256-BLU",
  spu_id: "SPU_IPHONE_14_PLUS_001",
  sku_name: "iPhone 14 Plus 256GB Blue",
  sku_slug: "iphone-14-plus-256gb-blue",
  // Variation combination được chọn
  sku_variations: [
    {
      variation_id: "VAR_STORAGE_IP14P",
      variation_name: "Dung lượng",
      value_id: "STORAGE_256GB_IP14P",
      value_name: "256GB",
      value_code: "256",
    },
    {
      variation_id: "VAR_COLOR_IP14P",
      variation_name: "Màu sắc",
      value_id: "COLOR_BLUE_IP14P",
      value_name: "Blue",
      value_code: "#4F7CAC",
      value_image: "https://example.com/iphone14plus/blue-variant.jpg",
    },
  ],
  // Pricing
  sku_price: 29990000, // base (24,990,000) + storage (5,000,000) + color (0)
  sku_original_price: 29990000,
  sku_discount_percent: 0,
  // Inventory
  sku_stock: 62,
  sku_reserved_stock: 8,
  sku_sold: 456,
  // Physical specs
  sku_weight: 203, // gram
  sku_dimensions: {
    length: 160.8, // mm
    width: 78.1,
    height: 7.8,
  },
  // Images specific to this SKU
  sku_images: [
    "https://example.com/iphone14plus/256gb-blue-front.jpg",
    "https://example.com/iphone14plus/256gb-blue-back.jpg",
    "https://example.com/iphone14plus/256gb-blue-box.jpg",
  ],
  // Flags
  sku_default: true, // SKU mặc định
  sku_sort: 1,
  is_active: true,
  // Status
  isDraft: false,
  isDeleted: false,
  isPublished: true,
};
// SKU 2: iPhone 14 Plus 512GB RED (Cao cấp + Đặc biệt)
const sku_512gb_red = {
  sku_id: "SKU_IP14P_512GB_RED",
  sku_code: "IP14P-512-RED",
  spu_id: "SPU_IPHONE_14_PLUS_001",
  sku_name: "iPhone 14 Plus 512GB (PRODUCT)RED",
  sku_slug: "iphone-14-plus-512gb-product-red",
  sku_variations: [
    {
      variation_id: "VAR_STORAGE_IP14P",
      variation_name: "Dung lượng",
      value_id: "STORAGE_512GB_IP14P",
      value_name: "512GB",
      value_code: "512",
    },
    {
      variation_id: "VAR_COLOR_IP14P",
      variation_name: "Màu sắc",
      value_id: "COLOR_RED_IP14P",
      value_name: "(PRODUCT)RED",
      value_code: "#BA0C2F",
      value_image: "https://example.com/iphone14plus/red-variant.jpg",
    },
  ],
  // Pricing - Cao nhất
  sku_price: 35990000, // base (24,990,000) + storage (10,000,000) + color (1,000,000)
  sku_original_price: 35990000,
  sku_discount_percent: 0,
  // Inventory - Limited
  sku_stock: 15,
  sku_reserved_stock: 2,
  sku_sold: 89,
  // Physical specs
  sku_weight: 203,
  sku_dimensions: {
    length: 160.8,
    width: 78.1,
    height: 7.8,
  },
  sku_images: [
    "https://example.com/iphone14plus/512gb-red-front.jpg",
    "https://example.com/iphone14plus/512gb-red-back.jpg",
    "https://example.com/iphone14plus/512gb-red-special-package.jpg",
  ],
  // Flags
  sku_default: false,
  sku_sort: 10, // Sort cao vì đắt nhất
  is_active: true,
  // Status
  isDraft: false,
  isDeleted: false,
  isPublished: true,
  // SKU-specific metadata
  sku_metadata: {
    is_limited_edition: true,
    charity_percentage: 5, // 5% cho quỹ từ thiện
    expected_delivery: "3-5 ngày",
  },
};
