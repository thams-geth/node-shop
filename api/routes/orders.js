const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')


router.get('/', (req, res, next) => {

    Order.find().select('product quantity _id')
    .populate('product','name')
    .exec().then(result => {
        res.status(200).
            json({
                order_count: result.length,
                orders: result.map(result => {
                    return {
                        product: result.product,
                        quantity: result.quantity,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            })
    })
})

router.get('/:orderID', (req, res, next) => {

    const orderID = req.params.orderID
    Order.findById(orderID).select('product quantity _id')
    .populate('product').exec().then(result => {
        if(!result){
            return res.status(404).json({
                message : 'Order not found'
            })
        }
        res.status(200).json({
            order: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + result.product
            }

        })
    }).catch(err => {
        console.log('error :' + err)
        res.status(500).json(err)
    })
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.product).then(result => {
        if (!result) {
            return res.status(404).json({
                messgae: 'product id not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.product,
            quantity: req.body.quantity
        })

        order.save().then(result => {
            res.status(201).json({
                order: result,
                messgae: 'order added successfully'
            })
        })
    })
        .catch()


})

router.patch('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'order patch',
        id: req.params.orderID
    })
})
router.delete('/:orderID', (req, res, next) => {

    Order.remove({
        _id: req.params.orderID
    }).exec().then(result => {
        if (!result) {
            return res.status(404).json({
                message : "Order not found"
            })
        }
        res.status(200).json({
            message: 'order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: {
                    product: 'String',
                    quantity: 'number'
                }
            }
        })
    }).catch(err => {
        console.log('error :' + err)
        res.status(500).json(err)
    })

})
module.exports = router