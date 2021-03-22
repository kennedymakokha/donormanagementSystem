var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var DonationsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
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

var Donation = mongoose.model('donations', DonationsSchema);
module.exports = Donation