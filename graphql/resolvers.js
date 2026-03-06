const Song = require('../models/Song');

module.exports = {
    // Resolver for fetching a single song by its MongoDB ID
    getSong: async function({ id }) {
        const song = await Song.findById(id);
        if (!song) {
            const error = new Error('Song not found!');
            error.statusCode = 404;
            throw error;
        }
        // Return the song document, converting the Mongoose _id object to a string
        return { ...song._doc, _id: song._id.toString() };
    },
    
    // Resolver for searching songs by title (great for a frontend search bar)
    searchSongs: async function({ searchTerm }) {
        // If there's a search term, look for partial matches (case-insensitive). 
        // If no term, return an empty query object (fetches all).
        const query = searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {};
        
        // Limit to 10 results so we don't accidentally fetch thousands of songs
        const songs = await Song.find(query).limit(10);
        
        return songs.map(song => {
            return { ...song._doc, _id: song._id.toString() };
        });
    }
};