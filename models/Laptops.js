const mongoose = require('mongoose');
const scraper = require('./scraper'); // import your scraper module
const server = require('./server'); // import your server module

const Laptops = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
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
    brand: {
    type: String,
    required: true,
    },
    modelname: {
    type: String,
    required: true,
    },
    screensize: {
    type: Number,
    required: true,
    },
    color: {
    type: String,
    required: true,
    },
    harddisk: {
    type: String,
    required: true,
    },
    cpumodel: {
    type: String,
    required: true,
    },
    installedRAM: {
    type: String,
    required: true,
    },
    operatingSystem: {
    type: String,
    required: true,
    },
    graphicsDescription: {
    type: String,
    required: true,
    },
    cpu: {
    type: String,
    required: true,
    },
});

module.exports = mongoose.model('Laptops', Laptops);

