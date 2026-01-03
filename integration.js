const http = require('http');

// Configuration for User Management Service
// Assuming it runs on localhost:3000 or defined by env
const USER_SERVICE_HOST = process.env.USER_SERVICE_HOST || 'localhost';
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 3000;

/**
 * Validates user existence via User Management Service
 * @param {string} userId 
 * @returns {Promise<Object|null>} User object if valid, null otherwise
 */
function validateUser(userId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: USER_SERVICE_HOST,
            port: USER_SERVICE_PORT,
            path: `/api/users/${userId}`, // Adjust endpoint based on User Service contract
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const user = JSON.parse(data);
                        resolve(user);
                    } catch (e) {
                        console.error('Failed to parse user data', e);
                        resolve(null);
                    }
                } else {
                    console.log(`User validation failed for ${userId}: ${res.statusCode}`);
                    resolve(null);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request to User Service: ${e.message}`);
            // In a real circuit breaker pattern, we might handle this differently.
            // For now, fail safe.
            resolve(null);
        });

        req.end();
    });
}

module.exports = { validateUser };