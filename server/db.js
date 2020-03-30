const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/tax-mgmt';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
console.log("TCL: url", url)

mongoose.connection.on('open', () => {
    console.log("TCL: db", url);
}).on('error', (err) => {
    console.log("TCL: err", err)
});





















// const mongo = require('mongodb').MongoClient;
// const url = 'mongodb://127.0.0.1:27017/tax-mgmt'

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     const dbo = db.db('tax-mgmt');
    
//     var myquery = { address: "Valley 345" };
//     var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
//     dbo.collection('session').updateOne(myquery,newvalues, (err, delOK) => {
//         if (err) throw err;
//     console.log("1 document updated");
//     db.close()
//     });
// });