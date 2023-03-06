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
  }
];
                                                                                                                                    

((async () => {
  const client = await clientPromise; 
  const db = client.db();

  CMSCollcetionsMapping.map(async (collection) => { 
    let products = await fetchData(collection.amazonId);
    let productsDetails = await scrapeProductDetails(products);
    console.log(products.length, 'products to add to MongoDB');
    const laptops = db.collection(`${collection.productsCollection}`);
    const laptopsDetails = db.collection(`${collection.productsDetailsCollection}`);

    await laptops.insertMany(products, { ordered: false })
    console.log (productsDetails.length, 'products details array');
    await laptopsDetails.insertMany(productsDetails, { ordered: false })

  })

  await client.close(); 
}))(); 





