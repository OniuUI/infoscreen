# Project Summary: Infoscreen

Infoscreen is a web application built with React and TypeScript on the frontend and Node.js on the backend. It displays a list of users, events, and the current temperature with a weather icon. The application features an admin page that allows adding users and events.

## Features

- Display user list fetched from the backend
- Display event list fetched from the backend
- Show current temperature and weather icon
- Admin page for adding users and events
- Automatically remove past events from the event list

## Technologies

- Frontend: React, TypeScript, and CSS
- Backend: Node.js with Express
- APIs: OpenWeatherMap and MetaWeather

## Components

### Frontend

- `LeftSidebar`: Displays the list of users fetched from the backend.
- `Temperature`: Displays the current temperature and weather icon.
- `Event`: Displays the list of events fetched from the backend.
- `AdminForm`: Provides forms to add users and events to the backend.

### Backend

- `users`: Handles routes for getting and adding users.
- `events`: Handles routes for getting and adding events.
- `removePastEvents`: Utility function that automatically removes past events.

## Installation & Usage

### Frontend

1. Install Node.js and npm.
2. Install the required packages: `npm install`.
3. Start the development server: `npm start`.

### Backend

1. Install Node.js and npm.
2. Install the required packages: `npm install`.
3. Start the server: `node index.js` or `npm start`.

## Customization

The frontend components and styles can be customized by editing the respective `.tsx` and `.css` files. The backend routes and utility functions can be modified in the `index.js` file.

## Deployment

To deploy the frontend, run `npm run build` to create a production build. Serve the compiled files using any web server. To deploy the backend, use a process manager like PM2 or a platform like Heroku.

## License

[MIT](https://choosealicense.com/licenses/mit/)