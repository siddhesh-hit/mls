const mongoose = require('mongoose');

const imageSchema = require("./imageSchema");


const librarySchema = new mongoose.Schema({
    marathi: {
        description: {
            type: String,
            required: true
        }
    },
    english: {
        description: {
            type: String,
            required: true
        }
    },
    banner: imageSchema
});

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;