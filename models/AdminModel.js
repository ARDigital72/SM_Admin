const mongose = require('mongoose')

const path = require('path')

const AdminSchma = mongose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    key: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String
    },
    role: {
        type: String
    },
    image: {
        type: String
    },
    state: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'state'
    },
    city: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'city'
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    status: {
        type: String
    }
}, {
    timestamps: true
})

const admin = mongose.model('admin', AdminSchma)

module.exports = admin