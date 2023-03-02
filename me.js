require('dotenv').config()
const Webflow = require('webflow-api')
require('isomorphic-fetch');

const api = new Webflow({ token: process.env.API_TOKEN,})
let domain = process.env.DOMAIN
let siteId = process.env.SITE_ID
let ids = {}


async function updateWebflowCMS(products, collectionId,) {
    const collectionInfo = await api.items({collectionId: collectionId})
    collectionInfo.map((item) => { ids[item.productid] = item._id})
    products = products.map((product) => {
        let formattedPrice = Number(product.price.replace(/[^0-9.-]+/g,""))
        let currency = product.price.match(/([A-Z]{3})/g)[0]
        return {
            'name': product.title,
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
    products.map((product) => {
        console.log(product)
        setTimeout(async () => {
            await api.createItem({
                collectionId: collectionId,
                fields: product,
            })
        }, 600)
    })

    await api.publishSite({ siteId: siteId, domains: [domain] })

}



async function updateProductDetails(products, collectionId) {
    const collectionInfo = await api.items({collectionId: collectionId})
    collectionInfo.map((item) => { ids[item.productid] = item._id})
    console.log(ids)
    products = products.map((product) => {
        console.log(product)
        return {
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
        console.log(product)
        setTimeout(async () => {
            await api.createItem({
                collectionId: collectionId,
                fields: product,
            })
        }, 600)
    })

    await api.publishSite({ siteId: siteId, domains: [domain] })

}
module.exports = { updateWebflowCMS, updateProductDetails }