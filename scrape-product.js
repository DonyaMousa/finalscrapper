
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


async function openProductLink(link, browser) {
    try {
      // Open a new tab in the browser
      const page = await browser.newPage();
      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);
      
      // Navigate to the product link
      await page.goto(link, {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
      });

      const infoData = await page.$$eval('.a-section.a-spacing-small.a-spacing-top-small table tbody tr td', tds => tds.map((td) => {
        return td.innerText;
      }));
      
      let temp = ''
      let info = {} 
      infoData.map((item, i) => {
        if(i % 2 === 0) {
          temp = item
        } else {
          info[temp] = item
        }
      });
    
    await page.close();
      return { 
        details: info,
       };
    } catch (error) {
      console.error(error);
    }
}


module.exports = { openProductLink }