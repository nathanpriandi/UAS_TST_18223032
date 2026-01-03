const http = require('http');

function checkAuth(req, res) {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Authorization header missing' }));
            return resolve(false);
        }

        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            resolve(true);
        } else {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid token format' }));
            resolve(false);
        }
    });
}

module.exports = { checkAuth };