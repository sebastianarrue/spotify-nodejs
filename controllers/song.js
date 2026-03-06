const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const PlaylistSong = require('../models/PlaylistSong');

// Helper function to delete local files
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', 'public', 'images', filePath);
    fs.unlink(filePath, err => { if (err) console.log(err); });
};

exports.createSong = async (req, res) => {
    // Multer attaches the text fields to req.body and the file to req.file
    const { title, album, author } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(422).json({ message: 'Attached file is not a supported image.' });
    }

    try {
        const imageUrl = image.filename; // We just store the filename

        const song = new Song({
            title: title,
            album: album,
            author: author,
            imageUrl: imageUrl
        });

        const savedSong = await song.save(); // Save to MongoDB!
        res.status(201).json({ message: 'Song created successfully!', song: savedSong });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create song.' });
    }
};

// Get songs with Pagination!
exports.getSongs = async (req, res) => {
    // Extract page from query parameters (e.g., /songs?page=2)
    const currentPage = req.query.page || 1; 
    const perPage = 5; // Number of songs per page

    try {
        // Count total items for frontend math (total pages)
        const totalItems = await Song.find().countDocuments();
        
        // Fetch the specific chunk of songs
        const songs = await Song.find()
            .skip((currentPage - 1) * perPage) // Skip items from previous pages
            .limit(perPage);                   // Limit to 'perPage' items
        
        res.status(200).json({ 
            message: 'Fetched songs successfully.', 
            songs: songs,
            totalItems: totalItems,
            currentPage: Number(currentPage),
            hasNextPage: perPage * currentPage < totalItems,
            hasPreviousPage: currentPage > 1
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch songs.' });
    }
};

// Edit Song
exports.editSong = async (req, res) => {
    const songId = req.params.id;
    const { title, album, author } = req.body;
    const image = req.file; // Might be undefined if they didn't upload a new one

    try {
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: 'Song not found.' });

        song.title = title || song.title;
        song.album = album || song.album;
        song.author = author || song.author;

        // If a new image was uploaded, delete the old one and save the new path
        if (image) {
            clearImage(song.imageUrl);
            song.imageUrl = image.filename;
        }

        const updatedSong = await song.save();
        res.status(200).json({ message: 'Song updated!', song: updatedSong });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update song.' });
    }
};

// Delete Song
exports.deleteSong = async (req, res) => {
    const songId = req.params.id;

    try {
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: 'Song not found.' });

        // 1. Delete the image file from the server
        clearImage(song.imageUrl);

        // 2. Delete the song from MongoDB
        await Song.findByIdAndDelete(songId);

        // 3. CROSS-DATABASE CLEANUP: Delete all references to this song in MySQL playlists!
        await PlaylistSong.destroy({ where: { mongoSongId: songId } });

        res.status(200).json({ message: 'Song and all playlist references deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete song.' });
    }
};