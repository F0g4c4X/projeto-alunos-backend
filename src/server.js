const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const config = require('./config/database').development;

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// Sync database
sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Database sync error:', err));

// Routes
const alunosRoutes = require('./routes/alunos');
app.use('/api/alunos', alunosRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 