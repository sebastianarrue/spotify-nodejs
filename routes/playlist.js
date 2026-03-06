const express = require('express');
const playlistController = require('../controllers/playlist');
const isAuth = require('../middlewares/is-auth'); // Import the middleware

const router = express.Router();

// Apply isAuth to protect these routes
// POST /playlists/create
router.post('/create', isAuth, playlistController.createPlaylist);

// GET /playlists
router.get('/', isAuth, playlistController.getPlaylists);

// POST /playlists/add-song
router.post('/add-song', isAuth, playlistController.addSongToPlaylist);

module.exports = router;