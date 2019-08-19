const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const User = require('../models/user')


exports.user_signup = (req, res, next) => {

    User.find({ email: req.body.email }).exec().then(user => {

        if (user.length >= 1) {
            return res.status(500).json({
                message: 'User already exist'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        err: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'User created'
                        })
                    }).catch(err => {
                        console.log('error :' + err)
                        res.status(500).json(err)
                    })
                }
            })
        }
    })
}

exports.user_signin = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {

                return res.status(404).json({ message: 'Auth failed , user not found' })
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(404).json({ message: 'Auth failed', err: err })
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                id: user._id
                            },
                            'key',
                            {
                                expiresIn : '1hr'
                            }
                        )
                        return res.status(200).json({ message: 'Auth successfull',token : token })
                    }
                    return res.status(404).json({ message: 'Auth failed, result 0' })

                })
            }


        }).catch(err => {
            console.log('error :' + err)
            res.status(500).json(err)
        })

}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.body.id }).exec().then(user => {
        res.status(201).json({
            message: 'User deleted'
        })
    }).catch(err => {
        console.log('error :' + err)
        res.status(500).json(err)
    })
}