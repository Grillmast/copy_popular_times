const express = require('express');
require('dotenv').config();
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const path = require('path');
const articleModel = require('./models/articles');

const app = express();
const PORT = process.env.PORT || 3001;

var hbs = exphbs.create({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
  try {
    const articles = await articleModel.fetchAll(); 
    res.render('main', { layout: 'index', data: articles }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
});