const express = require('express');
const songController = require('../controllers/song');
const isAuth = require('../middlewares/is-auth');
const isAdmin = require('../middlewares/is-admin');
const upload = require('../middlewares/upload');

const router = express.Router();

// GET /songs (Anyone authenticated can view songs)
// Use query params for pagination: /songs?page=1
router.get('/', isAuth, songController.getSongs);

// POST /songs/create 
// Chain: 1. Must be logged in -> 2. Must be admin -> 3. Parse file -> 4. Controller
router.post(
    '/create', 
    isAuth, 
    isAdmin, 
    upload.single('image'), // 'image' is the name of the field in the incoming form data
    songController.createSong
);

module.exports = router;