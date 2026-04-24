# Student Management System

A full-stack web application for managing student records, tracking attendance, and monitoring academic performance.

## 🏗️ Tech Stack

### Frontend
- **React** (v19) - UI framework
- **Vite** (v8) - Build tool
- **Tailwind CSS** (v4) - Styling
- **React Router** (v7) - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** (v5) - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JSON Web Token** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

---

## Features

### Authentication
- Secure login system
- JWT-based authentication
- Role-based access control (Admin/Student)

### Student Management
- Add new students with details (name, email, course, year)
- Edit existing student information
- Delete students
- View individual student profiles

### Attendance Tracking
- Mark individual student attendance
- Bulk attendance marking for entire class
- Track attendance percentage per student
- Subject-wise attendance tracking

### Dashboard
- Visual analytics with charts
- Overview of student statistics
- Quick access to key features

---

##  Project Structure

```
student-management-system/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── AddStudent.jsx
│   │   │   ├── EditStudent.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── BulkAttendance.jsx
│   │   │   └── StudentProfile.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                    # Express backend
│   ├── config/
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   └── studentController.js
│   ├── middleware/            # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/                # Mongoose schemas
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd student-management-system
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

1. **Create server environment file**
   ```bash
   cd server
   ```
   Create a `.env` file with the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/studentdb
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev    # Development with nodemon
   # OR
   npm start     # Production
   ```

2. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

##  API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get current user |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students/:id/attendance` | Mark attendance |
| PUT | `/api/students/:id/attendance` | Bulk mark attendance |

---

##  Available Scripts

### Client
```bash
npm run dev      # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

### Server
```bash
npm start        # Start production server
npm run dev      # Start with nodemon
```

---

##  Dependencies

### Client
- react, react-dom
- react-router-dom
- axios
- recharts
- lucide-react
- tailwindcss

### Server
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

---

##  License

ISC License

---

##  Author

Created for educational purposes.

---

##  Code Changes

### Client
- Updated to support React Router v7
- Added support for Vite
- Updated Tailwind CSS to v4

### Server
- Updated to support Express v5
- Added support for MongoDB



Working URL - https://student-management-system-rq3z.vercel.app/
- Updated Mongoose to v6
