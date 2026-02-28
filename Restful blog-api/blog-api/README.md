# 📝 Blog API

A RESTful Blog API built with Node.js, Express, and MongoDB. This API provides complete CRUD operations for managing blog posts with proper validation, error handling, and clean code architecture.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Example Requests](#example-requests)
- [Error Handling](#error-handling)
- [Technologies Used](#technologies-used)

## ✨ Features

- **RESTful API Design** - Clean and intuitive API endpoints
- **MongoDB Integration** - Persistent data storage with Mongoose ODM
- **Input Validation** - Comprehensive validation for all fields
- **Error Handling** - Meaningful error messages and proper HTTP status codes
- **Pagination** - Efficient data retrieval with pagination support
- **Search Functionality** - Search posts by title, content, or author
- **Request Logging** - Built-in logging for all API requests
- **CORS Enabled** - Ready for frontend integration
- **Environment Configuration** - Secure configuration using environment variables

## 📁 Project Structure

```
blog-api/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   └── postController.js  # Business logic for post operations
├── models/
│   └── Post.js            # Mongoose schema and model for posts
├── routes/
│   └── postRoutes.js      # API route definitions
├── .env                   # Environment variables
├── server.js              # Application entry point
├── seed.js                # Database seeding script
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## 🔧 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- **MongoDB** (v4.0 or higher) - Local installation or MongoDB Atlas account

## 📥 Installation

1. **Clone the repository or navigate to the project directory:**
   ```bash
   cd blog-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory (or modify the existing one):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/blog-api
   ```

4. **Start MongoDB:**
   Make sure your MongoDB server is running. If using a local installation:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

## 🚀 Running the Project

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

### Seed Sample Data:
Populate the database with 3 sample blog posts:
```bash
npm run seed
```

**Seed Output:**
```
🔗 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing posts...
✅ Existing posts cleared

📝 Inserting sample posts...
✅ 3 posts created successfully!

📋 Created Posts:
============================================================

1. Getting Started with Node.js
   Author: Sarah Johnson
   ID: 65a5b8c12345678901234567
   Content Preview: Node.js is a powerful JavaScript runtime built on Chrome's V8 engine...

2. Understanding RESTful API Design
   Author: Michael Chen
   ID: 65a5b8c12345678901234568
   Content Preview: REST (Representational State Transfer) is an architectural style...

3. MongoDB Best Practices
   Author: Emily Davis
   ID: 65a5b8c12345678901234569
   Content Preview: MongoDB is a popular NoSQL database that offers flexibility...

============================================================

🎉 Database seeding completed!
```

### Expected Output:
```
========================================
   🚀 Blog API Server Started
========================================
   Port: 5000
   Environment: development
   Base URL: http://localhost:5000
   API Docs: http://localhost:5000/api
========================================

✅ MongoDB Connected Successfully
   Host: localhost
   Database: blog-api
```

## 🛣️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | API information and available endpoints |
| GET | `/health` | Server health check |
| GET | `/api/posts` | Get all blog posts (with pagination) |
| GET | `/api/posts/:id` | Get a single blog post by ID |
| POST | `/api/posts` | Create a new blog post |
| PUT | `/api/posts/:id` | Update an existing blog post |
| DELETE | `/api/posts/:id` | Delete a blog post |

### Query Parameters for GET /api/posts

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10) |
| `author` | String | Filter posts by author name |
| `search` | String | Search in title and content |

## 📝 Example Requests

### 1. Create a New Post

**Request:**
```http
POST /api/posts
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It contains interesting information about web development and best practices for building RESTful APIs.",
  "author": "John Doe"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "author": "John Doe"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "author": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "id": "65a5b8c12345678901234567"
  }
}
```

### 2. Get All Posts

**Request:**
```http
GET /api/posts
```

**cURL:**
```bash
curl http://localhost:5000/api/posts
```

**With Pagination:**
```bash
curl "http://localhost:5000/api/posts?page=1&limit=5"
```

**With Search:**
```bash
curl "http://localhost:5000/api/posts?search=javascript"
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "total": 15,
  "page": 1,
  "pages": 2,
  "data": [
    {
      "title": "Understanding JavaScript Async/Await",
      "content": "Async/await is a modern way to handle asynchronous operations...",
      "author": "Jane Smith",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "id": "65a5b8c12345678901234568"
    },
    {
      "title": "My First Blog Post",
      "content": "This is the content of my first blog post.",
      "author": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "id": "65a5b8c12345678901234567"
    }
  ]
}
```

### 3. Get a Single Post

**Request:**
```http
GET /api/posts/65a5b8c12345678901234567
```

**cURL:**
```bash
curl http://localhost:5000/api/posts/65a5b8c12345678901234567
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "author": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "id": "65a5b8c12345678901234567"
  }
}
```

### 4. Update a Post

**Request:**
```http
PUT /api/posts/65a5b8c12345678901234567
Content-Type: application/json

{
  "title": "My Updated Blog Post",
  "content": "This is the updated content of my blog post."
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/posts/65a5b8c12345678901234567 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Updated Blog Post",
    "content": "This is the updated content of my blog post."
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "title": "My Updated Blog Post",
    "content": "This is the updated content of my blog post.",
    "author": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "id": "65a5b8c12345678901234567"
  }
}
```

### 5. Delete a Post

**Request:**
```http
DELETE /api/posts/65a5b8c12345678901234567
```

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/posts/65a5b8c12345678901234567
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {}
}
```

## ⚠️ Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 3 characters long",
    "Content is required"
  ]
}
```

### 400 Bad Request - Invalid ID
```json
{
  "success": false,
  "message": "Invalid post ID format"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Post not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error while fetching posts"
}
```

## 🔒 Data Validation

### Post Schema Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | String | Yes | 3-100 characters, trimmed |
| `content` | String | Yes | Minimum 10 characters, trimmed |
| `author` | String | Yes | 2-50 characters, trimmed |
| `createdAt` | Date | Auto | Default: current timestamp |

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **dotenv** - Environment variable management
- **nodemon** - Development tool for auto-restarting the server

## 📜 License

This project is licensed under the MIT License.

## 👤 Author

Created as a demonstration of building RESTful APIs with Node.js, Express, and MongoDB.
