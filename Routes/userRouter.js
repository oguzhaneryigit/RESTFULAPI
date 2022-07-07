const express=require('express');
const router = express.Router();

const { default: mongoose } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createError=require("http-errors")
const bcrypt = require("bcrypt");

const User = require("../models/userModel")
const auth = require('../Middleware/AuthMiddleware');
const adminAuth = require('../Middleware/AdminMiddleware');

// api/users

router.get('/',[auth,adminAuth],async (req,res,next)=>{
    try{
        let result = await User.find({});
        res.json({
            success:true,
            message:"list of all users",
            data:result 
        })
    }catch(e){
        next(e)
    }
    
})

router.get('/user/:id',async (req,res,next)=>{

    try{
        let result = await User.findById({_id:req.params.id});
        if(result){
            res.json({
                success:true,
                message:"user "+req.params.id,
                data:result 
            })
        }else{
            throw createError(404,"user could not found")
        }
        
    }catch(e){
        next(e)
    }
})

router.get('/home', auth,  (req,res,next)=>{
    res.json({
        message:"succes",
        data:req.user
    })
})

router.post('/login', async(req,res,next )=>{
    try{
        let user = await User.login(req.body.email,req.body.password)
        let token =await user.generateToken();
        user
        res.json({
            success:true,
            message:"success login",
            data:{user,token}
        });
    }catch(e){
        next(e)
    }
})

router.post('/',async (req,res,next)=>{
    try{

        let userObj =new User(req.body)
        const {error,value}= userObj.joiValidation(req.body)  
        userObj.password= await bcrypt.hash(req.body.password,10)
       
        if(error){
            console.log("validation error");
            next(createError(404,error.message))
        }else{
            let result = await userObj.save()
            res.json({
                success:true,
                message:"success user creation",
                data:result
            });
        }        
    }catch(e){
        next(e);
    }
    
    
})

router.patch('/:id', async (req,res,next)=>{//run validators olmazsa kuralları atlıyor
    try{
        await User.joiValidationForUserUpdate(req.body)
        
        if(req.body.hasOwnProperty("password")){
            req.body.password= await bcrypt.hash(req.body.password,10)
        }

        let result = await User.findByIdAndUpdate({_id :req.params.id},req.body,{new:true ,runValidators:true})
       
        console.log(result)
        if(result){
            res.json({
                success:true,
                message:"success user update",
                data:result
            })
        }else{
            console.log("user could not found") ;
            throw createError(404,"user could not found")
        }
    
        
    }catch(e){
        next(e)
    } 
    
})

router.delete('/:id',auth,adminAuth,async(req,res,next)=>{
    try{
        console.log(req.user)
        let result = await User.findByIdAndRemove({_id :req.params.id,isAdmin:false})
        if(result){  
            res.json({
                success:true,
                message:"user deleted by admin "+req.user.username,
                data:result
            })
        }
        else{
            throw createError(404,"user could not found")
        }  
    }
    catch(e){
        next(e);
    }
    
})

router.delete('/',auth,async(req,res,next)=>{
    try{
        let result = await User.findByIdAndRemove({_id :req.user._id})
        if(result){  
            res.json({
                success:true,
                message:"user deleted",
                data:result
            })
        }
        else{
            throw createError(404,"user could not found")
        }  
    }
    catch(e){
        next(e);
    }
    
})

module.exports = router 