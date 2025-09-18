# MedChain Backend API

This is the backend API for the MedChain medical records management system.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
1. Install MySQL on your system
2. Create a new database called `medchain_db`
3. Copy `.env.example` to `.env` and update the database credentials

### 3. Environment Variables
Create a `.env` file with the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medchain_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Schema

The application will automatically create the following tables:

### users
- id (Primary Key)
- wallet_address (Unique)
- user_type (patient/doctor)
- full_name
- email (Unique)
- phone
- gender
- date_of_birth
- created_at
- updated_at

### patients
- id (Primary Key)
- user_id (Foreign Key)
- address
- blood_group
- medical_history
- medical_record_file

### doctors
- id (Primary Key)
- user_id (Foreign Key)
- medical_id (Unique)
- specialization
- qualification
- hospital_name

### medical_records
- id (Primary Key)
- patient_id (Foreign Key)
- doctor_id (Foreign Key)
- title
- content
- record_type
- file_path
- created_at

### access_logs
- id (Primary Key)
- user_id (Foreign Key)
- patient_id (Foreign Key)
- action
- timestamp

## API Endpoints

### POST /api/register
Register a new user (patient or doctor)

### POST /api/login
Authenticate user with wallet signature

### GET /api/profile/:userId
Get user profile information

## Features

- ✅ User registration for patients and doctors
- ✅ Wallet-based authentication
- ✅ MySQL database integration
- ✅ Proper data validation
- ✅ Transaction support for data integrity

- ✅ JWT token authentication
- ✅ Comprehensive database schema