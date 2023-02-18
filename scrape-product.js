
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


async function openProductLink(link, browser) {
    try {
      // Open a new tab in the browser
      const page = await browser.newPage();
      // Navigate to the product link
      await page.goto(link);
      // Scrape the desired information

// view-source:https://www.amazon.sa/-/en/Apple-MacBook-16-inch-10%E2%80%91core-16%E2%80%91core/dp/B09JR73TQH/ref=sr_1_1?qid=1676248493&refinements=p_72%3A16641816031&rnid=16641812031&s=electronics&sr=1-1

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
      //      </div>  </div> <div id="poToggleButton" class="a-expander-header a-expander-partial-collapse-header"><div class="a-expander-content-fade"></div><a href="javascript:void(0)" data-csa-c-func-deps="aui-da-a-expander-toggle" data-csa-c-type="widget" data-csa-interaction-events="click" aria-expanded="false" role="button" data-action="a-expander-toggle" class="a-declarative" data-a-expander-toggle="{&quot;allowLinkDefault&quot;:true, &quot;expand_prompt&quot;:&quot;See more&quot;, &quot;collapse_prompt&quot;:&quot;See less&quot;}"><i class="a-icon a-icon-extender-expand"></i><span class="a-expander-prompt">See more</span></a></div> </div> <script type='text/javascript'>
      // check if see more button is present and click it if not skip it
      // const seeMoreButton = await page.evaluate(() => document.querySelector('div.a-expander-header.a-expander-partial-collapse-header')?.textContent || undefined);
      // console.log(seeMoreButton);
      // if (seeMoreButton) {
      //   await page.click('div.a-expander-header.a-expander-partial-collapse-header');
      // }
    
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