const Song = require('../models/Song');

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