# Angular Frontend - Users Management

This is the Angular frontend application for the Users Management system.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Setup

1. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

**Important:** Make sure your NestJS backend is running on `http://localhost:3000` before using the frontend.

## Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.ts          # Main component
│   │   ├── app.html        # Main template
│   │   ├── app.css         # Component styles
│   │   └── services/
│   │       └── users.ts    # Users API service
│   ├── index.html          # Entry HTML file
│   ├── main.ts             # Application bootstrap
│   └── styles.css          # Global styles
├── angular.json            # Angular configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## Features

- **Show Users**: Displays a list of all users in a table
- **Create User**: Modal form to create new users with:
  - First Name
  - Last Name
  - Date of Birth
  - Username
  - Password

## API Integration

The frontend communicates with the NestJS backend API at `http://localhost:3000/users`:
- `GET /users/list` - Fetch all users
- `POST /users/create` - Create a new user

## Technologies Used

- Angular 21
- TypeScript
- RxJS
- Angular Forms (for form handling)
- Angular HttpClient (for API calls)
