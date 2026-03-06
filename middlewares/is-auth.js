module.exports = (req, res, next) => {
    // Check if our session variable exists
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ message: 'Not authenticated. Please log in first.' });
    }
    
    // If they are logged in, call next() to continue to the controller
    next();
};