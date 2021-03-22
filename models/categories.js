var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var CategorySchema = new Schema({
    name: {
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

var Category = mongoose.model('categories', CategorySchema);
module.exports = Category