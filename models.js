const mongoose = require('mongoose');
const scraper = require('./scraper'); // import your scraper module
const server = require('./server'); // import your server module

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  reviews: {
    type: Number,
  },
  stars: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Laptops', ProductSchema);

