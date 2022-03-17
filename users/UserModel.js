const Sequelize = require('sequelize');
const connection = require('../database/database');

const UserModel = connection.define('users', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// REMOVER APÓS CRIAÇÃO DA TABELA.
// UserModel.sync({ force: true });

module.exports = UserModel;
