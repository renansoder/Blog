const Sequelize = require('sequelize');
const connection = require('../database/database');

const CategoryModel = connection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// REMOVER APÓS CRIAÇÃO DA TABELA.
// CategoryModel.sync({ force: true });

module.exports = CategoryModel;
