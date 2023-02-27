const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { fetchData, scrapeProductDetails } = require('./scrapper');
const { openProductLink } = require('./scrape-product');
const clientPromise = require('./mongo-client');
const { ObjectId } = require('mongodb');

const CMSCollcetionsMapping = [
  {
    Category: "Laptops",
    AmazonId: "3A16966427031",
  }
];


// jj
((async () => {
  const client = await clientPromise;
  const db = client.db();

  CMSCollcetionsMapping.map(async (collection) => {
    let products = await fetchData(collection.AmazonId);

    console.log(products.length, 'products to add to MongoDB')

    const laptops = db.collection('Laptops');

    await laptops.insertMany(products, { ordered: false })


  })
}))(); 

((async () => {
  const client = await clientPromise;
  const db = client.db();

  CMSCollcetionsMapping.map(async (collection) => {
    let productsdetails = await scrapeProductDetails(collection.AmazonId);

    console.log(productsdetails.length, 'products to add to MongoDB')

    const laptopsdetails = db.collection('Laptopsdetails');

    await laptopsdetails.insertMany(products, { ordered: false })


  })
}))(); 





