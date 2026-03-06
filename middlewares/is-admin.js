module.exports = (req, res, next) => {
    // We already know they are logged in if we run isAuth first
    if (!req.session.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden. Only admins can perform this action.' });
    }
    
    next();
};