# ReWear API Endpoints Guide

This document provides a comprehensive guide to all the backend API endpoints available in the ReWear application. It's designed to help frontend developers understand how to interact with the backend.

## Base URL

All endpoints are prefixed with `/api`.

## Authentication

Authentication is handled via JWT tokens. For protected routes:
- Include the token in the Authorization header: `Authorization: Bearer <your_token>`

---

## 🔐 Authentication Endpoints

### Register User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Auth Required:** No
- **Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
- **Code:** 201 Created
- **Content:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "points": 0
  }
}
```

### Login User
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Description:** Login with existing credentials

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "points": 0
  }
}
```

### Get Current User
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get currently logged in user's profile

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "points": 0,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Logout User
- **URL:** `/api/auth/logout`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Logout the current user (client should remove the token)

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 👤 User Endpoints

### Get User Profile
- **URL:** `/api/users/profile`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get the logged-in user's profile

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "points": 0,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Update User Profile
- **URL:** `/api/users/profile`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Description:** Update the logged-in user's profile

**Request Body:**
```json
{
  "name": "John Updated",
  "password": "newpassword123"  // Optional
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Updated",
    "email": "john@example.com",
    "isAdmin": false,
    "points": 0,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Get User's Items
- **URL:** `/api/users/items`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get all items uploaded by the logged-in user

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Blue Jeans",
      "description": "Lightly worn blue jeans",
      "category": "Men",
      "type": "Bottoms",
      "size": "M",
      "condition": "Good",
      "tags": ["denim", "casual"],
      "images": ["uploads/1626345263443-jeans.jpg"],
      "uploader": "60d0fe4f5311236168a109ca",
      "isAvailable": true,
      "isApproved": true,
      "pointValue": 10,
      "createdAt": "2023-07-15T10:34:23.443Z"
    },
    // Additional items...
  ]
}
```

### Get User's Swap History
- **URL:** `/api/users/swaps`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get all swap requests made by the logged-in user

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "requester": "60d0fe4f5311236168a109ca",
      "item": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "Red T-Shirt",
        // Item details...
      },
      "status": "pending",
      "type": "swap",
      "offeredItem": {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Blue Jeans",
        // Item details...
      },
      "message": "I'd like to swap my jeans for your t-shirt",
      "createdAt": "2023-07-15T10:34:23.443Z"
    }
  ]
}
```

### Get Received Swap Requests
- **URL:** `/api/users/requests`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get all pending swap requests for items uploaded by the logged-in user

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "requester": {
        "_id": "60d0fe4f5311236168a109ce",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "item": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "Red T-Shirt",
        // Item details...
      },
      "status": "pending",
      "type": "swap",
      "offeredItem": {
        "_id": "60d0fe4f5311236168a109cf",
        "title": "Black Jacket",
        // Item details...
      },
      "message": "I'd like to swap my jacket for your t-shirt",
      "createdAt": "2023-07-15T10:34:23.443Z"
    }
  ]
}
```

---

## 👕 Item Endpoints

### Get All Items
- **URL:** `/api/items`
- **Method:** `GET`
- **Auth Required:** No
- **Description:** Get all approved items with pagination, filtering, and search

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (e.g., 'createdAt', '-createdAt' for descending)
- `category`: Filter by category
- `type`: Filter by type
- `size`: Filter by size
- `condition`: Filter by condition
- `search`: Search in title, description, and tags

**Example Request:**
```
GET /api/items?page=1&limit=10&category=Men&type=Tops&sort=-createdAt&search=denim
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    }
  },
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "title": "Blue Denim Jacket",
      "description": "Vintage denim jacket in excellent condition",
      "category": "Men",
      "type": "Tops",
      "size": "L",
      "condition": "Like new",
      "tags": ["denim", "jacket", "vintage"],
      "images": ["uploads/1626345263443-jacket.jpg"],
      "uploader": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe"
      },
      "isAvailable": true,
      "isApproved": true,
      "pointValue": 15,
      "createdAt": "2023-07-15T10:34:23.443Z"
    },
    // Additional items...
  ]
}
```

### Get Single Item
- **URL:** `/api/items/:id`
- **Method:** `GET`
- **Auth Required:** No
- **Description:** Get details of a specific item

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cd",
    "title": "Blue Denim Jacket",
    "description": "Vintage denim jacket in excellent condition",
    "category": "Men",
    "type": "Tops",
    "size": "L",
    "condition": "Like new",
    "tags": ["denim", "jacket", "vintage"],
    "images": ["uploads/1626345263443-jacket.jpg"],
    "uploader": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe"
    },
    "isAvailable": true,
    "isApproved": true,
    "pointValue": 15,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Create Item
