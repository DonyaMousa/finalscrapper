const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { openProductLink } = require('./scrape-product');
const { ObjectId } = require('mongodb');

const reviewsMin = 400;

async function fetchData(id,store) {
  let maxPages = {};
  while (typeof maxPages === 'object') {
    maxPages = await getCategoryMaxPages(id);
    console.log('maxPages', maxPages);
    return await scrapeProduct(id, Number(maxPages) - 1, store);
  }
}


async function scrapeProduct(productsId, maxPages, store) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const WebPage = await browser.newPage();
    let filteredProducts = []
    let products = []
    for (let page = 0; page <= 10; page++) {
      // delay to avoid rate limit
      await new Promise(r => setTimeout(r, 1000));
      console.log(`Scraping page ${page + 1}...`);
      await WebPage.goto(`https://www.amazon.sa/s?i=computers&bbn=16966427031&rh=n%${productsId}%2Cp_72%3A16641816031&s=review-rank&dc&fs=true&language=en&page=${page + 1}`);
    
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
        const latestFilteredProducts = 
        products.filter(product => product.title && product.stars != null && product.price && product.image && product.link && product.id)
        .filter(product => product.reviews && !isNaN(Number(product.reviews.match(/\d+/))))
        .map(product => {
          product.reviews = Number(product.reviews.match(/\d+/))
          product._id = `${store}_${product.id}`
          product.productId = product.id
          product.lastUpdated = new Date()
          return product
        })
        .filter(product => product.reviews > reviewsMin);
        filteredProducts.push(...latestFilteredProducts)
        products = []
      } else if(page === maxPages - 1) {
        const latestFilteredProducts = 
        products.filter(product => product.title && product.stars != null && product.price && product.image && product.link && product.id)
        .filter(product => product.reviews && !isNaN(Number(product.reviews.match(/\d+/))))
        .map(product => {
          product.reviews = Number(product.reviews.match(/\d+/))
          return product
        })
        .filter(product => product.reviews > reviewsMin);
        filteredProducts.push(...latestFilteredProducts)
        products = []
      }                                                                 
      products.push(...pageProducts)
    }
    return filteredProducts
  } catch (error) {
    console.error(error);
  }
}

const scrapeProductDetails = async (products, store) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Invalid or empty products array');
  }  
  const browser = await puppeteer.launch({ headless: true });
  let prodDetails = []
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`Scraping product ${i + 1}...`);
    let productDetails = await openProductLink(product.link, browser);
    console.log('productDetails', productDetails);
    prodDetails.push(productDetails)
    // ket product.id to productDetails.id to be able to update the product in the database with v. 
    delete prodDetails.id
    productDetails.productId = product.id
    productDetails.title = product.title      
    productDetails._id = `${store}_${product.id}`
    productDetails.lastUpdated = new Date()
  }
  return prodDetails
}


// Get max pages 


const getCategoryMaxPages = async(categoryId) => {
  try {
      const response = await axios.get(
          `https://www.amazon.sa/s?i=computers&bbn=16966427031&rh=n%${categoryId}%2Cp_72%3A16641816031&s=review-rank&dc&fs=true&language=en&page=3`
      );
      const html = response.data
      const $ = cheerio.load(html)
      return $('span.s-pagination-item.s-pagination-disabled').text()
  } catch (error) {
      throw error;
  }
}

  
module.exports = { fetchData, scrapeProductDetails }
