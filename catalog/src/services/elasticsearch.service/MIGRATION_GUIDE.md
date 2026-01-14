# Migration Guide: Elasticsearch Index Structure

## Tổng quan thay đổi

Đã tối ưu hóa cấu trúc Elasticsearch index với:
- **Object types** cho single objects (spu_thumb, default_sku, price_range)
- **Nested types** cho arrays (variants_detail, attributes)
- **Flattened fields** cho variant filtering (variant_colors, variant_storages, etc.)

## Chi tiết thay đổi

### 1. **spu_thumb** (giữ object)
```diff
Structure: object (không đổi)
{
  "image_id": "...",
  "image_url": "..."
}
```

### 2. **default_sku** (giữ object)
```diff
Structure: object (không đổi)
{
  "sku_id": "...",
  "price": { "original": 1000, "sale": 900 },
  "image": { "image_id": "...", "image_url": "..." }
}
```

### 3. **price_range** (giữ object)
```diff
Structure: object (không đổi)
{
  "min": 1000,
  "max": 2000
}
```

### 4. **available_variants** → Flattened Fields
```diff
- "available_variants": { "color": ["red"], "storage": ["128gb"] }
+ "variant_colors": ["red", "blue"]
+ "variant_storages": ["128gb", "256gb"]
+ "variant_rams": ["8gb", "16gb"]

Type: Dynamic object → Multiple keyword fields
Lý do: Dễ filter hơn với term queries
```

### 5. **variants_detail** (nested array)
```json
"variants_detail": [
  {
    "variant_name": "Color",
    "variant_slug": "color",
    "options": [
      {
        "option_value": "red",
        "option_label": "Đỏ",
        "available": true,
        "min_price": 1000,
        "sku_count": 3
      }
    ]
  }
]
```
Type: nested (array of objects with nested options)

## Impact trên Queries

### Query Price Range (Simple!)

**Cách query (object type):**
```json
{
  "query": {
    "range": { "price_range.min": { "gte": 1000 } }
  }
}
```
✅ Đơn giản! Không cần nested query

### Query Variants (Đơn giản hơn!)

**Trước (dynamic object):**
```json
{
  "query": {
    "term": { "available_variants.color": "red" }
  }
}
```

**Sau (flattened fields):**
```json
{
  "query": {
    "term": { "variant_colors": "red" }
  }
}
```
✅ Đơn giản hơn, không cần nested query!

### Aggregations (Price Range)

**Cách query (object type):**
```json
{
  "aggs": {
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
✅ Đơn giản! Không cần nested aggregation

## Transformer Updates

File: `transform.helper.ts`

### Thay đổi chính:

1. **Single objects giữ nguyên object:**
```typescript
// Objects (không phải arrays)
spu_thumb: {
  image_id: "...",
  image_url: "..."
}

default_sku: {
  sku_id: "...",
  price: { original: 1000, sale: 900 }
}

price_range: {
  min: 1000,
  max: 2000
}
```

2. **Variants thành flattened fields:**
```typescript
// Trước
available_variants: {
  color: ["red", "blue"],
  storage: ["128gb"]
}

// Sau
variantFields = {
  variant_colors: ["red", "blue"],
  variant_storages: ["128gb"]
}
// Spread vào document root
return { ...variantFields, ... }
```

3. **Nested arrays cho variants_detail và attributes:**
```typescript
// Arrays of objects → nested type
variants_detail: [
  {
    variant_name: "Color",
    options: [...]  // nested trong nested
  }
]

attributes: [
  {
    attribute_name: "screen_size",
    attribute_value: "6.7 inch"
  }
]
```

## Migration Steps

### 1. Delete old index
```bash
DELETE /spu
# hoặc
DELETE /products
```

### 2. Restart service
Service sẽ tự động tạo index mới với mapping đúng

### 3. Re-sync data
```typescript
// Script sync lại toàn bộ products
const allSpus = await spuModel
  .find()
  .populate('spu_skus spu_variants spu_default_sku');

for (const spu of allSpus) {
  await elasticSearchService.spuElasticSearch.create(spu);
}
```

### 4. Test queries
Sử dụng các examples trong `README.md`

## Performance Impact

### ✅ Pros:
1. **Variants filter cực nhanh**: Flattened fields → simple term queries
2. **Price queries đơn giản**: Object type → không cần nested
3. **Sort đơn giản**: Direct field access
4. **Index size nhỏ**: Object types ít tốn memory hơn nested

### ⚠️ Cons:
1. **Variants_detail queries**: Nested queries phức tạp hơn (nhưng ít khi dùng)
2. **Attributes queries**: Cần nested query

## Lưu ý quan trọng

### 1. Accessing fields trong response
```typescript
// Objects (direct access)
const price = result.price_range.min;
const thumb = result.spu_thumb.image_url;
const skuPrice = result.default_sku.price.sale;

// Arrays (index access)
const firstVariant = result.variants_detail[0];
const firstAttribute = result.attributes[0];
```

### 2. Sort với object fields (đơn giản)
```json
{
  "sort": [
    { "price_range.min": { "order": "asc" } }
  ]
}
```

### 3. Aggregations với object (đơn giản)
```json
{
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price_range.min",
        "ranges": [...]
      }
    }
  }
}
```

### 4. Nested queries chỉ cho arrays
```json
// Chỉ cần cho variants_detail và attributes
{
  "nested": {
    "path": "variants_detail",
    "query": { ... }
  }
}
```

## Rollback Plan

Nếu cần rollback về object types:

1. Revert `index.ts` mapping
2. Revert `transform.helper.ts`
3. Delete index và recreate
4. Re-sync data

Backup files:
- Git commit trước khi migrate
- Export current mappings: `GET /products/_mapping`

## Testing Checklist

- [ ] Index được tạo thành công với mapping mới
- [ ] Sync 1 product thành công
- [ ] Query filter by variants hoạt động
- [ ] Query filter by price range hoạt động
- [ ] Sort by price hoạt động
- [ ] Aggregations hoạt động
- [ ] Search full-text hoạt động
- [ ] Response format đúng trong API

## Support

Nếu gặp vấn đề, check:
1. Elasticsearch logs
2. Application logs (console.log trong service)
3. Kibana Dev Tools để test queries trực tiếp
4. README.md cho query examples
