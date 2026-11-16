# CvMaker Backend

CvMaker is a backend service for a CV Maker application. It allows users to manage their profiles, store personal and professional information, create customizable CVs, and generate CV documents in PDF format.

## Technologies

- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework
- **Microsoft SQL Server** – Relational database
- **MSSQL** – SQL Server database connectivity
- **JWT** – User authentication
- **bcrypt** – Password hashing
- **Multer** – File upload handling
- **Puppeteer** – PDF generation

## Features

- User registration and login
- JWT-based authentication
- Profile creation and management
- Education and work experience management
- Skills, projects, certifications, and language management
- CV creation and management
- PDF generation
- Protected API endpoints

## Prerequisites

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- ODBC Driver 18 for SQL Server

## Installation

### 1. Clone the Repository

```bash
git clone <https://github.com/zekiyedogr/CvMaker>
```

### 2. Navigate to the Backend Directory

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend root directory.

Add the following variables:

```env
DB_SERVER=localhost
DB_NAME=CvMakerDB
DB_USER=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=1d
```

Replace the database credentials and JWT secret with your own values.

### 5. Database Setup

- Open SQL Server Management Studio.
- Create a database named `CvMakerDB`.
- Execute the database schema SQL script to create the required tables.
- Make sure the database connection settings match your `.env` configuration.

## Running the Application

Start the development server:

```bash
npm run dev
```

Or start the application normally:

```bash
npm start
```

The backend server runs on:

```text
http://localhost:3000
```

## Available API Modules

The backend includes the following modules:

- Authentication
- Profiles
- CV Management
- PDF Generation

## Project Structure

```text
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── .env
├── package.json
└── package-lock.json
```

*Note: The project structure above represents the main application layers. Your actual folder structure may contain additional files and directories.*

## Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Sensitive configuration values are stored in environment variables.
- The `.env` file should never be committed to the GitHub repository.

## License

This project was developed as part of a backend development training project.