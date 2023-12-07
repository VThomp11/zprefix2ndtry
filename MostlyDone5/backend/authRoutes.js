// authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const router = express.Router();
const secretKey = 'secretkeyelephant'; // Replace with a strong secret key

router.use(bodyParser.json());
router.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'store_table',
  password: 'docker',
  port: 5432,
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// User registration endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await hashPassword(password);

    // Insert user into the existing database
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    res.json({ message: 'Registration successful', user: result.rows[0] });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the existing database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);

    const user = result.rows[0];

    if (!user || !(await comparePasswords(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Function to hash the password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Function to compare passwords
const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = router;
