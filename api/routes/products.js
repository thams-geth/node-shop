const express = require('express')
const router = express.Router();
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const productController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (res, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize : 1024 * 1024 * 5
    }, fileFilter: fileFilter
})

router.get('/', productController.product_get_all)
router.get('/:productID', productController.product_get_one)
router.post('/',checkAuth, upload.single('productImage'), productController.product_add)
router.patch('/:productID',checkAuth, productController.product_update)
router.delete('/:productID', checkAuth,productController.product_delete)
module.exports = router