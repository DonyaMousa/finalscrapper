require('dotenv').config()
const Webflow = require('webflow-api')
require('isomorphic-fetch');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// make updateProductDetails function to store product details in mongodb
// const api = new Webflow({ token: process.env.API_TOKEN,})
// let domain = process.env.DOMAIN
// let siteId = process.env.SITE_ID
// let ids = {}

// // calls the endpoint to get JSON response
// async function updateWebflowCMS(products, collectionId,) {
//     // delay to avoid rate limit
//     await new Promise(r => setTimeout(r, 1000));
//     console.log(products.length, 'products to add to webflow cms')
//     console.log(collectionId, 'collection id')
//     // calls Webdflow api to get collection items
//     const collectionInfo = await api.items({collectionId: collectionId})
//     //collects the item ids
//     // delay to avoid rate limit
//     await new Promise(r => setTimeout(r, 1000));
//     collectionInfo.map((item) => { ids[item.productid] = item._id})
//     console.log(ids)
//     products.map(async (product) => {
//         let formattedPrice = Number(product.price.replace(/[^0-9.-]+/g,""))
//         let currency = product.price.match(/([A-Z]{3})/g)[0]
//         let fields = {
//             // required by webflow
//             'name': product.title,
//             // 'slug': product.title,
//             'image': product.image,
//             'reviews-2': product.reviews,
//             'price': formattedPrice,
//             'productid': product.id,
//             'link': product.link,
//             'rating': product.stars,
//             '_archived': false,
//             '_draft': false,
//             'currency': currency
//         }
//         // console.log('new product parsed', fields)
//         if (ids[product.id]) {
//             // console.log('product already exists', product.id)
//             // console.log('updating product', fields)
//             // adds data to existing collection items
//             await api.patchItem({
//                 collectionId: collectionId,
//                 itemId: ids[product.id],
//                 ...fields,
//             });
//             // delay to avoid rate limit
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             delete ids[product.id];
//         } else {
//             // console.log('creating new product', fields)
//             // creates new items
//             await api.createItem({
//                 collectionId: collectionId,
//                 fields: fields
//             })
//         }
//         // add delay to avoid rate limit
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     })
//     // console.log('products added', products.length)
//     // console.log('publishing site', domain)
//     await api.publishSite({ siteId: siteId, domains: [domain] })
//     // console.log('site published', domain)
// }




const { MongoClient } = require('mongodb');

async function updateProductDetails(products) {
  const uri = 'mongodb+srv://lapcom:KhKh--123@laptops.0u3qz8y.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('Laptops');
    const collection = database.collection('Amazon');

    console.log(products.length, 'products to add to MongoDB');

    for (const product of products) {
      const filter = { productid: product.id };
      const update = {
        $set: {
          name: product.title,
          productid: product.id,
          brand: product.brand,
          modelname: product.modelname,
          screensize: product.screensize,
          color: product.color,
          harddisk: product.harddisk,
          cpumodel: product.cpumodel,
          installedram: product.installedRAM,
          operatingsystem: product.operatingSystem,
          graphicsdescription: product.graphicsDescription,
          cpu: product.cpu
        }
      };
      const options = { upsert: true };

      const result = await collection.updateOne(filter, update, options);
      if (result.modifiedCount > 0) {
        console.log('Updated product:', product.title);
      } else if (result.upsertedCount > 0) {
        console.log('Created product:', product.title);
      }
    }
  } finally {
    await client.close();
  }
}

module.exports = { updateProductDetails };

// async function updateProductDetails(products, collectionId) {
//     console.log(products.length, 'products to add to webflow cms')
//     console.log(collectionId, 'collection id')
//     // calls Webdflow api to get collection items
//     const collectionInfo = await api.items({collectionId: collectionId})
//     //collects the item ids
//     // delay to avoid rate limit
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     collectionInfo.map((item) => { ids[item.productid] = item._id})
//     console.log(ids)
//     products.map(async (product) => {
//         console.log(product)
//         let fields = {
//             // required by webflow
//             'name': product.title,
//             'productid': product.id,
//             'brand': product.brand,
//             'modelname': product.modelname,
//             'screensize': product.screensize,
//             'color': product.color,
//             'harddisk': product.harddisk,
//             'cpumodel': product.cpumodel,
//             'installedram': product.installedRAM,
//             'operatingsystem': product.operatingSystem,
//             'graphicsdescription': product.graphicsDescription,
//             'cpu': product.cpu,
//             '_archived': false,
//             '_draft': false,
//         }
//         console.log('new product parsed', fields)
//         if (ids[product.id]) {
//             console.log('product already exists', product.title)
//             console.log('updating product', fields)
//             // adds data to existing collection items
//             await api.patchItem({
//                 collectionId: collectionId,
//                 itemId: ids[product.title],
//                 ...fields,
//             });
//             delete title[product.title];
//         } else {
//             console.log('creating new product', fields)
//             // delay to avoid rate limit
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             // creates new items
//             await api.createItem({
//                 collectionId: collectionId,
//                 fields: fields
//             })
//         }
//         // add delay to avoid rate limit
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     })
// }
// module.exports = { updateWebflowCMS, updateProductDetails }