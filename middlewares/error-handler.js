module.exports = (err, req, res, next) => {
    console.error('Global Error Caught:', err);

    const status = err.statusCode || 500;
    
    const message = err.message || 'An unexpected error occurred on the server.';

    res.status(status).json({
        error: true,
        message: message
    });
};