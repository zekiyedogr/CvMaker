# CvMaker Web Application

CvMaker Web is a web-based application that allows users to manage their professional profiles and create customizable CVs.

## Technologies

- React 19
- TypeScript
- Vite 8
- React Router DOM
- Axios
- Lucide React
- React Icons
- HTML2Canvas
- HTML-to-Image

## Features

- User authentication
- Profile management
- Education and work experience management
- Skills and project information management
- CV creation and management
- Backend API integration
- CV preview and image export support

## Prerequisites

- Node.js
- npm

## Installation

### 1. Navigate to the Web Directory

```bash
cd web
```

### 2. Install Dependencies

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Checks TypeScript and builds the application |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Previews the production build |

## Production Build

To create a production build, run:

```bash
npm run build
```

The generated files will be placed in the `dist` directory.

## Backend Connection

The web application communicates with the CvMaker backend API using Axios.

Make sure the backend server is running and the API connection settings are configured correctly.