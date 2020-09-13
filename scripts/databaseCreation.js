var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
  var localSocialDB = db.db("local-social-db");

  let albumCollectionToDrop = localSocialDB.collection('album');
  albumCollectionToDrop.drop();
  let albumCollection = localSocialDB.collection('album');
  if (albumCollection) {
    insertIntoAlbum(albumCollection);
  } else {
    localSocialDB.createCollection("album", function (err, albumCollection) {
      if (err) throw err;
      console.log("Collection created!");
      insertIntoAlbum(albumCollection);
    });
  }
  
  db.close();
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