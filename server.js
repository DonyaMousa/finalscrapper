const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { fetchData, scrapeProductDetails } = require('./scrapper');
const { openProductLink } = require('./scrape-product');
const clientPromise = require('./mongo-client');


const CMSCollcetionsMapping = {
  amazon: {
    laptops: {
      productsCollection: "laptops",
      productsDetailsCollection: "laptops-details",
      amazonId: "3A16966427031",
      minReviews: 400,
      store: 'amazon'
    },
    mobiles: {
      productsCollection: "mobiles",
      productsDetailsCollection: "mobiles-details",
      amazonId: "3A16966419031",
      minReviews: 100
    },
    tablets: { 
      productsCollection: "tablets",
      productsDetailsCollection: "tablets-details",
      amazonId: "3A16966433031",
      minReviews: 1
    },
    tvs: {
      productsCollection: "tvs",
      productsDetailsCollection: "tvs-details",
      amazonId: "3A16966461031",
      minReviews: 1
    },
    cameras: {
      productsCollection: "cameras",
      productsDetailsCollection: "cameras-details",
      amazonId: "3A12463162031",
      minReviews: 1
    }
  }
};

(async () => {
  const client = await clientPromise;
  const db = client.db();

  for (storeId in Object.keys(CMSCollcetionsMapping)) {
    let store = Object.values(CMSCollcetionsMapping)[storeId];
    // for (categoryId in Object.keys(store)) {
    //   let category = Object.values(store)[categoryId];
    //   let { productsCollection, productsDetailsCollection, amazonId, minReviews } = category;

      try {
        for (categoryId in Object.keys(store)) {
          let category = Object.values(store)[categoryId];
          let { productsCollection, productsDetailsCollection, amazonId } = category;
    
          let products = await fetchData(amazonId, Object.keys(CMSCollcetionsMapping)[storeId]);
          let productsDetails = await scrapeProductDetails(products, Object.keys(CMSCollcetionsMapping)[storeId]);
          console.log(productsDetails)
          console.log(products.length, 'products to add to MongoDB');
          const laptops = db.collection(`${productsCollection}`);
          const laptopsDetails = db.collection(`${productsDetailsCollection}`);

          await laptops.insertMany(products, { ordered: false });
          console.log(`${products.length} products inserted into ${productsCollection}`);
          await laptopsDetails.insertMany(productsDetails, { ordered: false });
          console.log(`${productsDetails.length} products inserted into ${productsDetailsCollection}`);
          // avoid repeated inserts of same product id in the database
        }
      } catch (err) {
        console.error(err);
      } finally {
        client.close();
      }
    // }
  }
})();







