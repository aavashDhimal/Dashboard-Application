const userDB = require('../dbServices/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const registerUser = async (req, res) => {
    try { 
        const userId = uuidv4();

        console.log(req.body)
        const checkUser = await userDB.checkUser(req.body.user);
        if (checkUser.length >0) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = { id: userId, username: req.body.user, password: hashedPassword };
        let registered = await userDB.registerUser(newUser);
        res.status(400).json({
            message: "User Registered",
            data: registered
        })
    } catch (error) {
        res.status(400).json({
            message: " Error",
            error: error.message,
        })
    }
}

const login = async (req, res) => {
try{
    const { user, password } = req.body;
    const checkUser = await userDB.checkUser(user);
    console.log(checkUser[0]._source,"checkuser")
    let hashedPass = checkUser[0]._source.password
    let username = checkUser[0]._source.username
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
    res.status(400).json({
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