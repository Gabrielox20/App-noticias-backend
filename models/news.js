const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: Date,
    source: String,
    league: String,
  });
  

module.exports = mongoose.model('News', newsSchema);
