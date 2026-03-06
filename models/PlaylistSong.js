const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.sql');

const PlaylistSong = sequelize.define('playlistSong', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    mongoSongId: {
        type: DataTypes.STRING, // Storing the MongoDB ObjectId as a string
        allowNull: false
    }
});

module.exports = PlaylistSong;