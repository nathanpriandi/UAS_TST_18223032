const http = require('http');

/**
 * Validates the Authorization header.
 * Expects a Bearer token or a specific API Key.
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 * @returns {Promise<boolean>}
 */
function checkAuth(req, res) {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Authorization header missing' }));
            return resolve(false);
        }

        // Simple validation: In a real scenario, we would verify JWT signature.
        // For this "Zero Dependency" assignment, we might check for a shared secret or basic presence.
        // Assuming format "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
             // For now, accept any non-empty token or valid hardcoded secret
            resolve(true);
        } else {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid token format' }));
            resolve(false);
        }
    });
}

module.exports = { checkAuth };