var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var RecipientSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    registrationNo: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    funds: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    physical_address: {
        type: String,
        required: true
    },
    postal_address: {
        type: String,
        required: true
    },
    tax_cert: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    valid: {
        type: String,
        default: "off"
    },
    rejected: {
        type: String,
        default: "off"
    },
    reasons: {
        type: String,
       
    },
    tel: {
        type: String,
        required: true
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    validatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    validatedAt: {
        type: Date,
        default: null
    },
    restoredBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }

})

var Reciepient = mongoose.model('recipients', RecipientSchema);
module.exports = Reciepient