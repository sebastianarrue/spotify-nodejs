const Playlist = require('../models/Playlist');
const PlaylistSong = require('../models/PlaylistSong');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ message: 'Failed to create playlist.' });
    }
};

// Get all playlists for the logged-in user
exports.getPlaylists = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        const playlists = await Playlist.findAll({ where: { userId: userId } });
        
        res.status(200).json({ playlists: playlists });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch playlists.' });
    }
};

// Add a song to a playlist (The Bridge between MySQL and MongoDB)
exports.addSongToPlaylist = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ message: 'Failed to add song.' });
    }
};