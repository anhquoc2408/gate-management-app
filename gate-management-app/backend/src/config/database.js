const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'gate_management',   
  'root',              
  'root1234',          
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;
