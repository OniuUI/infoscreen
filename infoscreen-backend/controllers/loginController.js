const jwt = require('jsonwebtoken');
const userController = require('./userController');
const bcrypt = require('bcrypt');

// Function to generate new access token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
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
    const accessToken = generateAccessToken(user._id);
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const userIdent = user._id;


    // Update user with refreshToken
    user.refreshToken = refreshToken;
    await userController.updateUserById(user._id, user);

    res.send({
        accessToken,
        refreshToken,
        userIdent,
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
        const user = await userController.getUser(payload.userId);

        // Remove the refresh token
        user.refreshToken = null;
        await userController.updateUser(user);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ error: "Unable to logout user." });
    }
};
