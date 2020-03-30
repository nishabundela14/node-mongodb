const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const api = require('./router/api');

//define express app
const app = express();

app.use('/api', api);

//helmet to enhance API security
app.use(helmet());

//parse JSON body to JS objects
app.use(bodyParser.json());

//enable CORS for all request
app.use(cors());

//log HTTP request
app.use(morgan('combined'));

app.get('/', (req,res) => {
    res.send('start node js');
});

app.listen(3001, () => {
    console.log("listening nodejs app on port 3001");
});
