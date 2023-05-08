# Infoscreen Frontend

This frontend application is built with React and TypeScript. It displays users and events fetched from the Infoscreen backend.

## Installation

Before running the application, make sure you have Node.js and npm installed. If you don't have Node.js installed, download it from the [official website](https://nodejs.org/en/download/).

Next, install the required packages:

```bash
npm install
```

## Usage

To start the development server, run the following command in your terminal:

```bash
npm start
```

The application will start on port 3000 (or the port specified in the `PORT` environment variable). You can access the application at `http://localhost:3000`.

## Components

The application consists of the following components:

- `LeftSidebar`: Displays the list of users fetched from the backend.
- `Temperature`: Displays the current temperature and weather icon.
- `Event`: Displays the list of events fetched from the backend.
- `AdminForm`: Provides forms to add users and events to the backend.

## Customization

You can customize the application by editing the components and their styles. The styles are written in CSS and can be found in the respective component's `.tsx` file.

## Deployment

To build the application for production, run the following command:

```bash
npm run build
```

The build folder will contain the compiled files, which can be served using any web server.

## License

[MIT](https://choosealicense.com/licenses/mit/)