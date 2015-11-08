const
    mongoose = require('mongoose'),
    packagesSchema = new mongoose.Schema({
        name: {type: String, index: true, unique: true},
        url: {type: String, unique: true},
        description: String,
        authors: [String],
        keywords: [String],
        framework: {type: String, index: true},
        created: {type: Date, default: Date.now},
        downloaded: {type: Number, default: 0}
    });

mongoose.model('Packages', packagesSchema);