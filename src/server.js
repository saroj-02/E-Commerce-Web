const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDb } = require('./database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// Serve Frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Initialize DB and Start Server
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 AURA E-Commerce Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
