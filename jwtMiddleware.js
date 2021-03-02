const jwt = require('jsonwebtoken');
const accessTokenSecret = 'myaccesstokensecret';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader;

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                const err = new Error('Token expired!');
                err.status = 403;
                throw err;
            }

            req.user = user;
            next();
        });
    } else {
        const err = new Error('Unauthorized');
        err.status = 401;
        throw err;
    }
};
module.exports = { authenticateJWT }