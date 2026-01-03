const http = require('http');

const USER_SERVICE_HOST = process.env.USER_SERVICE_HOST || 'aben.theokaitou.my.id';
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 80;

function validateUser(userId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: USER_SERVICE_HOST,
            port: USER_SERVICE_PORT,
            path: `/api/users/${userId}`,
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
            resolve(null);
        });

        req.end();
    });
}

module.exports = { validateUser };