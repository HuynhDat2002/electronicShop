# Giới thiệu

👉 **Đây là một dự án bán hàng xây dựng dựa theo kiến trúc Microservices bao gồm Catalog (quản lý sản phầm), Order (Quản lý đặt hàng), Payment (Quản lý thanh toán), User (Quản lý user), Proxy (Reverse Proxy) và Frontend (Giao diện).**

👉 **Các services kết nối với nhau bằng Axios và Kafka.**


# Cách build và run hệ thống

👉 **Cài đặt npm packages**
```bash
npm install
```

👉 **Chạy hệ thống trong môi trường dev**
```bash
npm run dev
```

👉 **Truy cập catalog**
```bash
http://localhost:9001
```

👉 **Truy cập order**
```bash
http://localhost:9002
```
👉 **Truy cập user**
```bash
http://localhost:9000
```

👉 **Truy cập payment**
```bash
http://localhost:9001
```

👉 **Cách build**
```bash
npm run build
```

sudo docker compose -f docker-compose.dev.yml up
sudo docker logs electronicshop-catalog-electronic-1