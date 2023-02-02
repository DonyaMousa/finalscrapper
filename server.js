const express = require('express');
const { scrapeData } = require('./scraper'); // import your scraper module
const { updateWebflowCMS } = require('./webflow');
const cron = require('cron');


const CMSCollcetionsMapping = [
  {
    Category: "laptops",
    WebflowCollectionId: "63d2c43d3ab39dfce7c91f1e",
    AmazonId: "3A16966427031",
  }
]
const scrapeAndSync = async() => {
  CMSCollcetionsMapping.map(async (collection) => {
    const data = await scrapeData(collection.AmazonId); // run your scraper function
    await updateWebflowCMS(data, collection.WebflowCollectionId);
  })
}

const devCron = "*/10 * * * *" // every 10 seconds
const prodCron = "0 0 * * *" // every day at midnight
const time = process.env.MODE === 'dev' ? devCron : prodCron

console.log('server mode', process.env.MODE)
const job = new cron.CronJob("* * * * *", function() {
  console.log('job started')
  scrapeAndSync()
}, null, true, 'America/Los_Angeles')

job.start();