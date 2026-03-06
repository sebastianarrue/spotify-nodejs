const Playlist = require('../models/Playlist');
const PlaylistSong = require('../models/PlaylistSong');

// Create a new playlist
exports.createPlaylist = async (req, res, next) => {
    const { name, description } = req.body;

    try {
        // We get the user ID from the session!
        const userId = req.session.user.id;

        const newPlaylist = await Playlist.create({
            name: name,
            description: description,
            userId: userId // This establishes the relationship to the User
        });

        res.status(201).json({ message: 'Playlist created!', playlist: newPlaylist });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Get all playlists for the logged-in user
exports.getPlaylists = async (req, res, next) => {
    try {
        const userId = req.session.user.id;

        const playlists = await Playlist.findAll({ where: { userId: userId } });

        res.status(200).json({ playlists: playlists });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Add a song to a playlist (The Bridge between MySQL and MongoDB)
exports.addSongToPlaylist = async (req, res, next) => {
    const { playlistId, mongoSongId } = req.body;

    try {
        // First, verify the playlist belongs to the logged-in user
        const playlist = await Playlist.findOne({
            where: { id: playlistId, userId: req.session.user.id }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or unauthorized.' });
        }

        // Save the relationship in our bridge table
        const addedSong = await PlaylistSong.create({
            playlistId: playlist.id,
            mongoSongId: mongoSongId // Storing the MongoDB string ID
        });

        res.status(201).json({ message: 'Song added to playlist!', addedSong });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Edit Playlist Information
exports.editPlaylist = async (req, res, next) => {
    const { name, description } = req.body;
    const playlistId = req.params.id; // Get ID from the URL

    try {
        // Find playlist and ensure it belongs to the logged-in user
        const playlist = await Playlist.findOne({
            where: { id: playlistId, userId: req.session.user.id }
        });

        if (!playlist) return res.status(404).json({ message: 'Playlist not found or unauthorized.' });

        playlist.name = name || playlist.name;
        playlist.description = description || playlist.description;
        await playlist.save();

        res.status(200).json({ message: 'Playlist updated!', playlist });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Remove a song from a playlist
exports.removeSongFromPlaylist = async (req, res, next) => {
    const { playlistId, mongoSongId } = req.body;

    try {
        // First, verify the playlist belongs to the user
        const playlist = await Playlist.findOne({
            where: { id: playlistId, userId: req.session.user.id }
        });

        if (!playlist) return res.status(404).json({ message: 'Playlist not found or unauthorized.' });

        // Delete the bridge record
        await PlaylistSong.destroy({
            where: { playlistId: playlist.id, mongoSongId: mongoSongId }
        });

        res.status(200).json({ message: 'Song removed from playlist.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Delete a Playlist entirely
exports.deletePlaylist = async (req, res, next) => {
    const playlistId = req.params.id;

    try {
        const deletedCount = await Playlist.destroy({
            where: { id: playlistId, userId: req.session.user.id }
        });

        if (deletedCount === 0) return res.status(404).json({ message: 'Playlist not found or unauthorized.' });

        res.status(200).json({ message: 'Playlist deleted successfully.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};