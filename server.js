const express = require('express');
const mongoose = require('mongoose');
const { scrapeData } = require('./scraper'); // import your scraper module
const Product = require('./models'); // import your Mongoose model
const app = express();


mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://lapcom:Tdonya1410@cluster0.alllvvd.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("connected to database");

// Route for scraping data
app.get('/scrape', async (req, res) => {
  try {
    const data = await scrapeData(); // run your scraper function
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        try {
            const newProduct = new Product(data[i]);
            await newProduct.save();
            console.log("Data saved successfully to MongoDB");
        } catch (error) {
            console.error("Error saving data to MongoDB:", error);
        }
    }
    res.send('Scraping complete!');
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

app.get('/products', async (req, res) => {
    try {
        // get products from MongoDB
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        console.error(error);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
