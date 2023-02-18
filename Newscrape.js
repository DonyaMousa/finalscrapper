const puppeteer = require('puppeteer');
const { openProductLink } = require('./scrape-product');

(async () => {
  const browser = await puppeteer.launch();
  const productLink = 'https://www.amazon.sa/-/en/Apple-MacBook-16-inch-10%E2%80%91core-16%E2%80%91core/dp/B09JR73TQH/ref=sr_1_1?qid=1676248493&refinements=p_72%3A16641816031&rnid=16641812031&s=electronics&sr=1-1';
  const productDetails = await openProductLink(productLink, browser);
  console.log(productDetails);
  await browser.close();
})();
