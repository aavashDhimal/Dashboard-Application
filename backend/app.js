const express = require('express')
require('dotenv').config();
const app = express();
const apiRoutes = require('./routes')
const cors = require('cors')
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(process.env.PORT,(err,done)=>{
    if(err){
        console.log("error",err)
    }else{
        console.log("listening on port",process.env.PORT)
    }
})


app.use('/api',apiRoutes)
