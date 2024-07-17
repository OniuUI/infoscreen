// backend
const roleController = require('../controllers/accessController');

const jwt = require('jsonwebtoken');
const userController = require('./userController');
const bcrypt = require('bcrypt');

const ACCESS_TOKEN_EXPIRATION_TIME = 15 * 60; // 15 minutes in seconds

// Function to generate new access token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME + 's' });
};

/**
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Login
 *     description: Authenticates a user and returns access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       401:
 *         description: Invalid email or password.
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate user
    const user = await userController.getUserByEmail(email);

    if (!user) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Fetch the role of the user
    const role = await roleController.getRoleByUserId(user._id);
    //console.log('Role:', role);

    // Create tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const userIdent = user._id;

    // Get the expiration time of the access token
    const accessTokenExpiration = Math.floor(Date.now() * 1000) + ACCESS_TOKEN_EXPIRATION_TIME;

    // Update user with refreshToken
    user.refreshToken = refreshToken;
    await userController.updateUserById(user._id, user);

    res.send({
        accessToken,
        refreshToken,
        userIdent,
        role, // Include the role in the response
        expiresIn: accessTokenExpiration
    });
};

/**
 * @openapi
 * /api/refresh-token:
 *   post:
 *     tags:
 *       - Login
 *     description: Refreshes an access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       400:
 *         description: Bad request.
 */
exports.refreshToken = async (req, res) => {
    const token = req.body.token;

    // Check if the token is null, undefined, or an empty string
    if (!token || token.trim() === '') {
        console.log('No token provided or token is empty');
        return res.sendStatus(401);
    }

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await userController.getUserById(payload.userId);

        if (token !== user.refreshToken) {
            console.log('Token does not match user\'s refresh token');
            return res.sendStatus(403);
        }

        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken });
    } catch (err) {
        console.log('Error in refreshToken function:', err.message);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(403);
        } else {
            return res.sendStatus(400);
        }
    }
};

/**
 * @openapi
 * /api/logout:
 *   post:
 *     tags:
 *       - Login
 *     description: Logs out a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       204:
 *         description: Logout successful.
 *       500:
 *         description: Unable to logout user.
 */
exports.logout = async (req, res) => {
    try {
        // Get user from token
        const token = req.body.token;
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await userController.getUserById(payload.userId);

        // Remove the refresh token
        user.refreshToken = null;
        await userController.updateUserById(user._id, user);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ error: "Unable to logout user." });
    }
};
