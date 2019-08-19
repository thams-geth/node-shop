const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        const token = req.headers.authorization;
        console.log(token)
        const decode = jwt.decode(token, 'key')
        req.userData = decode
        if(decode){
            next()
        }else return res.status(200).json({
            message: 'auth token failed',
        })
    } catch (err) {

        return res.status(200).json({
            message: 'auth token failed',
            error: err
        })

    }
}