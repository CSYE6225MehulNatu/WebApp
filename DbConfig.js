const Sequelize = require("sequelize");
const user = require("./models/userModel");
require('dotenv').config();

const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
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