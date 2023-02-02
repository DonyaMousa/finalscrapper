
const puppeteer = require('puppeteer');
const fs = require('fs');

const API_TOKEN = 'e668092e34004a7e86437769eb8f63e2';
const MAX_PAGES = 2;

async function scrapeData(productsId) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${API_TOKEN}`,
    });

    let products = [];
    for (let i = 0; i < MAX_PAGES; i++) {
      console.log(`Scraping page ${i + 1}...`);
      await page.goto(`https://www.amazon.sa/s?rh=n%${productsId}&fs=true&language=en&ref=lp_16966427031_sar&page=${i + 1}`);

      const pageProducts = await page.evaluate(() => {
        const productElements = Array.from(document.querySelectorAll('.s-result-item'));
        return productElements.map(productElement => {
          const titleElement = productElement.querySelector('div.a-section.a-spacing-none.a-spacing-top-small > h2 > a > span');
          const priceElement = productElement.querySelector('span.a-price > span.a-offscreen');
          const imageElement = productElement.querySelector('.s-image');
          const linkElement = productElement.querySelector('a.a-link-normal.a-text-normal');
          const reviewElement = productElement.querySelector('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small');
          const starElement = productElement.querySelector('div.a-section.a-spacing-none.a-spacing-top-micro > div > span');

          return {
            title: titleElement ? titleElement.textContent.trim() : null,
            price: priceElement ? priceElement.textContent.trim() : null,
            image: imageElement ? imageElement.src : null,
            link: linkElement ? linkElement.href : null,
            reviews: reviewElement ? reviewElement.textContent.trim() : null,
            stars: starElement ? starElement.textContent.trim() : null,
            id: productElement.dataset.asin,
          };
        });
      });

      products.push(...pageProducts);
    }
    await browser.close()
    return filteredProducts = products.filter(product => product.title && product.price && product.image && product.link && product.id);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { scrapeData }
