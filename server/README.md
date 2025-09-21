# ReWear Backend API

Backend API for the ReWear application, a platform for exchanging unused clothing.

## Setup

```bash
# Install dependencies (also creates uploads directory)
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rewear
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/items` - Get user's items
- `GET /api/users/swaps` - Get user's swap requests
- `GET /api/users/requests` - Get swap requests for user's items

### Items

- `GET /api/items` - Get all approved items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Swaps

- `GET /api/swaps` - Get all swap requests made by user
- `POST /api/swaps` - Create new swap request
- `GET /api/swaps/:id` - Get single swap request
- `PUT /api/swaps/:id` - Update swap request status
- `DELETE /api/swaps/:id` - Cancel swap request

### Admin

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/items/pending` - Get items pending approval
- `PUT /api/admin/items/:id` - Approve/reject item
- `GET /api/admin/swaps` - Get all swap requests
- `GET /api/admin/stats` - Get dashboard stats 