# Trip Tracker API

<div align="center">

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## 📖 Overview

Trip Tracker API is a robust and feature-rich backend service that enables real-time trip monitoring and management. Built with Node.js and MongoDB, it provides a comprehensive solution for tracking journeys, monitoring traffic conditions, and managing user experiences.

### 🌟 Key Features

- **User Management**

  - Secure authentication and authorization
  - Profile management with vehicle preferences
  - Role-based access control

- **Trip Tracking**

  - Real-time location updates
  - Live traffic conditions monitoring
  - Weather updates along the route
  - Comprehensive trip history

- **Enhanced User Experience**
  - Trip notes and feedback system
  - Rating system for trips
  - Smart notification system
  - Customizable trip filters

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

### Installation

1. **Clone the Repository**

   ```bash
   git clone [repository-url]
   cd job_dufitumukiza-trip_tracker-uw
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Required
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Optional (with defaults)
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the Server**

   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Interactive Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Core Endpoints

#### 🚗 Trip Management

```plaintext
POST   /api/trips/start              # Start a new trip
PUT    /api/trips/:tripId/update     # Update trip conditions
POST   /api/trips/end                # End an ongoing trip
POST   /api/trips/:tripId/notes      # Add trip notes
GET    /api/trips/history/:userId    # Get trip history
GET    /api/trips/:tripId            # Get trip details
```

#### 👤 User Management

```plaintext
POST   /api/users/register           # Register new user
POST   /api/auth/login               # User login
GET    /api/users/profile            # Get user profile
PUT    /api/users/profile/:id        # Update profile
```

## 📊 Data Models

### Trip Model

```javascript
{
  userId: ObjectId,
  startLocation: {
    coordinates: [Number],
    address: String
  },
  endLocation: {
    coordinates: [Number],
    address: String
  },
  travelMode: String,        // car, motorcycle, bicycle
  status: String,           // ongoing, completed
  trafficConditions: Object,
  weatherConditions: Object,
  distance: Number,
  duration: Number,
  notes: String,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model

```javascript
{
  name: String,
  email: String,
  phoneNumber: String,
  password: String,         // hashed
  vehicleType: String,
  location: {
    coordinates: [Number],
    address: String
  },
  role: String,            // user, admin
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Error Handling

The API implements a standardized error response format:

```javascript
{
  status: Number,          // HTTP status code
  message: String,         // User-friendly message
  error: String|Object     // Detailed error information
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Best Practices

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Trip Tracker API

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
