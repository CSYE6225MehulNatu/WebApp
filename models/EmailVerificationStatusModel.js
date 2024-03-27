const Constants = require("../util/Constants")


const EmailVerification = (db, DataTypes) => {
    const emailVerificationM = db.define("email_verification_status", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      status:  { 
        type: DataTypes.STRING,
        allowNull: false,
        default: Constants.emailVerificationPending
      },
      verificationCode:  { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    },
    {
        tablename: "email_verification_states",
        timestamps: true,
        createdAt: "verification_link_creation_time",
        updatedAt: "verification_link_updation_time"
    }
    );
    return emailVerificationM;
  }
  
  //await userModel.sync({ alter: true });
    
  
  module.exports = {
    EmailVerification
  }