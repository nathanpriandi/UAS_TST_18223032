const http = require('http');
const fs = require('fs');
const path = require('path');
const { checkAuth } = require('./auth');
const { validateUser } = require('./integration');

const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// Helper to read data
function getProducts() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("Error reading products:", err);
        return [];
    }
}

// Helper to save data
function saveProducts(products) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // Health Check
    if (url.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Product Service Ready', uptime: process.uptime() }));
        return;
    }

    // GET /api/products
    if (url.pathname === '/api/products' && req.method === 'GET') {
        const products = getProducts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
        return;
    }

    // GET /api/products/:id
    const idMatch = url.pathname.match(/^\/api\/products\/([a-zA-Z0-9-]+)$/);
    if (idMatch && req.method === 'GET') {
        const id = idMatch[1];
        const products = getProducts();
        const product = products.find(p => String(p.id) === id);

        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
        }
        return;
    }

    // POST /api/products (Create Product)
    if (url.pathname === '/api/products' && req.method === 'POST') {
        const authorized = await checkAuth(req, res);
        if (!authorized) return;

        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                // userId is expected for auditing/permission check via integration
                const { userId, title, price, description, category, image } = data;

                if (!userId || !title || !price) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields: userId, title, price' }));
                    return;
                }

                // Integration: Validate User (Seller/Admin)
                const user = await validateUser(userId);
                if (!user) {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid User ID. Only verified users can add products.' }));
                    return;
                }

                const products = getProducts();
                const newProduct = {
                    id: Date.now().toString(),
                    title,
                    price,
                    description: description || '',
                    category: category || 'general',
                    image: image || '',
                    rating: { rate: 0, count: 0 },
                    createdBy: user.name || userId
                };

                products.push(newProduct);
                saveProducts(products);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newProduct));
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
        return;
    }

    // PUT /api/products/:id (Update Product)
    if (idMatch && req.method === 'PUT') {
        const authorized = await checkAuth(req, res);
        if (!authorized) return;

        const id = idMatch[1];
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { userId, ...updates } = data;

                if (!userId) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required field: userId' }));
                    return;
                }

                const user = await validateUser(userId);
                if (!user) {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid User ID.' }));
                    return;
                }

                const products = getProducts();
                const index = products.findIndex(p => String(p.id) === id);

                if (index !== -1) {
                    // Update fields
                    products[index] = { ...products[index], ...updates };
                    saveProducts(products);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(products[index]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Product not found' }));
                }
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
        return;
    }

    // DELETE /api/products/:id
    if (idMatch && req.method === 'DELETE') {
        const authorized = await checkAuth(req, res);
        if (!authorized) return;

        const id = idMatch[1];
        // For delete, we might expect userId in headers or body, but standard DELETE usually doesn't have body.
        // For simplicity in this demo, we'll assume the bearer token is enough, 
        // OR we can require a custom header like 'X-User-ID' for this logic if body isn't an option.
        // Let's assume strict checking isn't possible without body parsing or sophisticated JWT, 
        // so we'll rely on checkAuth (Bearer token presence) for now.

        const products = getProducts();
        const filteredProducts = products.filter(p => String(p.id) !== id);

        if (products.length !== filteredProducts.length) {
            saveProducts(filteredProducts);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product deleted' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
        }
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});