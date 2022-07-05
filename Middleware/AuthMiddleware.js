const createHttpError = require("http-errors");
const jwt =require("jsonwebtoken")  
const auth =async (req,res,next)=>{
    try{
        if(!req.header("Authorization")){
            next(createHttpError(400,"you are not authorized"))
        }
        const token=req.header("Authorization").replace("Bearer ","");
        console.log(token);
        const result = jwt.verify(token,"cokgizlianahtar")
        req.user=result
        console.log(result)
        
        next()
    }catch(e){
        next(e)
    }
}

module.exports =auth