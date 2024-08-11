const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const http = require('http');
const router = require('./routes/api');
const compression = require('compression');

require('dotenv').config();
require('./auth/auth.js');

const app = express();

// const RateLimit = require('express-rate-limit');
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 50,
// });


// app.use(limiter);

app.use(cors());

app.use(compression());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const server = http.createServer(app);

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
};

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

server.listen(3000, () => console.log('Server running on port 3000!'));

app.use('/api', router);