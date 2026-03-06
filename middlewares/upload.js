const multer = require('multer');
const path = require('path');

// Configure where and how the file is saved
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Save to this local folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Filter to only accept image files
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;