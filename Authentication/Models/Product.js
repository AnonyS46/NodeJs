const mongoose = require('mongoose');

const Schema= mongoose.Schema

const Product= mongoose.Schema({
    name: {
        type: 'string',
        required: true,
    },
    img: {
        type: 'string',
    },
    price: {
        type: 'number',
        required: true,
    },
    user:{ type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Products', Product)