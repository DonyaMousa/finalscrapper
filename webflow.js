require('dotenv').config()
const Webflow = require('webflow-api')
require('isomorphic-fetch');

const api = new Webflow({ token: process.env.API_TOKEN })
let domain = process.env.DOMAIN
let siteId = process.env.SITE_ID
let ids = {}

// calls the endpoint to get JSON response
async function updateWebflowCMS(products, collectionId) {
    // calls Webdflow api to get collection items
    const collectionInfo = await api.items({collectionId: collectionId})
    //collects the item ids
    collectionInfo.map((item) => { ids[item.productid] = item._id})
    console.log(ids)
    products.map(async (product) => {
        let formattedPrice = Number(product.price.replace(/[^0-9.-]+/g,""))
        let currency = product.price.match(/([A-Z]{3})/g)[0]
        let fields = {
            // required by webflow
            'name': product.title,
            // 'slug': product.title,
            'image': product.image,
            'reviews': product.reviews,
            'price': formattedPrice,
            'productid': product.id,
            'link': product.link,
            'stars': product.stars,
            '_archived': false,
            '_draft': false,
            'currency': currency
        }
        console.log('new product parsed', fields)
        if (ids[product.id]) {
            console.log('product already exists', product.id)
            console.log('updating product', fields)
            // adds data to existing collection items
            await api.patchItem({
                collectionId: collectionId,
                itemId: ids[product.id],
                ...fields,
            });
            delete ids[product.id];
        } else {
            console.log('creating new product', fields)
            // creates new items
            await api.createItem({
                collectionId: collectionId,
                fields: fields
            })
        }
    })
    console.log('products added', products.length)
    console.log('publishing site', domain)
    await api.publishSite({ siteId: siteId, domains: [domain] })
    console.log('site published', domain)
}

module.exports = { updateWebflowCMS }