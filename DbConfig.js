const Sequelize = require("sequelize");
const { User } = require("./models/UserModel");
const { EmailVerification } = require("./models/EmailVerificationStatusModel");
require('dotenv').config();

const { logger } = require("./util/Logging");

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
   {
     host: process.env.DB_HOST,
     dialect: 'mysql'
   } 
 );

const UserModel = User(db, Sequelize.DataTypes);
const EmailVModel = EmailVerification(db, Sequelize.DataTypes);


const sync = async () => {
  try {
    await db.authenticate();
    logger.debug('Connection has been established successfully.');

    //sync with force true if environment is development
    await db.sync({ alter: true });
    logger.debug('All models were synchronized successfully.');

    //load the csv file to the database
    //await loadCSVtoDB(process.env.USER_CSV_PATH);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  sync,
  UserModel,
  db,
  EmailVModel
};