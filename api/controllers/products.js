const mongoose = require('mongoose')
const Product = require('../models/product')

exports.product_get_all = (req, res, next) => {

    Product.find().select('name price _id productImage').exec().then(result => {
        res.status(200).
            json({
                count: result.length,
                product: result.map(result => {
                    return {
                        name: result.name,
                        price: result.price,
                        productImage : result.productImage,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            })
    }).catch(err => {
        console.log('error : ' + err)
        res.status(500).json(err)
    })

}

exports.product_get_one = (req, res, next) => {

    const productID = req.params.productID
    Product.findById(productID).select('name price _id').exec().then(result => {
        res.status(200).json({
            product: result,
            request: {
                type: 'GET',
                desc: 'Get all product',
                url: 'http://localhost:3000/products/'
            }

        })
    }).catch(err => {
        console.log('error :' + err)
        res.status(500).json(err)
    })
}

exports.product_add = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage : req.file.path
    })
    product.save().then(result => {
        res.status(201).json({
            message: 'product added successfully',
            addedProduct:
            {
                name: result.name,
                price: result.price,
                productImage : result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }

        })
    })
        .catch(err => console.log('err :' + err))

}

exports.product_update = (req, res, next) => {

    const updatedValue = {}
    for (const c of req.body) {
        updatedValue[c.name] = c.value
    }
    Product.update({ _id: req.params.productID }, { $set: updatedValue }).exec().then(result => {
        console.log('product updated successfully')
        res.status(201).json({
            product: 'product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + req.params.productID
            }
        }).catch(err => console.log('err :' + err))

    })

}

exports.product_delete = (req, res, next) => {

    Product.remove({
        _id: req.params.productID
    }).exec().then(result => {
        res.status(200).json({
            product: 'product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {
                    name: 'String',
                    price: 'number'
                }
            }
        })
    }).catch(err => {
        console.log('error :' + err)
        res.status(500).json(err)
    })
}