- **URL:** `/api/items`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Create a new item listing

**Request Body:**
```json
{
  "title": "White Sneakers",
  "description": "Brand new white sneakers, never worn",
  "category": "Men",
  "type": "Footwear",
  "size": "10",
  "condition": "New with tags",
  "tags": ["shoes", "sneakers", "white"],
  "images": ["uploads/1626345263443-sneakers.jpg"],
  "pointValue": 20
}
```

**Success Response:**
- **Code:** 201 Created
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cg",
    "title": "White Sneakers",
    "description": "Brand new white sneakers, never worn",
    "category": "Men",
    "type": "Footwear",
    "size": "10",
    "condition": "New with tags",
    "tags": ["shoes", "sneakers", "white"],
    "images": ["uploads/1626345263443-sneakers.jpg"],
    "uploader": "60d0fe4f5311236168a109ca",
    "isAvailable": true,
    "isApproved": false,
    "pointValue": 20,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Update Item
- **URL:** `/api/items/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Description:** Update an existing item (user must be the uploader)

**Request Body:**
```json
{
  "title": "White Sneakers - Nike",
  "description": "Brand new white Nike sneakers, never worn",
  "condition": "Like new"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cg",
    "title": "White Sneakers - Nike",
    "description": "Brand new white Nike sneakers, never worn",
    "category": "Men",
    "type": "Footwear",
    "size": "10",
    "condition": "Like new",
    "tags": ["shoes", "sneakers", "white"],
    "images": ["uploads/1626345263443-sneakers.jpg"],
    "uploader": "60d0fe4f5311236168a109ca",
    "isAvailable": true,
    "isApproved": false,
    "pointValue": 20,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Delete Item
- **URL:** `/api/items/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Description:** Delete an item (user must be the uploader or an admin)

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 🔄 Swap Endpoints

### Create Swap Request
- **URL:** `/api/swaps`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Create a new swap request for an item

**Request Body for Direct Swap:**
```json
{
  "item": "60d0fe4f5311236168a109cd",
  "type": "swap",
  "offeredItem": "60d0fe4f5311236168a109cb",
  "message": "I'd like to swap my jeans for your jacket"
}
```

**Request Body for Points Redemption:**
```json
{
  "item": "60d0fe4f5311236168a109cd",
  "type": "points",
  "message": "I'd like to redeem this item using my points"
}
```

**Success Response:**
- **Code:** 201 Created
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ch",
    "requester": "60d0fe4f5311236168a109ca",
    "item": "60d0fe4f5311236168a109cd",
    "status": "pending",
    "type": "swap",
    "offeredItem": "60d0fe4f5311236168a109cb",
    "message": "I'd like to swap my jeans for your jacket",
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Get User's Swap Requests
- **URL:** `/api/swaps`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get all swap requests made by the logged-in user

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ch",
      "requester": "60d0fe4f5311236168a109ca",
      "item": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "Blue Denim Jacket",
        // Item details...
      },
      "status": "pending",
      "type": "swap",
      "offeredItem": {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Blue Jeans",
        // Item details...
      },
      "message": "I'd like to swap my jeans for your jacket",
      "createdAt": "2023-07-15T10:34:23.443Z"
    },
    // Additional swap requests...
  ]
}
```

### Get Single Swap Request
- **URL:** `/api/swaps/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Get details of a specific swap request (user must be the requester or item owner)

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ch",
    "requester": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "item": {
      "_id": "60d0fe4f5311236168a109cd",
      "title": "Blue Denim Jacket",
      // Item details...
    },
    "status": "pending",
    "type": "swap",
    "offeredItem": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Blue Jeans",
      // Item details...
    },
    "message": "I'd like to swap my jeans for your jacket",
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Update Swap Request Status
- **URL:** `/api/swaps/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Description:** Update the status of a swap request (user must be the item owner)

**Request Body:**
```json
{
  "status": "approved" // Options: "pending", "approved", "rejected", "completed"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ch",
    "requester": "60d0fe4f5311236168a109ca",
    "item": "60d0fe4f5311236168a109cd",
    "status": "approved",
    "type": "swap",
    "offeredItem": "60d0fe4f5311236168a109cb",
    "message": "I'd like to swap my jeans for your jacket",
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Cancel Swap Request
- **URL:** `/api/swaps/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Description:** Cancel a pending swap request (user must be the requester)

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 📁 File Upload Endpoints

### Upload Single Image
- **URL:** `/api/upload`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Upload a single image file
- **Content-Type:** `multipart/form-data`

**Request Body:**
```
Form field: image (file)
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "fileName": "1626345263443-jacket.jpg",
    "filePath": "/uploads/1626345263443-jacket.jpg"
  }
}
```

### Upload Multiple Images
- **URL:** `/api/upload/multiple`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Upload multiple image files (max 5)
- **Content-Type:** `multipart/form-data`

**Request Body:**
```
Form field: images (files)
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "fileName": "1626345263443-jacket.jpg",
      "filePath": "/uploads/1626345263443-jacket.jpg"
    },
    {
      "fileName": "1626345263444-jacket2.jpg",
      "filePath": "/uploads/1626345263444-jacket2.jpg"
    }
  ]
}
```

---

## 👑 Admin Endpoints

### Get All Users
- **URL:** `/api/admin/users`
- **Method:** `GET`
- **Auth Required:** Yes (Admin only)
- **Description:** Get a list of all users

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com",
      "isAdmin": false,
      "points": 10,
      "createdAt": "2023-07-15T10:34:23.443Z"
    },
    {
      "_id": "60d0fe4f5311236168a109ce",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "isAdmin": false,
      "points": 5,
      "createdAt": "2023-07-15T10:34:23.443Z"
    }
  ]
}
```

### Get Single User
- **URL:** `/api/admin/users/:id`
- **Method:** `GET`
- **Auth Required:** Yes (Admin only)
- **Description:** Get details of a specific user

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "points": 10,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Update User
- **URL:** `/api/admin/users/:id`
- **Method:** `PUT`
- **Auth Required:** Yes (Admin only)
- **Description:** Update a user's details

**Request Body:**
```json
{
  "name": "John Updated",
  "isAdmin": true,
  "points": 20
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Updated",
    "email": "john@example.com",
    "isAdmin": true,
    "points": 20,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Delete User
- **URL:** `/api/admin/users/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Admin only)
- **Description:** Delete a user (cannot delete admin users)

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {}
}
```

### Get Items Pending Approval
- **URL:** `/api/admin/items/pending`
- **Method:** `GET`
- **Auth Required:** Yes (Admin only)
- **Description:** Get all items pending approval

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cg",
      "title": "White Sneakers",
      "description": "Brand new white sneakers, never worn",
      "category": "Men",
      "type": "Footwear",
      "size": "10",
      "condition": "New with tags",
      "tags": ["shoes", "sneakers", "white"],
      "images": ["uploads/1626345263443-sneakers.jpg"],
      "uploader": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isAvailable": true,
      "isApproved": false,
      "pointValue": 20,
      "createdAt": "2023-07-15T10:34:23.443Z"
    }
  ]
}
```

### Approve/Reject Item
- **URL:** `/api/admin/items/:id`
- **Method:** `PUT`
- **Auth Required:** Yes (Admin only)
- **Description:** Approve or reject an item listing

**Request Body:**
```json
{
  "isApproved": true
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cg",
    "title": "White Sneakers",
    "description": "Brand new white sneakers, never worn",
    "category": "Men",
    "type": "Footwear",
    "size": "10",
    "condition": "New with tags",
    "tags": ["shoes", "sneakers", "white"],
    "images": ["uploads/1626345263443-sneakers.jpg"],
    "uploader": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "isAvailable": true,
    "isApproved": true,
    "pointValue": 20,
    "createdAt": "2023-07-15T10:34:23.443Z"
  }
}
```

### Get All Swap Requests
- **URL:** `/api/admin/swaps`
- **Method:** `GET`
- **Auth Required:** Yes (Admin only)
- **Description:** Get all swap requests in the system

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ch",
      "requester": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "item": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "Blue Denim Jacket"
        // Item details...
      },
      "status": "pending",
      "type": "swap",
      "offeredItem": {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Blue Jeans"
        // Item details...
      },
      "message": "I'd like to swap my jeans for your jacket",
      "createdAt": "2023-07-15T10:34:23.443Z"
    },
    // Additional swap requests...
  ]
}
```

### Get Dashboard Stats
- **URL:** `/api/admin/stats`
- **Method:** `GET`
- **Auth Required:** Yes (Admin only)
- **Description:** Get platform statistics for admin dashboard

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "users": 10,
    "items": {
      "total": 25,
      "pending": 5,
      "approved": 20,
      "available": 15
    },
    "swaps": {
      "total": 30,
      "pending": 10,
      "completed": 15
    }
  }
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

**Error Response:**
- **Content:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common Error Codes:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Not authorized to access the resource
- `404 Not Found` - Resource not found
- `500 Server Error` - Server-side error 