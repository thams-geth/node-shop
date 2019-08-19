const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const orderController = require('../controllers/orders')


router.get('/', checkAuth,orderController.order_get_all )

router.get('/:orderID', checkAuth, orderController.order_get_one)

router.post('/', checkAuth, orderController.order_post)

router.patch('/:orderID', checkAuth, (req, res, next) => {
    res.status(200).json({
        message: 'order patch',
        id: req.params.orderID
    })
})
router.delete('/:orderID', checkAuth, orderController.order_delete)
module.exports = router