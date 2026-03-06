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

// PUT /playlists/edit/:id
router.put('/edit/:id', isAuth, playlistController.editPlaylist);

// DELETE /playlists/remove-song
router.delete('/remove-song', isAuth, playlistController.removeSongFromPlaylist);

// DELETE /playlists/delete/:id
router.delete('/delete/:id', isAuth, playlistController.deletePlaylist);

module.exports = router;