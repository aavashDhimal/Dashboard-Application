const express = require('express')
require('dotenv').config();
const app = express();
const apiRoutes = require('./routes')
const cors = require('cors')


const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URL;

// Connect to MongoDB Atlas
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
  
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
