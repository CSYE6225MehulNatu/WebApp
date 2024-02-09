//const db = require("../DbConfig");
const Sequelize = require("sequelize");
const bcrypt = require('bcrypt');

let User = null;

function getUserModel() {
  return User;
}

function setUserModel(userModel) {
  User = userModel;
}


//import DataTypes from 'sequelize';

function sync(db) {
  
  const userModel = db.define('user', {

    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    email: { 
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password:  { 
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      set(value) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hash);
      }
    },
    firstname:  { 
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    lastname:  { 
      type: Sequelize.DataTypes.STRING, 
      allowNull: false
    },
  },
  {
      tablename: "users",
      timestamps: true,
      email: "username",
      createdAt: "account_created",
      updatedAt: "account_updated"
  }
);
 
  userModel.sync({ alter: true });
  setUserModel(userModel);
}

module.exports = {
  sync,
  getUserModel
}