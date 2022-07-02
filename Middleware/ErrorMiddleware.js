const ErrorHandler=(err,req,res,next)=>{
    //console.log(JSON.stringify(err));
    res.status(err.status||400).json({
        success:false,
        message:err.message,
        data:{}
    })
}

module.exports = ErrorHandler