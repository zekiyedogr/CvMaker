# CvMaker Mobile Application

CvMaker Mobile is a React Native application that allows users to manage their professional profiles and create customizable CVs from their mobile devices.

## Technologies

- React Native 0.88.1
- React 19.3.0
- JavaScript / TypeScript
- React Navigation 7
- Axios
- AsyncStorage
- React Native Vector Icons
- React Native Image Picker

## Features

- User registration and login
- Profile management
- Education and work experience management
- Skills and project information management
- CV creation and management
- Backend API integration
- Mobile navigation with React Navigation

## Prerequisites

- Node.js >= 22.11.0
- npm
- Android Studio and Android SDK (for Android development)
- Xcode (for iOS development on macOS)

## Installation

### 1. Navigate to the Mobile Directory

```bash
cd mobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Metro

```bash
npm start
```

### 4. Run on Android

Open an Android emulator or connect an Android device, then run:

```bash
npm run android
```

### 5. Run on iOS

On macOS with Xcode installed, run:

```bash
npm run ios
```

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Starts the Metro development server |
| `npm run android` | Runs the application on Android |
| `npm run ios` | Runs the application on iOS |
| `npm run lint` | Runs ESLint |
| `npm test` | Runs Jest tests |

## Backend Connection

The mobile application communicates with the CvMaker backend API to handle authentication, profile information, and CV-related operations.

Make sure the backend server is running and the API connection settings are configured correctly.