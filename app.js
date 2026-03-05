// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Import Database connections
const sequelize = require('./config/database.sql');
const mongoConnect = require('./config/database.mongo');

const app = express();

// 1. Middleware: Parse JSON bodies (Rest API standard)
app.use(express.json());
// Middleware: Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
// Middleware: Serve static files (for our locally uploaded images later)
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// 2. Manual CORS Headers (As per your course)
app.use((req, res, next) => {
    // Allow your React frontend origin
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
    // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    // Allow specific headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Allow cookies/sessions to be sent cross-origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 3. Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } // Enable this only if using HTTPS later
}));

// 4. Placeholders for Routes (We will create these soon!)
// app.use('/auth', authRoutes);
// app.use('/playlists', playlistRoutes);
// app.use('/songs', songRoutes);
// app.use('/graphql', graphqlHTTP({...}));

// 5. Initialize Databases and Start Server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoConnect();
        
        // Connect to MySQL and sync models (creates tables if they don't exist)
        await sequelize.sync(); 
        console.log('MySQL connected and models synced!');

        // Start listening for requests
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();