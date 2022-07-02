const mongoose= require('mongoose');

DBUrl='mongodb://localhost:27017/';
DBName='RestfulAPI';

mongoose.connect(DBUrl+DBName,{ useUnifiedTopology:true, useNewUrlParser:true})
    .then(_=>{console.log("connected to DB")})
    .catch(e=>{console.log("DB error\n",e);});;

