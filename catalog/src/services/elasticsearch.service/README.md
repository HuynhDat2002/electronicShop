# Elasticsearch Service - Products Index

## Cấu trúc Index

Index name: `products`

### Document Structure

```json
{
  "spu_id": "spu_123",
  "spu_name": "iPhone 14 Plus",
  "spu_slug": "iphone-14-plus",
  "spu_description": "Điện thoại iPhone 14 Plus với màn hình lớn...",
  "spu_status": "published",

  "spu_thumb": {
    "image_id": "img_123",
    "image_url": "https://..."
  },

  "default_sku": {
    "sku_id": "sku_456",
    "sku_name": "iPhone 14 Plus 128GB Đỏ",
    "sku_slug": "iphone-14-plus-128gb-red",
    "price": {
      "original": 20000000,
      "sale": 18000000,
      "currency": "VND"
    },
    "discount_percent": 10,
    "image": {
      "image_id": "img_456",
      "image_url": "https://..."
    },
    "stock_status": "inStock",
    "available_quantity": 50
  },

  "price_range": {
    "min": 18000000,
    "max": 25000000
  },

  "variant_colors": ["red", "blue", "black"],
  "variant_storages": ["128gb", "256gb", "512gb"],

  "variants_detail": [
    {
      "variant_name": "Color",
      "variant_slug": "color",
      "options": [
        {
          "option_value": "red",
          "option_label": "Đỏ",
          "available": true,
          "min_price": 18000000,
          "sku_count": 3
        }
      ]
    }
  ],

  "attributes": [
    {
      "attribute_name": "screen_size",
      "attribute_value": "6.7 inch",
      "attribute_label": "6.7 inch"
    }
  ],

  "category_id": "electronics",
  "brand": "Apple",
  "rating_average": 4.5,
  "review_count": 150,
  "sold_count": 1200,

  "is_available": true,
  "is_featured": false,
  "is_new": true,

  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-05T00:00:00Z"
}
```

## Các Use Cases

### 1. Tìm kiếm sản phẩm (Full-text Search)

```javascript
// Search: "iPhone 14"
const result = await elasticSearchService.search({
  search: 'iPhone 14',
  limit: 20,
  page: 1
});
```

**Elasticsearch Query:**
```json
{
  "query": {
    "multi_match": {
      "query": "iPhone 14",
      "fields": ["spu_name^3", "spu_slug", "spu_description"],
      "fuzziness": "AUTO"
    }
  },
  "sort": [
    { "created_at": { "order": "desc" } }
  ],
  "size": 20,
  "from": 0
}
```

### 2. Filter theo Variants (Color + Storage)

**Use case:** User chọn màu Đỏ VÀ dung lượng 256GB

```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "spu_status": "published" } }
      ],
      "filter": [
        { "term": { "variant_colors": "red" } },
        { "term": { "variant_storages": "256gb" } }
      ]
    }
  }
}
```

### 3. Filter theo Price Range

**Use case:** Sản phẩm có giá từ 15-20 triệu

```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "spu_status": "published" } }
      ],
      "filter": [
        { "range": { "price_range.min": { "lte": 20000000 } } },
        { "range": { "price_range.max": { "gte": 15000000 } } }
      ]
    }
  }
}
```

### 4. Filter kết hợp (Search + Variants + Price)

**Use case:** Tìm "iPhone" màu Đỏ, 128GB, giá 15-20 triệu, còn hàng

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "iPhone",
            "fields": ["spu_name^3", "spu_description"]
          }
        }
      ],
      "filter": [
        { "term": { "spu_status": "published" } },
        { "term": { "is_available": true } },
        { "term": { "variant_colors": "red" } },
        { "term": { "variant_storages": "128gb" } },
        {
          "range": {
            "price_range.min": {
              "gte": 15000000,
              "lte": 20000000
            }
          }
        }
      ]
    }
  },
  "sort": [
    { "sold_count": { "order": "desc" } }
  ]
}
```

### 5. Aggregations cho Filter Sidebar

**Use case:** Lấy danh sách tất cả options để hiển thị filter sidebar

```json
{
  "size": 0,
  "query": {
    "bool": {
      "must": [
        { "term": { "spu_status": "published" } }
      ]
    }
  },
  "aggs": {
    "colors": {
      "terms": {
        "field": "variant_colors",
        "size": 50
      }
    },
    "storages": {
      "terms": {
        "field": "variant_storages",
        "size": 50
      }
    },
    "brands": {
      "terms": {
        "field": "brand",
        "size": 50
      }
    },
    "price_ranges": {
      "range": {
        "field": "price_range.min",
        "ranges": [
          { "key": "0-10M", "to": 10000000 },
          { "key": "10-20M", "from": 10000000, "to": 20000000 },
          { "key": "20-30M", "from": 20000000, "to": 30000000 },
          { "key": "30M+", "from": 30000000 }
        ]
      }
    }
  }
}
```

### 6. Filter theo Attributes (Nested)

**Use case:** Tìm sản phẩm có màn hình "6.7 inch"

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "nested": {
            "path": "attributes",
            "query": {
              "bool": {
                "must": [
                  { "term": { "attributes.attribute_name": "screen_size" } },
                  { "match": { "attributes.attribute_value": "6.7 inch" } }
                ]
              }
            }
          }
        }
      ]
    }
  }
}
```

