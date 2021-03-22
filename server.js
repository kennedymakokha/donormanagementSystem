
var express = require('express')
var path = require('path');
var dotenv = require('dotenv');
var mongoose = require('mongoose')
var csvtojson = require('csvtojson')
var bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');
const app = express();
var request = require('request');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const userRoute = require('./routes/users')
const catRoute = require('./routes/categories')
const DonationRoute = require('./routes/donations')
const DonarRoute = require('./routes/doner')
const RecipientRoute = require('./routes/reciepient')



dotenv.config();

const PORT = process.env.PORT || 8080;
app.use(cors())
// mongoose connection 
mongoose.Promise = global.Promise;

require("dotenv").config();
var db;
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, database) {
    if (err) {
        return console.log(err)
    };
    db = database

    console.log('db connected')
});

// bodyparser setup

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/', userRoute);
app.use('/', catRoute);
app.use('/', DonationRoute);
app.use('/', DonarRoute);
app.use('/', RecipientRoute);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT} on DB: ${process.env.DB_CONNECT}\nAPI documentation: http://localhost:3000/doc`));
module.exports = db