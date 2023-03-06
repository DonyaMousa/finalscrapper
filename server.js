const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { fetchData, scrapeProductDetails } = require('./scrapper');
const { openProductLink } = require('./scrape-product');
const clientPromise = require('./mongo-client');
const { ObjectId } = require('mongodb');



const CMSCollcetionsMapping = [
  {
    productsCollection: "Laptops",
    productsDetailsCollection: "LaptopsDetails",
    amazonId: "3A16966427031",
    minReviews: 400
  },
  { 
    productsCollection: "Mobiles",
    productsDetailsCollection: "MobilesDetails",
    amazonId: "3A16966419031",
    minReviews: 100
  },
  { 
    productsCollection: "Tablets",
    productsDetailsCollection: "TabletsDetails",
    amazonId: "3A16966433031",
    minReviews: 1
  },
  { 
    productsCollection: "TVs",
    productsDetailsCollection: "TVsDetails",
    amazonId: "3A16966461031",
    minReviews: 1
  },
  { 
    productsCollection: "Cameras",
    productsDetailsCollection: "CamerasDetails",
    amazonId: "3A12463162031",
    minReviews: 1
  },

];

(async () => {
  const client = await clientPromise;
  const db = client.db();

  try {
    for (const collection of CMSCollcetionsMapping) {
      let products = await fetchData(collection.amazonId);
      let productsDetails = await scrapeProductDetails(products);
      console.log(products.length, 'products to add to MongoDB');
      const laptops = db.collection(`${collection.productsCollection}`);
      const laptopsDetails = db.collection(`${collection.productsDetailsCollection}`);

      await laptops.insertMany(products, { ordered: false });
      console.log(`${products.length} products inserted into ${collection.productsCollection}`);
      await laptopsDetails.insertMany(productsDetails, { ordered: false });
      console.log(`${productsDetails.length} products inserted into ${collection.productsDetailsCollection}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
})();







