const express = require('express');

const hostname = '127.0.0.1';
const port = 3002;

const app = express();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://tuckerbichsel@127.0.0.1:5432/local-social-db');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Album = sequelize.define('album', {
  album_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  album_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, { timestamps: false });

const Picture = sequelize.define('picture', {
  picture_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  picture_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  picture_title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  album_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, { timestamps: false });

Album.sync({ force: true });
Picture.sync({ force: true });

Picture.belongsTo(Album, { foreignKey: 'album_id' });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
  next();
});

app.get('/images/create', async function (req, res) {
  try {
    await Album.create({
      album_id: '0',
      album_name: 'album'
    });

    await Picture.create({
      picture_id: 0,
      picture_name: 'moby.JPG',
      picture_title: 'Moby',
      album_id: '0',
    });

    await Picture.create({
      picture_id: 1,
      picture_name: 'shockedMaple.JPG',
      picture_title: 'Shocked Maple',
      album_id: '0',
    });

    await Picture.create({
      picture_id: 2,
      picture_name: 'molly.JPG',
      picture_title: 'Molly',
      album_id: '0',
    });

    await Picture.create({
      picture_id: 3,
      picture_name: 'kane.JPG',
      picture_title: 'Kane',
      album_id: '0',
    });

    await Picture.create({
      picture_id: 4,
      picture_name: 'squintingMaple.JPG',
      picture_title: 'Squinting Maple',
      album_id: '0',
    });

    res.sendStatus(200); 
  } catch (error) {
    console.log(error);
  }
});

app.get('/images/:album', async function (req, res) {
  let album_id = req.params.album;

  try {

    const picturesInAlbumJson = await Picture.findAll({
      where: {
        album_id: album_id
      }
    });

    res.json(
      picturesInAlbumJson
    );
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log('local-social-api listening at http://localhost:${port}'));