# Exam Nest Backend Service

Exam Nest is a backend service built with Node.js, Express, and MongoDB, designed to manage exam and question papers files, AI-powered answer generation, user authentication, and school management for educational platforms.

## 🚀 Features

- **User Authentication**: Register and login for staff and students, JWT-based authentication, and role management.
- **School Management**: Register, edit, and manage schools, including unique code generation for staff and students.
- **File Management**: Upload, process, and retrieve exam files (PDF/DOCX), with support for questions and answers.
- **AI Integration**: Generate answers from uploaded files using Google Generative AI.
- **Subject & Summary Management**: Manage subjects and summaries for exams.
- **Secure API**: Uses environment variables, cookie-based authentication, and secure password hashing.

## Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Multer (file uploads)
- JWT (jsonwebtoken)
- Google Generative AI
- PDFKit, pdf-parse, mammoth (file processing)
- bcryptjs (password hashing)
- dotenv, cookie-parser, cors

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd exam_nest_backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   ```env
   PORT=40003. Create a `.env` file in the root directory and add the following:

   MONGODB_URI=<your-mongodb-uri>
   ACCESS_TOKEN_SECRET_KEY=<your-secret-key>
   GOOGLE_API_KEY=<your-google-api-key>
   ```

### Running the Server
```sh
npm run dev
```
The server will start on `http://localhost:4000` (or your specified port).

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` — Register a new school
  - **Body:**
    ```json
    {
      "name": "School Name",
      "province": "Province Name",
      "district": "District Name",
      "sector": "Sector Name"
    }
    ```
  - **Success Response:**
    ```json
    {
      "msg": "New School registered succesfully",
      "data": {
        "name": "Rin Academy",
        "province": "Northern",
        "district": "gakenke",
        "sector": "gakenke",
        "staffCode": "UK39TC",
        "studentCode": "65E8VK",
        "allowed": true,
        "_id": "688c73b9ed4e1289e7b6",
        "createdAt": "2025-08-01T07:58:49.951Z",
        "updatedAt": "2025-08-01T07:58:49.951Z"
      }
    }
    ```
  - **Fail Response:**
    ```json
    {
      "msg": "Please fill the required credentials"
    }
    ```

- `POST /api/auth/user-register` — Register a staff or student
  - **Body:**
    ```json
    {
      "name": "User Name",
      "email": "user@email.com",
      "code": "SCHOOLCODE",
      "password": "password123",
      "cPassword": "password123"
    }
    ```
  - **Success Response:**
    ```json
    {
      "msg": "Account created succesfully"
    }
    ```
  - **Fail Response:**
    ```json
    {
      "msg": "the code provided those not match any school please contact the school admin for the valid school code"
    }
    ```

- `POST /api/auth/login` — Login
  - **Body:**
    ```json
    {
      "email": "user@email.com",
      "password": "password123"
    }
    ```
  - **Success Response:**
    ```json
    {
      "msg": "User Logged In succesfully"
    }
    ```
  - **Fail Response:**
    ```json
    {
      "msg": "please provide the required credentials"
    }
    ```

- `POST /api/auth/logout` — Logout
  - **Success Response:**
    ```json
    {
      "msg": "User Logged out successfully",
      "error": false,
      "success": true
    }
    ```

### Files
- `POST /api/files/upload` — Upload a file (PDF/DOCX)
  - **Body:** `multipart/form-data` with field `file`
  - **Success Response:**
    ```json
    {
      "message": "File uploaded and processed successfully",
      "file": { /* file object */ }
    }
    ```
  - **Fail Response:**
    ```json
    {
      "error": "No file uploaded"
    }
    ```

- `GET /api/files/` — List all files
  - **Success Response:**
    ```json
    [ { /* file object */ }, ... ]
    ```

- `GET /api/files/:id` — Get file by ID
  - **Success Response:**
    ```json
    { /* file object */ }
    ```
  - **Fail Response:**
    ```json
    {
      "error": "File not found"
    }
    ```

- `POST /api/files/upload-questions` — Upload questions and answers files
  - **Body:** `multipart/form-data` with fields `questions` (required), `answers` (optional)
  - **Success Response:**
    ```json
    {
      "message": "Files uploaded successfully",
      "questionFile": { /* file object */ },
      "answerFile": { /* answer file object or null */ }
    }
    ```
  - **Fail Response:**
    ```json
    {
      "error": "Questions file is required"
    }
    ```

- **File Object Variables:**
    - `_id`: File unique identifier
    - `filename`: Stored filename
    - `originalName`: Original uploaded filename
    - `mimeType`: File MIME type
    - `size`: File size in bytes
    - `content`: Extracted file content (text)
    - `schoolId`: Associated school ID
    - `uploadDate`: Date of upload
    - `createdAt`: Creation timestamp
    - `updatedAt`: Last update timestamp
    - `__v`: Mongoose version key

### AI
- `POST /api/ai/process/:fileId` — Generate answers for a file (requires authentication)
  - **Body:** _none_
  - **Success Response:**
    ```json
    {
      "answers": ["Answer 1", "Answer 2", ...]
    }
    ```
  - **Fail Response:**
    ```json
    {
      "error": "File not found or processing error"
    }
    ```

### Subjects & Summaries
- `GET/POST /api/subjects` — Manage subjects
  - **POST Body:**
    ```json
    {
      "name": "Mathematics"
    }
    ```
  - **Success Response:**
    ```json
    {
      "msg": "Subject created successfully",
      "subject": { /* subject object */ }
    }
    ```

- `GET/POST /api/summary` — Manage summaries
  - **POST Body:**
    ```json
    {
      "title": "Summary Title",
      "content": "Summary content"
    }
    ```
  - **Success Response:**
    ```json
    {
      "msg": "Summary created successfully",
      "summary": { /* summary object */ }
    }
    ```

## Folder Structure

```
exam_nest_backend/
├── config/           # Database connection
├── controllers/      # Route controllers
├── middleware/       # Authentication middleware
├── models/           # Mongoose models
├── routes/           # Express route definitions
├── utils/            # Utility functions (code generators, tokens, etc.)
├── uploads/          # Uploaded files
├── index.js          # Entry point
├── package.json      # Project metadata
└── README.md         # This file
```

## Environment Variables
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `ACCESS_TOKEN_SECRET_KEY`: JWT secret
- `GOOGLE_API_KEY`: Google Generative AI API key

## 👥 Author
- **Rwema Isingizwe Norbert**
- GitHub: (https://github.com/RWEMAISINGIZWENorbert)


**For any questions or contributions, please open an issue or submit a pull request.**
