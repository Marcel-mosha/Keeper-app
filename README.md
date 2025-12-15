# Keeper App

A full-stack note-taking application inspired by Google Keep, built with React, Node.js, Express, and PostgreSQL. Features user authentication and CRUD operations for managing personal notes.

## Features

- 🔐 User authentication (Register/Login) with JWT tokens
- 📝 Create, read, update, and delete notes
- 🎨 Material-UI components for modern UI
- 🔒 Protected routes and secure API endpoints
- 💾 PostgreSQL database for persistent storage
- ⚡ Fast development with Vite

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
Keeper-app/
├── backend/
│   ├── server.js          # Express server with API routes
│   └── package.json       # Backend dependencies
└── my-app/
    ├── src/
    │   ├── index.jsx      # App entry point
    │   └── components/
    │       ├── app.jsx           # Main app component with routing
    │       ├── CreateArea.jsx    # Note creation component
    │       ├── Note.jsx          # Individual note component
    │       ├── header.jsx        # Header component
    │       ├── footer.jsx        # Footer component
    │       ├── Login.jsx         # Login form
    │       └── Register.jsx      # Registration form
    ├── public/
    │   └── styles.css     # Global styles
    └── package.json       # Frontend dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE keeper_db;
```

2. Create the required tables:
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MY_LOCAL_IP=localhost
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=keeper_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_secure_jwt_secret_key
```

4. Start the backend server:
```bash
node server.js
```

Or use nodemon for development:
```bash
nodemon server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` (or the port specified by Vite)

## API Endpoints

### Authentication
- `POST /register` - Register a new user
  - Body: `{ "username": "string", "password": "string" }`
  
- `POST /login` - Login user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "token": "jwt_token", "username": "string" }`

### Notes (Protected Routes)
All note endpoints require Authorization header: `Bearer <token>`

- `GET /notes` - Get all notes for the authenticated user
- `POST /notes` - Create a new note
  - Body: `{ "title": "string", "content": "string" }`
- `PATCH /notes/:id` - Update a specific note
  - Body: `{ "title": "string", "content": "string" }`
- `DELETE /notes/:id` - Delete a specific note

## Usage

1. **Register**: Create a new account with a unique username and password
2. **Login**: Sign in with your credentials to receive a JWT token
3. **Create Notes**: Add new notes with a title and content
4. **Edit Notes**: Update existing notes (feature requires implementation in frontend)
5. **Delete Notes**: Remove notes you no longer need
6. **Logout**: Clear your session and return to login screen

## Scripts

### Frontend (my-app)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
node server.js           # Start server
nodemon server.js        # Start with auto-reload
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Token expiration (1 hour)
- Protected API routes with token verification
- User-specific note access (users can only access their own notes)

## Environment Variables

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MY_LOCAL_IP | Server IP address | localhost |
| DB_USER | PostgreSQL username | postgres |
| DB_HOST | Database host | localhost |
| DB_NAME | Database name | keeper_db |
| DB_PASSWORD | Database password | yourpassword |
| DB_PORT | PostgreSQL port | 5432 |
| JWT_SECRET | Secret key for JWT | your_secret_key |

## Future Enhancements

- [ ] Note editing in the frontend
- [ ] Note categories/tags
- [ ] Color-coded notes
- [ ] Search functionality
- [ ] Note archiving
- [ ] Responsive mobile design improvements
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Note sharing between users

## Troubleshooting

### Backend issues:
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if the port is already in use

### Frontend issues:
- Clear browser cache and localStorage
- Verify API_URL in app.jsx matches backend URL
- Check browser console for errors

## License

ISC

## Author

Web Development Bootcamp Project

---

**Note**: This is a learning project created as part of a web development bootcamp.
