const dotenv = require('dotenv').config();

const bodyParser = require('body-parser'); // to read POST variables as body.variable
const cors = require('cors'); // to allow cross domain queries
const express = require('express'); // the server

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

if (dotenv.parsed.PORT) // to overwrite the real env variables with the ones in .env file.
  process.env.PORT = dotenv.parsed.PORT;

require('./routes')(app); // {function}

if (!process.env.PORT) throw new Error('Missing env variable PORT');

console.log('currency-converter-api running on port ' + process.env.PORT);
app.listen(process.env.PORT);
