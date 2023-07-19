const userDB = require('../dbServices/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const UserModel =require('../models/userModel.js');

const registerUser = async (req, res) => {
    try { 
        const userId = uuidv4();

        console.log(req.body)
       
        const checkUser = await UserModel.findOne({ username :req.body.user });
        console.log(checkUser,"asd")
        if (checkUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {  username: req.body.user, password: hashedPassword };
        const newUser = new UserModel( userData );
         let registered = await newUser.save();
        res.status(400).json({
            message: "User Registered",
            data: registered
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: " Error",
            error: error.message,
        })
    }
}

const login = async (req, res) => {
try{
    const { user, password } = req.body;
    console.log(req.body)
    const checkUser = await UserModel.findOne({username : user});
    if(!checkUser){
        throw new Error("User Not Found")
    }
    let hashedPass = checkUser.password
    let username = checkUser.username
    let jwtPayload = { 
        user: username, 
      };
    let passwordCheck = await bcrypt.compare(password,hashedPass);
    console.log(passwordCheck, "password check");
    if (passwordCheck) {
      var token = await jwt.sign(jwtPayload, process.env.SECRETE_KEY, {expiresIn : '6h'});
    } else {
      throw new Error("Incorrect Password or Username");
    }
    res.status(200).json({
        message : "Success",
        token : token
    })
}catch(error){
    console.log("error",error)
    res.status(400).json({
        message : "Error",
        error : error.message
    })
}
}

module.exports = {
    registerUser,
    login,
}