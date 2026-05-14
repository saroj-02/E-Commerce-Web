const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET_KEY } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;
    const ADMIN_SECRET = 'Saroj@Admin';
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = adminKey === ADMIN_SECRET;
    
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isAdmin: isAdmin
    });
    await user.save();

    res.status(201).json({ id: user._id, name, email, isAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;
    const ADMIN_SECRET = 'Saroj@Admin';
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Upgrade to admin if correct key provided during login
    if (adminKey === ADMIN_SECRET && !user.isAdmin) {
        user.isAdmin = true;
        await user.save();
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      createdAt: user.createdAt,
      isAdmin: user.isAdmin,
      wishlist: user.wishlist || [] 
    } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
