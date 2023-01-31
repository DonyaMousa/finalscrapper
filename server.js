const express = require('express');
const mongoose = require('mongoose');
const scraper = require('./scraper'); // import your scraper module
const Product = require('./models'); // import your Mongoose model
const app = express();

mongoose.set('strictQuery',false);
mongoose.connect("mongodb+srv://lapcom:Tdonya1410@cluster0.alllvvd.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("connected to database");

// Route for scraping data
app.get('/scrape', async (req, res) => {
  try {
    const data = await scraper.scrapeData(); // run your scraper function
    data.forEach(async product => {
      try {
        const newProduct = new Product(product);
        await newProduct.save();
      } catch (err) {
        concole.error(err);
      }
    });
    res.send('Scraping complete!');
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
