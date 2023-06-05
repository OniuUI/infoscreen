const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // No token in the request
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Token is not valid
            return res.sendStatus(403);
        }

        // Token is valid, store user information for other routes to use
        req.user = user;
        next();
    });
};

module.exports = verifyAccessToken;
