# Clima — Weather App

A responsive weather app built with React and Express. Search for a city to see its current weather, temperature, feels-like temperature, humidity, and wind speed.

## Features

- Search current weather by city name
- Support for both `Targu Mures` and `Târgu Mureș`
- Responsive dark interface with yellow accents
- Loading and error states
- Weather data provided by OpenWeather
- API key kept on the Express server instead of the browser

## Tech stack

- React 19
- Vite
- Express
- OpenWeather Current Weather API

## Project structure

This app uses two sibling projects:

```text
react-weather/
├── weather-react/       # React and Vite frontend (this project)
└── weather-api/         # Express API proxy
```

The frontend requests `/api/vremea/:city`. During local development, Vite forwards `/api` requests to the Express server at `http://localhost:4000`. The server then requests weather data from OpenWeather and returns only the fields used by the interface.

## Getting started

### 1. Configure the API server

In a terminal, open the `weather-api` directory:

```bash
cd ../weather-api
npm install
```

Create a `.env` file in `weather-api` and add your OpenWeather API key:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
```

Start the Express server:

```bash
node server.js
```

The API server runs at `http://localhost:4000` by default.

### 2. Start the frontend

In a second terminal, open this project's `weather-react` directory:

```bash
cd /path/to/react-weather/weather-react
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5175`). Keep both servers running while using the app.

## API endpoint

```http
GET /api/vremea/:city
```

Example response:

```json
{
  "oras": "London",
  "temperatura": 14,
  "senzatieTermica": 13,
  "descriere": "broken clouds",
  "iconaCod": "04d",
  "umiditate": 72,
  "vantKmH": 16
}
```

The endpoint returns metric units. The Express server handles the OpenWeather request so the API key is not included in frontend code.

## Available frontend scripts

Run these commands from `weather-react`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the frontend for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Configuration and deployment

The Vite proxy in `vite.config.js` is for local development. A production deployment also needs the Express API to be hosted and the frontend configured to send API requests to that hosted server. Store `OPENWEATHER_API_KEY` as a server-side environment variable; do not commit the `.env` file.
