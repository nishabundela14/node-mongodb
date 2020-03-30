const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    contact: String
});

module.exports = mongoose.model('user', userSchema, 'user_mapping');