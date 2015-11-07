const
    mongoose = require('mongoose'),
    packagesSchema = new mongoose.Schema({
        name: String,
        url: String,
        description: String,
        authors: Array,
        categories: Array,
        created: {type: Date, default: Date.now},
        downloaded: {type: Number, default: 0}
    });

mongoose.model('Packages', packagesSchema);