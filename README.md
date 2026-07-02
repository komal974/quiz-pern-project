# 🚀 Quix – Quiz Management System

A full-stack **Quiz Management System** built using the **PERN Stack (PostgreSQL, Express.js, React.js, Node.js)**. Quix provides a secure platform for administrators to create and manage quizzes while allowing users to participate in quizzes, view results, and track their performance.

---

## 📌 Features

### 👨‍💼 Admin

* Secure Admin Login
* Create, Update, and Delete Quizzes
* Add, Edit, and Delete Questions
* Manage Quiz Content
* View User Quiz Results

### 👨‍🎓 User

* User Registration & Login
* JWT Authentication
* View Available Quizzes
* Attempt Quizzes
* Automatic Score Calculation
* View Quiz History
* View Detailed Results
* User Profile

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* React Hot Toast

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JSON Web Token (JWT)
* bcrypt

---

## 📂 Project Structure

```
Quix
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── utils
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🗄️ Database Schema

### Users

* id
* name
* email
* password
* role
* created_at

### Quizzes

* id
* title
* description
* duration
* created_by
* created_at

### Questions

* id
* quiz_id
* question
* option1
* option2
* option3
* option4
* correct_answer

### Attempts

* id
* user_id
* quiz_id
* score
* total_questions
* submitted_at

### Answers

* id
* attempt_id
* question_id
* selected_answer
* is_correct

---

## 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-Based Authorization (Admin/User)

---

## 📡 REST API Endpoints

### Authentication

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register User      |
| POST   | `/api/auth/login`    | Login User         |
| GET    | `/api/auth/profile`  | Get Logged-in User |

### Quiz

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/api/quizzes`     | Create Quiz (Admin) |
| GET    | `/api/quizzes`     | Get All Quizzes     |
| GET    | `/api/quizzes/:id` | Get Quiz by ID      |
| PUT    | `/api/quizzes/:id` | Update Quiz (Admin) |
| DELETE | `/api/quizzes/:id` | Delete Quiz (Admin) |

### Questions

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| POST   | `/api/questions`              | Create Question       |
| GET    | `/api/questions/quiz/:quizId` | Get Questions by Quiz |
| PUT    | `/api/questions/:id`          | Update Question       |
| DELETE | `/api/questions/:id`          | Delete Question       |

### Results

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/results/submit`     | Submit Quiz        |
| GET    | `/api/results`            | Get User Results   |
| GET    | `/api/results/:attemptId` | Get Result Details |

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quix-pern.git
```

### 2. Navigate to the Project

```bash
cd quix-pern
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=quix

JWT_SECRET=your_secret_key
```

### 6. Start Backend

```bash
cd server
npm run dev
```

### 7. Start Frontend

```bash
cd client
npm run dev
```

---

## 📷 Screenshots

Add screenshots after completing the frontend.

* Login Page
* Register Page
* Admin Dashboard
* Quiz List
* Create Quiz
* Take Quiz
* Result Page

---

## 🚀 Future Enhancements

* Timer-Based Quizzes
* Leaderboard
* Quiz Categories
* Search & Filter
* Pagination
* Email Verification
* Password Reset
* Certificate Generation
* Dashboard Analytics
* Responsive UI Improvements

---

## 💡 Skills Demonstrated

* Full-Stack Development
* REST API Design
* JWT Authentication
* Role-Based Authorization
* PostgreSQL Database Design
* CRUD Operations
* Express.js
* React.js
* Node.js
* Error Handling
* API Integration

---

## 👩‍💻 Author

**Komal Aadhude**

* B.Tech in Computer Science & Engineering
* Java Full Stack Developer
* PERN Stack Developer

---

## 📄 License

This project is created for learning, portfolio, and demonstration purposes.
