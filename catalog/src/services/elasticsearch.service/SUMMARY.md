# Elasticsearch Index - Summary

## 📊 Cấu trúc Index: `products`

### Quy tắc Type Mapping

| Field Type | ES Type | Lý do |
|-----------|---------|-------|
| **Single Object** | `object` | Đơn giản, không cần nested query |
| **Array of Objects** | `nested` | Tránh cross-object matching |
| **Flattened Variants** | `keyword` | Filter nhanh với term query |

---

## 🗂️ Index Structure

```typescript
{
  // === BASIC INFO ===
  spu_id: string (keyword)
  spu_name: string (text + keyword)
  spu_slug: string (keyword)
  spu_description: string (text)
  spu_status: string (keyword)

  // === SINGLE OBJECTS (type: object) ===
  spu_thumb: {
    image_id: string
    image_url: string
  }

  default_sku: {
    sku_id: string
    sku_name: string
    price: {
      original: number
      sale: number
      currency: string
    }
    image: {
      image_id: string
      image_url: string
    }
    stock_status: string
    available_quantity: number
  }

  price_range: {
    min: number
    max: number
  }

  // === FLATTENED VARIANTS (type: keyword) ===
  variant_colors: string[]
  variant_storages: string[]
  variant_rams: string[]
  variant_sizes: string[]

  // === ARRAYS (type: nested) ===
  variants_detail: [
    {
      variant_name: string
      variant_slug: string
      options: [
        {
          option_value: string
          option_label: string
          available: boolean
          min_price: number
          sku_count: number
        }
      ]
    }
  ]

  attributes: [
    {
      attribute_name: string
      attribute_value: string
      attribute_label: string
    }
  ]

  // === FILTER FIELDS ===
  category_id: string (keyword)
  brand: string (keyword)
  rating_average: number (float)
  review_count: number (integer)
  sold_count: number (integer)

  // === FLAGS ===
  is_available: boolean
  is_featured: boolean
  is_new: boolean

  // === METADATA ===
  created_at: date
  updated_at: date
}
```

---

## 🎯 Common Use Cases

### 1️⃣ **Tìm kiếm sản phẩm**
```json
{
  "query": {
    "multi_match": {
      "query": "iPhone",
      "fields": ["spu_name^3", "spu_description"]
    }
  }
}
```

### 2️⃣ **Filter theo variants (nhanh!)**
```json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "variant_colors": "red" } },
        { "term": { "variant_storages": "128gb" } }
      ]
    }
  }
}
```

### 3️⃣ **Filter theo price range**
```json
{
  "query": {
    "range": {
      "price_range.min": {
        "gte": 10000000,
        "lte": 20000000
      }
    }
  }
}
```

### 4️⃣ **Sort theo giá**
```json
{
  "sort": [
    { "price_range.min": { "order": "asc" } }
  ]
}
```

### 5️⃣ **Aggregation cho sidebar**
```json
{
  "aggs": {
    "colors": {
      "terms": { "field": "variant_colors" }
    },
    "price_ranges": {
      "range": {
        "field": "price_range.min",
        "ranges": [
          { "to": 10000000 },
          { "from": 10000000, "to": 20000000 }
        ]
      }
    }
  }
}
```

---

## ⚡ Performance Tips

### ✅ DO:
- Dùng `term` queries cho keyword fields
- Dùng flattened variants cho filter nhanh
- Cache aggregation results
- Limit size với pagination

### ❌ DON'T:
- Không dùng nested queries cho objects đơn
- Không lưu toàn bộ SKUs trong ES
- Không dùng wildcard queries khi có thể dùng term
- Không query variants_detail trừ khi cần metadata

---

## 📁 Files Structure

```
elasticsearch.service/
├── index.ts                 # Main service & index mapping
├── spu.elasticsearch/
│   └── index.ts            # CRUD operations
├── transform.helper.ts     # MongoDB → ES transformer
├── README.md              # Detailed docs & examples
├── MIGRATION_GUIDE.md     # Migration & structure guide
└── SUMMARY.md            # This file (quick reference)
```

---

## 🚀 Quick Start

### 1. Delete old index (if exists)
```bash
DELETE /spu
# or
DELETE /products
```

### 2. Restart service
```bash
# Service tự động tạo index mới
npm run dev
```

### 3. Sync data
```typescript
const allSpus = await spuModel
  .find()
  .populate('spu_skus spu_variants spu_default_sku');

for (const spu of allSpus) {
  await elasticSearchService.spuElasticSearch.create(spu);
}
```

### 4. Test queries
```bash
# Kibana Dev Tools
GET /products/_search
{
  "query": { "match_all": {} }
}
```

---

## 🔍 Debugging

### Check index exists
```bash
GET /products
```

### View mapping
```bash
GET /products/_mapping
```

### View a document
```bash
GET /products/_doc/{spu_id}
```

### Count documents
```bash
GET /products/_count
```

### Search with explain
```bash
GET /products/_search
{
  "explain": true,
  "query": { ... }
}
```

---

## 📚 Learn More

- **Detailed examples**: See [README.md](./README.md)
- **Migration guide**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Elasticsearch docs**: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html

---

## 🎓 Key Takeaways

1. **Object type** cho single objects → queries đơn giản
2. **Nested type** cho arrays → tránh cross-matching
3. **Flattened variants** → filter cực nhanh
4. **Chỉ index data cần search/filter** → performance tốt
5. **Detail data lưu MongoDB** → linh hoạt hơn

---

**Version**: 1.0
**Last Updated**: 2025-01-07
**Index Name**: `products`
