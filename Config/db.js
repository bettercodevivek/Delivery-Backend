const mongoose = require('mongoose');

const ConnectDB = async() =>{
    try{
      mongoose.connect(process.env.MONGODB_URL)
      console.log("Connection established with DB Successfully !")
    }
    catch(err){
      console.error("Connection with DB Failed !",err.message)
    }
}

module.exports = ConnectDB;