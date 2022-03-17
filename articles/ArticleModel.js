const Sequelize = require('sequelize');
const connection = require('../database/database');

// IMPORTAR MODEL, O QUAL QUER SE RELACIONAR.
const CategoryModel = require('../categories/CategoryModel');

const ArticleModel = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

// UMA CATEGORIA TEM MUITO ARTIGOS.
CategoryModel.hasMany(ArticleModel);

// UM ARTIGO PERTENCE A UMA CATEGORIA.
// SERÁ CRIADO UM NOVA COLUNA 'categoryId', EM ARTICLES.
ArticleModel.belongsTo(CategoryModel);

// REMOVER APÓS CRIAÇÃO DA TABELA.
// ArticleModel.sync({ force: true });

module.exports = ArticleModel;
