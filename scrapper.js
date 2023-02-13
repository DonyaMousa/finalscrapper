
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { updateWebflowCMS } = require('./webflow');
// const API_TOKEN = 'e668092e34004a7e86437769eb8f63e2';

const reviewsMin = 400;

async function fetchData(id, collectionId) {
  let maxPages = {}
  while(typeof maxPages === 'object') {
    maxPages = await getCategoryMaxPages(id)
    console.log('maxPages', maxPages)
    await scrapeProduct(id, Number(maxPages)-1, collectionId)
  }
}

async function scrapeProduct(productsId, maxPages, collectionId) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const WebPage = await browser.newPage();
    let products = [];
    for (let page = 0; page <6; page++) {
      console.log(`Scraping page ${page + 1}...`);
      await WebPage.goto(`https://www.amazon.sa/s?i=computers&bbn=16966427031&rh=n%${productsId}%2Cp_72%3A16641816031&dc&fs=true&language=en&page=${page + 1}`);
      const pageProducts = await WebPage.evaluate(() => {
        const productElements = Array.from(document.querySelectorAll('.s-result-item'));
        return productElements.map(productElement => {
          const titleElement = productElement.querySelector('div.a-section.a-spacing-none.a-spacing-top-small > h2 > a > span');
          const priceElement = productElement.querySelector('span.a-price > span.a-offscreen');
          const imageElement = productElement.querySelector('.s-image');
          const linkElement = productElement.querySelector('a.a-link-normal.a-text-normal');
          const reviewElement = productElement.querySelector('span.a-size-base.s-underline-text')
          const reviewCount = reviewElement ? reviewElement.textContent.trim() : null;
          const starElement = productElement.querySelector('div.a-section.a-spacing-none.a-spacing-top-micro > div > span');

          return {
            title: titleElement ? titleElement.textContent.trim() : null,
            price: priceElement ? priceElement.textContent.trim() : null,
            image: imageElement ? imageElement.src : null,
            link: linkElement ? linkElement.href : null,
            reviews: reviewCount,
            stars: starElement ? Number(starElement.textContent.trim().match(/(\d+\.\d+)/)[0]) : null,
            id: productElement.dataset.asin,
          };
        });
      }); 
      if(page % 5 === 0 && page !== 0) {
        // Push each 1,000 products to Webflow CMS
        filteredProducts = 
        products.filter(product => product.title && product.stars != null && product.price && product.image && product.link && product.id)
        .filter(product => product.reviews && !isNaN(Number(product.reviews.replace(/,/g, ''))))
        .map(product => {
          product.reviews = Number(product.reviews.replace(/,/g, ''))
          return product
        })
        .filter(product => product.reviews > reviewsMin);
        console.log(filteredProducts)
        await updateWebflowCMS(filteredProducts, collectionId);
        console.log(`Pushed ${products.length} products to Webflow CMS`)
        products = []
      } else if(page === maxPages - 1) {
        filteredProducts = 
        products.filter(product => product.title && product.stars != null && product.price && product.image && product.link && product.id)
        .filter(product => product.reviews && !isNaN(Number(product.reviews.replace(/,/g, ''))))
        .map(product => {
          product.reviews = Number(product.reviews.replace(/,/g, ''))
          return product
        })
        .filter(product => product.reviews > reviewsMin);
        console.log(filteredProducts)
        await updateWebflowCMS(filteredProducts, collectionId);
        console.log(`Pushed ${products.length} products to Webflow CMS`)
        products = []
      }
      else products.push(...pageProducts)
      console.log(`Scraped ${products.length} products...`)
    }
    await browser.close()    
  } catch (error) {
    console.error(error);
  }
}

const getCategoryMaxPages = async(categoryId) => {
  try {
      const response = await axios.get(
        `https://www.amazon.sa/s?rh=n%${categoryId}&fs=true&language=en&ref=lp_16966427031_sar&page=2`
      );
      const html = response.data
      const $ = cheerio.load(html)
      return $('span.s-pagination-item.s-pagination-disabled').text()
  } catch (error) {
      throw error;
  }
}
module.exports = { fetchData }
