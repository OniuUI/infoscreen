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
    removePastEvents();
    
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
