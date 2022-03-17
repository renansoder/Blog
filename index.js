require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const connection = require('./database/database');

// NECESSÁRIO IMPORTAR OS CONTROLLERS.
const CategoriesController = require('./categories/CategoriesController');
const ArticleController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController');

// NECESSÁRIO IMPORTAR OS MODELS.
const ArticleModel = require('./articles/ArticleModel');
const CategoryModel = require('./categories/CategoryModel');
const UserModel = require('./users/UserModel');

// VIEW ENGINE
app.set('view engine', 'ejs');

// EXPRESS SESSION
app.use(session({ secret: 'escondido', cookie: { maxAge: 60000 } }));

// STATIC
app.use(express.static(path.resolve(__dirname, 'public')));

//CONFIG
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTAS
app.use(CategoriesController);
app.use(ArticleController);
app.use(UsersController);

// PÁGINA HOME
app.get('/', (req, res) => {
  ArticleModel.findAll({ order: [['id', 'DESC']], limit: 4 }).then(
    (articles) => {
      res.render('index', { articles });
    }
  );
});

// ROTA PARA BUSCAR ARTIGOS
app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  ArticleModel.findOne({ where: { slug: slug } })
    .then((article) => {
      if (article != undefined) {
        res.render('article', { article });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      res.redirect('/');
    });
});

// CONEXÃO SEQUELIZE
connection
  .authenticate()
  .then(() => {
    console.log('Conexão SEQUELIZE feita com sucesso!');
  })
  .catch((err) => {
    console.log('Falha na conexão: ' + err);
  });

module.exports = app;
