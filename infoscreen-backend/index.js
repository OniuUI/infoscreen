const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { removePastEvents } = require('./utils');

const app = express();
app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, "users.json");
const eventsFilePath = path.join(__dirname, "events.json");

removePastEvents();

// Get all users
app.get("/users", (req, res) => {
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Unable to read user data." });
    }

    const users = JSON.parse(data);
    res.send(users);
  });
});

// Add a new user
app.post("/users", (req, res) => {
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
});

// Get all events
app.get("/events", (req, res) => {
  fs.readFile(eventsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Unable to read event data." });
    }

    const events = JSON.parse(data);
    res.send(events);
  });
});

// Update coffees and sodas count for a user
app.put('/users/:userId/drinks', (req, res) => {
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
});

// Update coffee and soda values for a user
app.put('/users/:id/coffee-soda', (req, res) => {
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
});

// Add a new event
app.post("/events", (req, res) => {
  const newEvent = req.body;

  fs.readFile(eventsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Unable to read event data." });
    }

    const eventsData = JSON.parse(data);
    eventsData.events.push(newEvent);

    fs.writeFile(eventsFilePath, JSON.stringify(eventsData), (err) => {
      if (err) {
        return res.status(500).send({ error: "Unable to save event data." });
      }
      res.send({ success: true });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});