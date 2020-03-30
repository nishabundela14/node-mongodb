const mongoose = require('mongoose');

const schema = mongoose.Schema;

const sessSchema = new schema({
    Refresh_session: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('session', sessSchema, 'session');