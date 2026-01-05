# Product Catalog Microservice (UAS TST)

Microservice manajemen katalog produk E-commerce yang dibangun dengan pendekatan **Zero Dependency** (Native Node.js). Layanan ini dirancang agar sangat ringan dan efisien untuk dijalankan di lingkungan terbatas seperti **Set-Top Box (STB)**.

## 🚀 Fitur Utama

- **Zero Dependency**: Menggunakan modul native Node.js (`http`, `fs`, `path`) tanpa framework eksternal (Express/NestJS) untuk meminimalisir overhead memori.
- **CRUD Lengkap**: Create, Read, Update, Delete untuk data produk.
- **Manajemen Stok Real-time**: Mendukung pengurangan stok saat pembelian dan penambahan stok (restock).
- **Sistem Kepemilikan (Ownership)**: Melacak kepemilikan produk pasca-pembelian tanpa duplikasi data (Single Instance Logic).
- **Persistent Storage**: Database berbasis file JSON (`data/products.json`) yang ringan dan portabel.

## 📂 Struktur Proyek

```
.
├── server.js        # Entry point & Logika Server Utama
├── Dockerfile       # Konfigurasi Containerisasi
├── package.json     # Metadata Proyek & Scripts
└── data
    └── products.json # Database Produk (JSON)
```

## 📦 Skema Data (Product Object)

Setiap produk memiliki struktur data sebagai berikut:

```json
{
  "id": "1704468291000",
  "title": "Kopi Bubuk Arabika",
  "price": 15.50,
  "description": "Kopi premium asli pegunungan.",
  "category": "food",
  "image": "https://placehold.co/400",
  "stock": 10,      
  "createdBy": "1",    
  "owners": {           
    "2": 1,
    "3": 5
  },
  "rating": {
    "rate": 0,
    "count": 0
  }
}
```

## 🔌 Dokumentasi API

Base URL: `http://localhost:3002`

### 1. Health Check
- **URL**: `GET /`
- **Response**: `200 OK`
- **Body**: Status layanan dan uptime.

### 2. Get All Products
- **URL**: `GET /api/products`
- **Response**: `200 OK`
- **Body**: Array dari objek Product.

### 3. Get Single Product
- **URL**: `GET /api/products/:id`
- **Response**: `200 OK` atau `404 Not Found`

### 4. Create Product
- **URL**: `POST /api/products`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Produk Baru",
    "price": 50.00,
    "description": "Deskripsi produk...",
    "category": "electronics",
    "stock": 20,
    "createdBy": "1"
  }
  ```
- **Response**: `201 Created`

### 5. Update Product (Stock & Ownership)
Digunakan untuk update info produk, pengurangan stok (pembelian), atau restock.
- **URL**: `PUT /api/products/:id`
- **Body** (Contoh Pembelian):
  ```json
  {
    "stock": 9,
    "owners": {
      "2": 1
    }
  }
  ```
- **Response**: `200 OK`

### 6. Delete Product
- **URL**: `DELETE /api/products/:id`
- **Response**: `200 OK`

## 🛠️ Cara Menjalankan

### Persyaratan Sistem
- Node.js v14+ (untuk lokal)
- Docker (opsional, untuk simulasi STB)

### 1. Menjalankan secara Lokal
```bash
# Install dependencies (hanya dev dependencies, runtime zero dependency)
npm install

# Jalankan server
node server.js
```
Server akan berjalan di port `3002`.

### 2. Menjalankan Frontend (Next.js)
Frontend terletak di folder `frontend/`.
```bash
cd frontend
npm install
npm run dev
```
Akses di `http://localhost:3000`.

### 3. Menjalankan dengan Docker
Cocok untuk deployment di STB atau server produksi.
```bash
# Build image
docker build -t product-service .

# Jalankan container (Limit memori 40MB untuk simulasi STB)
docker run -d -p 3002:3002 --memory="40m" --name product-svc product-service
```

## 📝 Catatan Pengembang
- **Concurrency**: Karena menggunakan file JSON lokal, layanan ini tidak dirancang untuk high-concurrency write operation (ratusan request per detik). Cocok untuk skala kecil/menengah.
- **Security**: Mode standalone ini tidak memiliki autentikasi built-in. Validasi user dilakukan di sisi client/frontend (simulasi).
