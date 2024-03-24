const bcrypt = require('bcrypt');
const { logger } = require("../util/Logging");

  
const User = (db, DataTypes) => {
  
  const userM = db.define('user', {

    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password:  { 
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hash);
      }
    },
    firstname:  { 
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname:  { 
      type: DataTypes.STRING, 
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
  return userM;
}

//await userModel.sync({ alter: true });
  

module.exports = {
  User
}
