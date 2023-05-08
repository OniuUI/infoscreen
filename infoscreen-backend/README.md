# Infoscreen Backend

This backend serves the user and event data for the Infoscreen frontend application. It is built using Node.js, Express, and CORS for cross-origin resource sharing.

## Installation

Before running the server, make sure you have Node.js installed. If you don't have Node.js installed, download it from the [official website](https://nodejs.org/en/download/).

Next, install the required packages:

```bash
npm install
```

## Usage

To start the server, run the following command in your terminal:

```bash
node index.js
```

The server will start on port 3001 (or the port specified in the `PORT` environment variable). You can access the server at `http://localhost:3001`.

The server provides the following endpoints:

- `GET /users`: Fetches the list of users from the `users.json` file.
- `POST /users`: Adds a new user to the `users.json` file.
- `GET /events`: Fetches the list of events from the `events.json` file.
- `POST /events`: Adds a new event to the `events.json` file.

## API

### Users

#### Get all users

```http
GET /users
```

Response:

```json
{
    "users": [
    {
        "firstName": "John",
        "lastName": "Doe",
        "birthdate": "1990-05-07",
        "imageUrl": "https://example.com/john-doe.jpg"
    },
    {
        "firstName": "Jane",
        "lastName": "Smith",
        "birthdate": "1985-11-20",
        "imageUrl": "https://example.com/jane-smith.jpg"
    }
    ]
}
```

#### Add a new user

```http
POST /users
Content-Type: application/json
```

Request body:

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "birthdate": "1990-05-07",
    "imageUrl": "https://example.com/john-doe.jpg"
}
```

Response:

```json
{
    "success": true
}
```

### Events

#### Get all events

```http
GET /events
```

Response:

```json
{
    "events": [
    {
        "eventName": "Conference",
        "eventDate": "2023-05-20"
    },
    {
        "eventName": "Birthday party",
        "eventDate": "2023-06-10"
    }
    ]
}
```

#### Add a new event

```http
POST /events
Content-Type: application/json
```

Request body:

```json
{
    "eventName": "Conference",
    "eventDate": "2023-05-20"
}
```

Response:

```json
{
    "success": true
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)