const { Sequelize } = require('sequelize');
require('dotenv').config();
// const sequelize = new Sequelize('yasmineBd', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'mysql',
//   port: "8889"
// });

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
  host: process.env.DB_HOST,
  dialect: process.env.DB_CONNECTION,
  port: process.env.DB_PORT
});

module.exports = sequelize;


// {
//   "production": {
//     "username": process.env.DB_USER,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "mysql",
//     "port": process.env.DB_PORT
//   }
// }