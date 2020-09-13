const express = require('express');

const hostname = '127.0.0.1';
const port = 3002;

const app = express();

const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
let db;
mongo.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, database) => {
  if (err) {
    console.error(err);
    return;
  }
  console.error('Connected');
  db = database.db('local-social-db');
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
  next();
});

app.get('/images/create', async function (req, res) {
  res.sendStatus(200);
});

app.get('/images/:album', async function (req, res) {
  let album_name = req.params.album;

  let albumCollection = db.collection('album');
  albumCollection.findOne({album_name: album_name}, (err, items) => {
    res.json(items);
  });
});

app.listen(port, () => console.log('local-social-api listening at http://localhost:${port}'));