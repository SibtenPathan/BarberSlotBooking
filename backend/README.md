# Barber Slot Booking - Backend API

Node.js Express REST API server for the Barber Slot Booking application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/barber-booking
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/barber-booking

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS
CORS_ORIGIN=http://localhost:8081,exp://localhost:8081
```

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start with nodemon for development
- `npm test` - Run tests with Jest

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Shops
- `GET /api/shops` - Get all barber shops
- `GET /api/shops/:id` - Get shop details
- `POST /api/shops` - Create new shop (admin)
- `PUT /api/shops/:id` - Update shop (admin)
- `DELETE /api/shops/:id` - Delete shop (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Process payment

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── models/
│   └── users.model.js     # Database models
├── routes/                # API routes
├── controllers/           # Route controllers
├── middleware/            # Custom middleware
├── utils/                 # Utility functions
├── server.js             # Application entry point
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables (create this)
```

## Database Models

### User Model
- email, password, name, phone
- role (user/admin/barber)
- profile image, preferences

### Shop Model
- name, description, address
- images, services, pricing
- opening hours, ratings

### Booking Model
- user, shop, barber
- date, time, service
- status, payment info

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js for security headers
- CORS configuration
- Input validation
- MongoDB injection prevention

## Real-time Features

Socket.io is integrated for:
- Live chat between users and barbers
- Real-time booking notifications
- Status updates

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Success responses:

```json
{
  "success": true,
  "data": { }
}
```

## Deployment

### Environment Variables
Ensure all environment variables are set in your hosting platform.

### Database
Make sure MongoDB is accessible from your hosting environment.

### Build
```bash
npm install --production
npm start
```

## Troubleshooting

- **Cannot connect to MongoDB**: Check your MongoDB URI and ensure the database server is running
- **Port already in use**: Change the PORT in `.env`
- **JWT errors**: Verify JWT_SECRET is set in `.env`

## License

MIT
