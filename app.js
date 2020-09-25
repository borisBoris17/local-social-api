const express = require('express');

const hostname = '127.0.0.1';
const port = 8000;

const app = express();

const mongo = require('mongodb').MongoClient;

const url = 'mongodb://mongo:27017';
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
  let albumCollection = db.collection('album');
  if (albumCollection) {
    insertIntoAlbum(albumCollection);
  } else {
    db.createCollection("album", function (err, albumCollection) {
      if (err) throw err;
      console.log("Collection created!");
      insertIntoAlbum(albumCollection);
    });
  }
});

app.get('/images/:album', async function (req, res) {
  let album_name = req.params.album;

  let albumCollection = db.collection('album');
  albumCollection.findOne({album_name: album_name}, (err, items) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(items);  
    }
  });
});

function insertIntoAlbum(albumCollection) {
  const albumsJSON = [
    {
      album_name: "album",
      pictures: [
        {
          picture_name: 'moby.JPG',
          picture_title: 'Moby'
        },
        {
          picture_name: 'molly.JPG',
          picture_title: 'Molly'
        },
        {
          picture_name: 'shockedMaple.JPG',
          picture_title: 'Shocked Maple'
        },
        {
          picture_name: 'kane.JPG',
          picture_title: 'Kane'
        },
        {
          picture_name: 'squintingMaple.JPG',
          picture_title: 'Squinting Maple'
        },
      ]
    },
    {
      album_name: "otherAlbum"
    }
  ]
  albumCollection.insertMany(albumsJSON, function (err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  });
};

app.listen(port, () => console.log('local-social-api listening at http://localhost:${port}'));