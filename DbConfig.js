const Sequelize = require("sequelize");
const user = require("./models/userModel");
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


async function sync() {
  //db = dbTemp;
  console.log("here I am " + db);
  user.sync(db);
}

module.exports = {db, sync};