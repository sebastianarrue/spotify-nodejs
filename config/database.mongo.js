// config/database.mongo.js
const mongoose = require('mongoose');
require('dotenv').config();

// Function to establish MongoDB connection
const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Stop the server if the database fails to connect
    }
};

module.exports = mongoConnect;