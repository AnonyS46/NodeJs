const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User= new Schema({
    username:{type: 'string',required: true,unique: true},
    password:{type: 'string',required: true},
    product:[{ type: Schema.Types.ObjectId, ref: 'Product' }]
},{timestamps:true})

module.exports =mongoose.model('User',User)