const Sequelize = require("sequelize");
const { User } = require("./models/userModel");
require('dotenv').config();

const db = new Sequelize(
  "csye_6225",
  "root",
  "root",
   {
     host: 'localhost',
     dialect: 'mysql'
   } 
 );

const UserModel = User(db, Sequelize.DataTypes);


const sync = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    //sync with force true if environment is development
    await db.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    //load the csv file to the database
    //await loadCSVtoDB(process.env.USER_CSV_PATH);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sync,
  UserModel,
  db
};