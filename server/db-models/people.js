const mongoose = require('mongoose');

const schema = mongoose.Schema;

const pSchema = new schema({
    Year:String,
    Industry_aggregation_NZSIOC:String,
    Industry_code_NZSIOC:String,
    Industry_name_NZSIOC:String,
    Units:String,
    Variable_code:String,
    Variable_name:String,
    Variable_category:String,
    Value:String,
    Industry_code_ANZSIC06:String
});

module.exports = mongoose.model('peoples', pSchema, 'people');