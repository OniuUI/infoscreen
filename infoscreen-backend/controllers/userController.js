const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, "../data/users.json");

exports.getAllUsers = (req, res) => {
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read user data." });
        }

        const users = JSON.parse(data);
        res.send(users);
    });
};

exports.addUser = (req, res) => {
    const newUser = req.body;

    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read user data." });
        }

        const usersData = JSON.parse(data);
        usersData.users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(usersData), (err) => {
            if (err) {
                return res.status(500).send({ error: "Unable to save user data." });
            }
            res.send({ success: true });
        });
    });
};

exports.updateUser = (req, res) => {
    const updatedUser = req.body;
    const userId = req.params.id;

    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read user data." });
        }

        const usersData = JSON.parse(data);
        const userIndex = usersData.users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Update the user's data
        usersData.users[userIndex] = updatedUser;

        fs.writeFile(usersFilePath, JSON.stringify(usersData), (err) => {
            if (err) {
                return res.status(500).send({ error: "Unable to save user data." });
            }
            res.send({ success: true });
        });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read user data." });
        }

        const usersData = JSON.parse(data);
        const userIndex = usersData.users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Remove the user from the array
        usersData.users.splice(userIndex, 1);

        fs.writeFile(usersFilePath, JSON.stringify(usersData), (err) => {
            if (err) {
                return res.status(500).send({ error: "Unable to save user data." });
            }
            res.send({ success: true });
        });
    });
};

exports.updateDrinks = (req, res) => {
    const userId = parseInt(req.params.userId);
    const { coffees, sodas } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Unable to read user data.' });
        }

        const usersData = JSON.parse(data);
        const user = usersData.users.find(user => user.id === userId);

        if (user) {
            user.coffees = coffees;
            user.sodas = sodas;

            fs.writeFile(usersFilePath, JSON.stringify(usersData), (err) => {
                if (err) {
                    return res.status(500).send({ error: 'Unable to save user data.' });
                }
                res.send({ success: true });
            });
        } else {
            res.status(404).send({ error: 'User not found.' });
        }
    });
};

exports.updateCoffeeSoda = (req, res) => {
    const userId = req.params.id;
    const { coffee, soda } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Unable to read user data.' });
        }

        const usersData = JSON.parse(data);
        const userIndex = usersData.users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).send({ error: 'User not found.' });
        }

        usersData.users[userIndex].coffee = coffee;
        usersData.users[userIndex].soda = soda;

        fs.writeFile(usersFilePath, JSON.stringify(usersData), (err) => {
            if (err) {
                return res.status(500).send({ error: 'Unable to save user data.' });
            }
            res.send({ success: true });
        });
    });
};

