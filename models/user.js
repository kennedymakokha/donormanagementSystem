var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    hashPassword: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        // required: true
    },

    role: {
        type: String,
        default: 'reciever'
    },
    donnerId: {
        type: Schema.Types.ObjectId,
        ref: 'doners'
    },
    recieverId: {
        type: Schema.Types.ObjectId,
        ref: 'recipients'
    },
    // createdBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

var User = mongoose.model('users', UserSchema);
module.exports = User