# ReWear

ReWear is a platform where users can exchange unused clothing via direct swaps or a point-based system.

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Node.js/Express API

## Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (also creates uploads directory)
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Run in development mode
npm run dev

# Create admin user
npm run create-admin
```

## Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Features

- User authentication (signup/login)
- Item listings with images
- Direct swapping of items
- Point-based redemption system
- Admin panel for approval and management
- User dashboard

## Technologies Used

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
