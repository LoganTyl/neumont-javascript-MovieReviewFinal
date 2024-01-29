let mongoose = require('mongoose');

let AccountSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
    },
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip_code: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    reviews: {
        type: Array,
        default: []
    }
});
module.exports = mongoose.model('account', AccountSchema);