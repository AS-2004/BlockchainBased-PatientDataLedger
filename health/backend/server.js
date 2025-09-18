const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'medchain_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Initialize Database Tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        user_type ENUM('patient', 'doctor') NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        gender ENUM('male', 'female', 'other'),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_wallet (wallet_address),
        INDEX idx_email (email)
      )
    `);

    // Create patients table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        address TEXT,
        blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        medical_history TEXT,
        medical_record_file VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create doctors table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        medical_id VARCHAR(255) UNIQUE NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        qualification VARCHAR(255) NOT NULL,
        hospital_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_medical_id (medical_id)
      )
    `);

    // Create medical_records table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        record_type VARCHAR(100),
        file_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
      )
    `);

    // Create access_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        patient_id INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      )
    `);

    // Create patient_doctor_access table for permissions
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS patient_doctor_access (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        access_granted BOOLEAN DEFAULT FALSE,
        granted_at TIMESTAMP NULL,
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        UNIQUE KEY unique_patient_doctor (patient_id, doctor_id)
      )
    `);

    connection.release();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Utility function to log access
async function logAccess(userId, patientId, action, details = null) {
  try {
    await pool.execute(
      'INSERT INTO access_logs (user_id, patient_id, action, details) VALUES (?, ?, ?, ?)',
      [userId, patientId, action, details]
    );
  } catch (error) {
    console.error('Error logging access:', error);
  }
}

// Routes

// Register endpoint
app.post('/api/register/patient', upload.single('medicalRecord'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const file = req.file;
    const {
      walletAddress, fullName, email, phone,
      gender, dateOfBirth, address,
      bloodGroup, medicalHistory
    } = req.body;

    if (!walletAddress || !fullName || !email) {
      return res.status(400).json({ error: 'Missing required patient fields' });
    }

    const [exists] = await conn.execute(
      'SELECT id FROM users WHERE wallet_address = ? OR email = ?',
      [walletAddress, email]
    );
    if (exists.length) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const [userRes] = await conn.execute(
      `INSERT INTO users
       (wallet_address, user_type, full_name, email, phone, gender, date_of_birth)
       VALUES (?, 'patient', ?, ?, ?, ?, ?)`,
      [walletAddress, fullName, email, phone || null, gender || null, dateOfBirth || null]
    );
    const userId = userRes.insertId;

    const filename = req.file ? req.file.filename : null;
    await conn.execute(
      `INSERT INTO patients
       (user_id, address, blood_group, medical_history, medical_record_file)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, address || null, bloodGroup || null, medicalHistory || null, filename]
    );

    await conn.commit();

    const token = jwt.sign(
      { userId, userType: 'patient', walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Patient registered',
      token,
      user: { id: userId, userType: 'patient', fullName, email, walletAddress }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Patient registration error:', err);
    res.status(err.code === 'ER_DUP_ENTRY' ? 400 : 500).json({ error: 'Registration failed' });
  } finally {
    conn.release();
  }
});
app.post('/api/register/doctor', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      walletAddress, fullName, email, phone,
      gender, dateOfBirth, medicalId,
      specialization, qualification, hospitalName
    } = req.body;

    if (!walletAddress || !fullName || !email || !medicalId) {
      return res.status(400).json({ error: 'Missing required doctor fields' });
    }

    const [existsU] = await conn.execute(
      'SELECT id FROM users WHERE wallet_address = ? OR email = ?',
      [walletAddress, email]
    );
    const [existsD] = await conn.execute(
      'SELECT id FROM doctors WHERE medical_id = ?',
      [medicalId]
    );
    if (existsU.length || existsD.length) {
      return res.status(400).json({ error: 'User or medical ID already exists' });
    }

    const [userRes] = await conn.execute(
      `INSERT INTO users
       (wallet_address, user_type, full_name, email, phone, gender, date_of_birth)
       VALUES (?, 'doctor', ?, ?, ?, ?, ?)`,
      [walletAddress, fullName, email, phone || null, gender || null, dateOfBirth || null]
    );
    const userId = userRes.insertId;

    await conn.execute(
      `INSERT INTO doctors
       (user_id, medical_id, specialization, qualification, hospital_name)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, medicalId, specialization, qualification, hospitalName]
    );

    await conn.commit();

    const token = jwt.sign(
      { userId, userType: 'doctor', walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Doctor registered',
      token,
      user: { id: userId, userType: 'doctor', fullName, email, walletAddress }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Doctor registration error:', err);
    res.status(err.code === 'ER_DUP_ENTRY' ? 400 : 500).json({ error: 'Registration failed' });
  } finally {
    conn.release();
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Verify signature here (implement signature verification logic)
    // For now, we'll just check if user exists

    const [users] = await pool.execute(
      'SELECT id, user_type, full_name, email FROM users WHERE wallet_address = ?',
      [walletAddress]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const user = users[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type, walletAddress: walletAddress },
      process.env.JWT_SECRET || 'medchain-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        userType: user.user_type,
        fullName: user.full_name,
        email: user.email,
        walletAddress: walletAddress
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get user profile endpoint
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await pool.execute(
      `SELECT u.*, 
              CASE 
                WHEN u.user_type = 'patient' THEN JSON_OBJECT(
                  'address', p.address,
                  'bloodGroup', p.blood_group,
                  'medicalHistory', p.medical_history,
                  'medicalRecordFile', p.medical_record_file
                )
                WHEN u.user_type = 'doctor' THEN JSON_OBJECT(
                  'medicalId', d.medical_id,
                  'specialization', d.specialization,
                  'qualification', d.qualification,
                  'hospitalName', d.hospital_name
                )
              END as additional_info
       FROM users u
       LEFT JOIN patients p ON u.id = p.user_id
       LEFT JOIN doctors d ON u.id = d.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    if (user.additional_info) {
      user.additional_info = JSON.parse(user.additional_info);
    }

    res.json(user);

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all patients (for doctors)
app.get('/api/patients', async (req, res) => {
  try {
    const [patients] = await pool.execute(`
      SELECT u.id, u.full_name, u.email, u.phone, u.gender, u.date_of_birth,
             p.address, p.blood_group, p.medical_history,
             u.created_at
      FROM users u
      JOIN patients p ON u.id = p.user_id
      WHERE u.user_type = 'patient'
      ORDER BY u.created_at DESC
    `);

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get all doctors (for patients)
app.get('/api/doctors', async (req, res) => {
  try {
    const [doctors] = await pool.execute(`
      SELECT u.id, u.full_name, u.email, u.phone,
             d.medical_id, d.specialization, d.qualification, d.hospital_name,
             u.created_at
      FROM users u
      JOIN doctors d ON u.id = d.user_id
      WHERE u.user_type = 'doctor'
      ORDER BY u.created_at DESC
    `);

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MedChain API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 MedChain API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  await initializeDatabase();
});

module.exports = app;