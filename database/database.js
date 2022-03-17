const Sequelize = require('sequelize');
const connection = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '-03:00'
  }
);

module.exports = connection;