### 7. Sort Options

```json
// Sort by: Mới nhất
{ "sort": [{ "created_at": { "order": "desc" } }] }

// Sort by: Bán chạy
{ "sort": [{ "sold_count": { "order": "desc" } }] }

// Sort by: Giá thấp -> cao
{ "sort": [{ "price_range.min": { "order": "asc" } }] }

// Sort by: Giá cao -> thấp
{ "sort": [{ "price_range.max": { "order": "desc" } }] }

// Sort by: Đánh giá cao nhất
{ "sort": [{ "rating_average": { "order": "desc" } }] }
```

### 8. Autocomplete / Suggestions

**Use case:** Gợi ý khi user đang gõ "iph..."

```json
{
  "query": {
    "bool": {
      "should": [
        {
          "match_phrase_prefix": {
            "spu_name": {
              "query": "iph",
              "slop": 3
            }
          }
        },
        {
          "match": {
            "spu_name.keyword": {
              "query": "iph",
              "fuzziness": "AUTO"
            }
          }
        }
      ]
    }
  },
  "size": 10,
  "_source": ["spu_id", "spu_name", "spu_slug", "spu_thumb"]
}
```

## Data Sync Strategy

### Khi nào cần sync lại Elasticsearch?

1. **SPU được tạo/cập nhật/xóa** → Sync ngay
2. **SKU được tạo/cập nhật/xóa** → Sync SPU cha
3. **Variant được tạo/cập nhật** → Sync SPU
4. **Inventory thay đổi** → Sync SKU → Sync SPU (nếu ảnh hưởng stock_status)

### Event Listeners

```typescript
// Trong SPU model hook
spuSchema.post('save', async function(doc) {
  eventBus.emit('createSpu', doc);
});

// Trong SKU model hook
skuSchema.post('save', async function(doc) {
  eventBus.emit('syncSkuUpdate', { spu_id: doc.sku_spu_id });
});
```

## Performance Tips

### 1. Chỉ lưu data cần thiết
- ❌ Không lưu tất cả SKUs
- ✅ Chỉ lưu default SKU + summary
- ✅ Lưu variants summary cho filter

### 2. Sử dụng đúng field types
- `keyword` cho exact match (filter, sort)
- `text` cho full-text search
- `nested` cho arrays phức tạp
- `object` cho objects đơn giản

### 3. Caching
- Cache aggregation results (filter sidebar) trong 5-10 phút
- Cache search results với same query

### 4. Bulk Operations
Khi sync nhiều products, dùng bulk API:

```typescript
await client.bulk({
  operations: products.flatMap(doc => [
    { index: { _index: 'products', _id: doc.spu_id } },
    doc
  ])
});
```

## Testing Queries

### Cách test queries trong Kibana Dev Tools:

```
GET /products/_search
{
  "query": {
    "match": { "spu_name": "iPhone" }
  }
}
```

### Kiểm tra mapping:

```
GET /products/_mapping
```

### Xem document:

```
GET /products/_doc/spu_123
```

### Delete và recreate index:

```
DELETE /products

# Sau đó restart service để tạo lại index
```

## Troubleshooting

### 1. Không tìm thấy sản phẩm sau khi tạo
→ Kiểm tra xem event listener có chạy không
→ Kiểm tra logs: "✅ Product created in elasticsearch"

### 2. Filter không hoạt động
→ Kiểm tra mapping của field
→ Đảm bảo field là `keyword` type nếu dùng `term` query

### 3. Tiếng Việt không search được
→ Mapping đã có `vietnamese_analyzer`
→ Hoặc dùng `match` thay vì `term`

### 4. Performance chậm
→ Kiểm tra số lượng shards
→ Xem query complexity
→ Consider adding cache layer
