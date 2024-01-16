const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const router = require('./routes/api');

require('dotenv').config();
require('./auth/auth.js');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,POST',
  optionsSuccessStatus: 204
}));

const server = http.createServer(app);

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
};

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

server.listen(5000, () => console.log('Server running on port 5000!'));

app.use('/api', router);