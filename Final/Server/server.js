let express = require('express');
let app = express();
let port = 3001;
let bodyParser = require('body-parser');
const cors = require('cors');

let mongoose = require('mongoose');
let account = require('./model/accountModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/fandingo');

app.use(cors());

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

const routes = require('./routes');
routes(app);

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});