const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true,
    },
    keywords: {
        type: [String],
        required: [true, 'Keywords are required.'],
        trim: true,
    },
    url: {
        type: String,
        required: [true, 'URL is required.'],
        unique: true,
        trim: true,
    },

    // Add any other SEO-related fields you need
});

const Seo = mongoose.model('Seo', seoSchema);

module.exports = Seo;