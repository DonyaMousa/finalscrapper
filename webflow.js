require('dotenv').config()
const Webflow = require('webflow-api')
require('isomorphic-fetch');

const api = new Webflow({ token: process.env.API_TOKEN,})
let domain = process.env.DOMAIN
let siteId = process.env.SITE_ID
let ids = {}

// calls the endpoint to get JSON response
async function updateWebflowCMS(products, collectionId,) {
    // delay to avoid rate limit
    // console.log(products.length, 'products to add to webflow cms')
    // console.log(collectionId, 'collection id')
    // calls Webdflow api to get collection items
    const collectionInfo = await api.items({collectionId: collectionId})
    // const collectionInfo = await Webflow.get(`https://api.webflow.com/collections/${collectionId}/items`, {
    //     headers: {
            
    // }})
    //collects the item ids
    // delay to avoid rate limit
    collectionInfo.map((item) => { ids[item.productid] = item._id})
    // console.log(ids)
    products = products.map((product) => {
        let formattedPrice = Number(product.price.replace(/[^0-9.-]+/g,""))
        let currency = product.price.match(/([A-Z]{3})/g)[0]
        return {
            // required by webflow
            'name': product.title,
            // 'slug': product.title,
            'image': product.image,
            'reviews-2': product.reviews,
            'price': formattedPrice,
            'productid': product.id,
            'link': product.link,
            'rating': product.stars,
            '_archived': false,
            '_draft': false,
            'currency': currency
        }
    })
    .filter(product => !ids[product.productid]);
    // console.log('products to be added', products.length)


    // // console.log('new product parsed', fields)
    // if (ids[product.id]) {
    //     // console.log('product already exists', product.id)
    //     // console.log('updating product', fields)
    //     // adds data to existing collection items
    //     // delay to avoid rate limit
    //     //     await api.patchItem({
    //     //         collectionId: collectionId,
    //     //         itemId: ids[product.id],
    //     //         ...fields,
    //     //     });
    //     // }, 10000)
    //     // delay to avoid rate limit
    //     delete ids[product.id];
    // } else {
    //     // console.log('creating new product', fields)
    //     // creates new items
    //     // delay to avoid rate limit
    //     console.log('delaying')
    products.map((product) => {
        console.log(product)
        setTimeout(async () => {
            await api.createItem({
                collectionId: collectionId,
                fields: product,
            })
        }, 600)
    })

    // }
    // console.log('products added', products.length)
    // console.log('publishing site', domain)
    await api.publishSite({ siteId: siteId, domains: [domain] })
    // console.log('site published', domain)
}









async function updateProductDetails(products, collectionId) {
    console.log(products.length, 'products to add to webflow cms')
    // console.log(collectionId, 'collection id')
    // calls Webdflow api to get collection items
    const collectionInfo = await api.items({collectionId: collectionId})
    collectionInfo.map((item) => { ids[item.productid] = item._id})
    console.log(ids)
    products = products.map((product) => {
        // console.log(product)
        return {
            // required by webflow
            'name': product.title,
            'productid': product.id,
            'brand': product.brand,
            'modelname': product.modelname,
            'screensize': product.screensize,
            'color': product.color,
            'harddisk': product.harddisk,
            'cpumodel': product.cpumodel,
            'installedram': product.installedRAM,
            'operatingsystem': product.operatingSystem,
            'graphicsdescription': product.graphicsDescription,
            'cpu': product.cpu,
            '_archived': false,
            '_draft': false,
        }
    })
    .filter (product => !ids[product.productid]);
    console.log('products to be added', products.length)
    products.map((product) => {
        setTimeout(async () => {
            await api.createItem({
                collectionId: collectionId,
                fields: product,
            })
        }, 600)
    })

    // .filter(product => !ids[product.productid]);
    // products.map((product) => {
    //     console.log(product)
    //     setTimeout(async () => {
    //         await api.createItem({
    //             collectionId: collectionId,
    //             fields: product,
    //         })
    //     }, 600)
    // })
    // }
    // console.log('products added', products.length)
    // console.log('publishing site', domain)
    await api.publishSite({ siteId: siteId, domains: [domain] })
    //     console.log('new product parsed', fields)
    //     if (ids[product.id]) {
    //         console.log('product already exists', product.title)
    //         console.log('updating product', fields)
    //         // adds data to existing collection items
    //         await api.patchItem({
    //             collectionId: collectionId,
    //             itemId: ids[product.title],
    //             ...fields,
    //         });
    //         delete title[product.title];
    //     } else {
    //         console.log('creating new product', fields)
    //         // delay to avoid rate limit
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         // creates new items
    //         await api.createItem({
    //             collectionId: collectionId,
    //             fields: fields
    //         })
    //     }
    //     // add delay to avoid rate limit
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // })
}
module.exports = { updateWebflowCMS, updateProductDetails }