async function openProductLink(link, browser) {
    try {
      // Open a new tab in the browser
      const page = await browser.newPage();
      // Navigate to the product link
      await page.goto(link);
      // Scrape the desired information
      const Brand = await page.evaluate(() => document.querySelector('tr.po-brand > td.a-span9 > span.a-size-base').textContent);
    const ModelName = await page.evaluate(() => document.querySelector('tr.po-model_name > td.a-span9 > span.a-size-base').textContent);
    const ScreenSize = await page.evaluate(() => document.querySelector('tr.po-display.size > td.a-span9 > span.a-size-base').textContent);
    const Color = await page.evaluate(() => document.querySelector('tr.po-color > td.a-span9 > span.a-size-base').textContent);
    const hardDisk = await page.evaluate(() => document.querySelector('tr.po-hard_disk.size > td.a-span9 > span.a-size-base').textContent);
    const cpuModel = await page.evaluate(() => document.querySelector('tr.po-cpu_model > td.a-span9 > span.a-size-base').textContent);
    const ramMemory = await page.evaluate(() => document.querySelector('tr.po-ram_memory > td.a-span9 > span.a-size-base').textContent);
    const graphicsDescription = await page.evaluate(() => document.querySelector('tr.po-graphics_coprocessor > td.a-span9 > span.a-size-base').textContent);
    const operatingSystem = await page.evaluate(() => document.querySelector('tr.po-operating_system > td.a-span9 > span.a-size-base').textContent);
    const cpu = await page.evaluate(() => document.querySelector('tr.po-cpu_model.speed > td.a-span9 > span.a-size-base').textContent);

//    <div class="a-section a-spacing-small a-spacing-top-small">   <table class="a-normal a-spacing-micro">  <tr class="a-spacing-small po-brand"> <td class="a-span3">        <span class="a-size-base a-text-bold">Brand</span>      </td> <td class="a-span9">    <span class="a-size-base">Apple</span>   </td> </tr>  <tr class="a-spacing-small po-model_name"> <td class="a-span3">        <span class="a-size-base a-text-bold">Model name</span>      </td> <td class="a-span9">    <span class="a-size-base">MacBook Pro</span>   </td> </tr>  <tr class="a-spacing-small po-display.size"> <td class="a-span3">        <span class="a-size-base a-text-bold">Screen size</span>      </td> <td class="a-span9">    <span class="a-size-base">16 Inches</span>   </td> </tr>  <tr class="a-spacing-small po-color"> <td class="a-span3">        <span class="a-size-base a-text-bold">Colour</span>      </td> <td class="a-span9">    <span class="a-size-base">Space Grey</span>   </td> </tr>  <tr class="a-spacing-small po-hard_disk.size"> <td class="a-span3">        <span class="a-size-base a-text-bold">Hard disk size</span>      </td> <td class="a-span9">    <span class="a-size-base">1 TB</span>   </td> </tr>  <tr class="a-spacing-small po-cpu_model.family"> <td class="a-span3">        <span class="a-size-base a-text-bold">CPU model</span>      </td> <td class="a-span9">    <span class="a-size-base">Apple M1</span>   </td> </tr>  <tr class="a-spacing-small po-ram_memory.installed_size"> <td class="a-span3">        <span class="a-size-base a-text-bold">Installed RAM memory size</span>      </td> <td class="a-span9">    <span class="a-size-base">16 GB</span>   </td> </tr>  <tr class="a-spacing-small po-operating_system"> <td class="a-span3">        <span class="a-size-base a-text-bold">Operating system</span>      </td> <td class="a-span9">    <span class="a-size-base">Mac OS</span>   </td> </tr>  <tr class="a-spacing-small po-graphics_description"> <td class="a-span3">        <span class="a-size-base a-text-bold">Graphics card description</span>      </td> <td class="a-span9">    <span class="a-size-base">Integrated</span>   </td> </tr>  <tr class="a-spacing-small po-cpu_model.speed"> <td class="a-span3">        <span class="a-size-base a-text-bold">CPU speed</span>      </td> <td class="a-span9">    <span class="a-size-base">3.1 GHz</span>   </td> </tr>   </table>    <script type="text/javascript">
      
      // Close the tab
      await page.close();
  
      // Return the scraped information
      return { 
        Brand: Brand? Brand : null,
        ModelName: ModelName? ModelName : null,
        ScreenSize: ScreenSize? ScreenSize : null,
        Color: Color? Color : null,
        hardDisk: hardDisk? hardDisk : null,
        cpuModel: cpuModel? cpuModel : null,
        ramMemory: ramMemory? ramMemory : null,
        operatingSystem: operatingSystem? operatingSystem : null,
        graphicsDescription: graphicsDescription? graphicsDescription : null,
        cpu: cpu? cpu : null,
       };
    } catch (error) {
      console.error(error);
    }
}

module.exports = { openProductLink }