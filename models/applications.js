var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ApplicantsSchema = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    applicants_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    donation_id: {
        type: Schema.Types.ObjectId,
        ref: 'donations'
    },
    approved: {
        type: String,
        default: 'off'
    },
    status: {
        type: String,
        default: 'Warning'
    },
    approvedBy: {
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

var Category = mongoose.model('applications', ApplicantsSchema);
module.exports = Category