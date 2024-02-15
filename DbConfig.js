const Sequelize = require("sequelize");
const user = require("./models/userModel");
require('dotenv').config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
   {
     host: 'localhost',
     dialect: 'mysql'
   }
 );


function sync() {
  //db = dbTemp;
  console.log("here I am " + db);
  user.sync(db);
}

module.exports = {db, sync};