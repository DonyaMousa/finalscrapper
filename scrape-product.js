
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

      const title = await page.evaluate(() => document.querySelector('#productTitle')?.textContent || "Not patched.");
      const brand = await page.evaluate(() => document.querySelector('tr.po-brand > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const modelname = await page.evaluate(() => document.querySelector('tr.po-model_name > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const screensize = await page.evaluate(() => document.querySelector('tr.po-display\\.size > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const color = await page.evaluate(() => document.querySelector('tr.po-color > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const harddisk = await page.evaluate(() => document.querySelector('tr.po-hard_disk\\.size > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const cpumodel = await page.evaluate(() => document.querySelector('tr.po-cpu_model\\.family > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const installedRAM = await page.evaluate(() => document.querySelector('tr.po-ram_memory\\.installed_size > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const operatingSystem = await page.evaluate(() => document.querySelector('tr.po-operating_system > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const graphicsDescription = await page.evaluate(() => document.querySelector('tr.po-graphics_description > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      const cpu = await page.evaluate(() => document.querySelector('tr.po-cpu_model\\.speed > td.a-span9 > span.a-size-base')?.textContent || "Not patched.");
      // Return the scraped information
      console.log (brand, modelname, screensize, color, harddisk, cpumodel, installedRAM, operatingSystem, graphicsDescription, cpu);
      
    
    await page.close();
      return { 
        brand: brand? brand : null,
        modelname: modelname? modelname : null,
        screensize: screensize? screensize : null,
        color: color? color : null,
        harddisk: harddisk? harddisk : null,
        cpumodel: cpumodel? cpumodel : null,
        installedRAM: installedRAM? installedRAM : null,
        operatingSystem: operatingSystem? operatingSystem : null,
        graphicsDescription: graphicsDescription? graphicsDescription : null,
        cpu: cpu? cpu : null,
       };
    } catch (error) {
      console.error(error);
    }
}


module.exports = { openProductLink }