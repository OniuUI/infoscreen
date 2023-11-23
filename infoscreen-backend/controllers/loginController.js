// backend
const jwt = require('jsonwebtoken');
const userController = require('./userController');
const bcrypt = require('bcrypt');

const ACCESS_TOKEN_EXPIRATION_TIME = 15 * 60; // 15 minutes in seconds

// Function to generate new access token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME + 's' });
};

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

    // Create tokens
    console.log("Authenticating")
    const accessToken = generateAccessToken(user._id);
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const userIdent = user._id;

    // Get the expiration time of the access token
    const accessTokenExpiration = Math.floor(Date.now() * 1000) + ACCESS_TOKEN_EXPIRATION_TIME;

    // Update user with refreshToken
    user.refreshToken = refreshToken;
    await userController.updateUserById(user._id, user);

    console.log("User authenticated")

    res.send({
        accessToken,
        refreshToken,
        userIdent,
        expiresIn: accessTokenExpiration // Now expiresIn represents the timestamp at which the access token will expire
    });
};

exports.refreshToken = async (req, res) => {
    const token  = req.body.token;

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await userController.getUserById(payload.userId);

        if (token !== user.refreshToken) {
            return res.sendStatus(403);
        }

        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken });
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(403);
        } else {
            console.log(err);
            return res.sendStatus(400);
        }
    }
};

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
