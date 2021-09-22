const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('studentdb', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.sync();

exports.Student = sequelize.define('Student', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    datetime: {
      type: DataTypes.STRING,
      allowNull: false
    }
});