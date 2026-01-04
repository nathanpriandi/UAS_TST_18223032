# Product Catalog Microservice (UAS TST)

Microservice untuk manajemen katalog produk E-commerce, dibangun dengan pendekatan **Zero Dependency** (Native Node.js) agar ringan dan efisien untuk lingkungan terbatas (Set-Top Box).

## Fitur Utama
- **Zero Dependency**: Native Node.js (`http`, `fs`, `path`) tanpa framework eksternal.
- **CRUD Operations**: Create, Read, Update, Delete untuk data produk.
- **Open Access**: Tidak ada validasi token atau integrasi eksternal (Standalone Mode).
- **Persistent Storage**: Database produk berbasis file JSON (`data/products.json`).

## Arsitektur
Layanan ini mengelola domain **Product Catalog** secara mandiri:
- **Entities**: Product
- **Attributes**: Title, Price, Description, Category, Image, Rating.
- **Repository**: File JSON Local

## Struktur Folder
```
.
├── server.js        # Entry point & Logic utama
├── Dockerfile       # Konfigurasi container
├── package.json     # Metadata proyek
└── data
    └── products.json # Database produk (Sample Data included)
```

## API Documentation

### 1. Health Check
- **URL**: `GET /`
- **Response**: `200 OK`

### 2. Get All Products
- **URL**: `GET /api/products`
- **Response**: `200 OK`
- **Body**: Array of Product objects.

### 3. Get Single Product
- **URL**: `GET /api/products/:id`
- **Response**: `200 OK` or `404 Not Found`

### 4. Add Product
- **URL**: `POST /api/products`
- **Body**:
  ```json
  {
    "title": "New Product",
    "price": 29.99,
    "description": "Description here",
    "category": "electronics",
    "image": "http://image.url"
  }
  ```
- **Response**: `201 Created`

### 5. Update Product
- **URL**: `PUT /api/products/:id`
- **Body**: JSON fields to update.
- **Response**: `200 OK`

### 6. Delete Product
- **URL**: `DELETE /api/products/:id`
- **Response**: `200 OK`

## Cara Menjalankan

### Lokal
```bash
node server.js
```
Server berjalan di port `3002`.

### Docker (Simulasi STB)
```bash
docker build -t product-service .
docker run -d -p 3002:3002 --memory="40m" --name product-svc product-service
```