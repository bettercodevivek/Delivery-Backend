const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','deliveryPartner','customer'],
        default:'customer'
    }
});

UserSchema.pre('save',async function(next){
    const user = this;
    const SaltRounds = 10;
    if(!user.isModified('password')) return next();
    try{
        const hashedPwd = await bcrypt.hash(user.password,SaltRounds);
        user.password = hashedPwd;
        next();
    }
    catch(err){
        next(err);
    }
});

const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;