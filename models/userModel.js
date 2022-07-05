const mongoose = require('mongoose')
const Schema= mongoose.Schema;
const  Joi = require("joi");
const createError=require("http-errors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const   UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:3,
        maxlength:50,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        maxlength:500
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{collection:'Users', timestamps:true});

const joiSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50),
    username: Joi.string().trim().min(3).max(50),
    email:Joi.string().trim().email(),
    password: Joi.string().min(4).max(50)
})

UserSchema.methods.joiValidation = function (userObj) {
    joiSchema.required()
    return joiSchema.validate(userObj);
}
// methods kullanımı için User objesi gerekli iken statics için User clasının bulunması yeterlidir
UserSchema.statics.joiValidationForUserUpdate = function (userObj) {
    return joiSchema.validateAsync(userObj);
}

UserSchema.statics.login= async (email,password)=>{
    const user= await User.findOne({email})
    if(!user){
        throw createError(404,"email or password mistaken")
    }
    const hashResult = await bcrypt.compare(password,user.password)
    if(!hashResult){
        throw createError(404,"email or password mistaken")
    }
    return user;
}
// schema yazdırılmadann önce gixlenmesi gereken alanlar silinir
UserSchema.methods.toJSON = function () {
    const user =this.toObject();
    delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    //delete user.password;   
    console.log("json method çalıştı")
    return user;
}

UserSchema.methods.generateToken =async function(){
    const user=this;
    const token =await jwt.sign({username:user.username,_id:user.id,email:user.email,isAdmin:user.isAdmin},"cokgizlianahtar",{expiresIn:"1h"});
    return token ;
}
const User = mongoose.model('User',UserSchema);
module.exports = User;