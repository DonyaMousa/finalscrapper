const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { fetchData, scrapeProductDetails } = require('./scrapper');
const { openProductLink } = require('./scrape-product');
const clientPromise = require('./mongo-client');
const { ObjectId } = require('mongodb');

const CMSCollcetionsMapping = [
  {
    ProductsCollection: "Laptops",
    ProductsDetailsCollection: "LaptopsDetails",
    AmazonId: "3A16966427031",
  },
  { 
    ProductsCollection: "Mobiles",
    ProductsDetailsCollection: "MobilesDetails",
    AmazonId: "3A16966419031",
  }
];
                                                                                                                                    

((async () => {
  const client = await clientPromise; 
  const db = client.db();

  CMSCollcetionsMapping.map(async (collection) => { 
    let products = await                                                                              (collection.AmazonId);
    let productsDetails = await scrapeProductDetails(products);
    console.log(products.length, 'products to add to MongoDB');
    const laptops = db.collection(`${collection.ProductsCollection}`);
    const Laptopsdetails = db.collection(`${collection.ProductsDetailsCollection}`);

    await laptops.insertMany(products, { ordered: false })
    console.log (productsDetails.length, 'products details array');
    await Laptopsdetails.insertMany(productsDetails, { ordered: false })


    await client.close(); 

  })
}))(); 





