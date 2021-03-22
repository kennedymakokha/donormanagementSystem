var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var DonarSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    donations: [{
        type: Schema.Types.ObjectId,
        ref: 'donations'
    }],
    dob: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: false
    },
    contact_phone: {
        type: String,
        required: false
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

var Doner = mongoose.model('doners', DonarSchema);
module.exports = Doner