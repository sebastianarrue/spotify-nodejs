// config/database.sql.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance to connect to MySQL
const sequelize = new Sequelize(
    process.env.SQL_DATABASE,
    process.env.SQL_USER,
    process.env.SQL_PASSWORD,
    {
        host: process.env.SQL_HOST,
        dialect: 'mysql', // Specify the database engine
        logging: false    // Set to console.log to see SQL queries in the terminal
    }
);

module.exports = sequelize;