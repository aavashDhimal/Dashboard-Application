const jwt = require('jsonwebtoken');

const checkToken = async (req,res,next) =>{
    try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error("Invalid Token Format")
    }
  
    const token = authHeader.split(' ')[1];
  
      const decoded = jwt.verify(token, process.env.SECRETE_KEY);
      if(!decoded){
        throw new Error("Invalid Token")
      }
      req.user = decoded.user;
      next();
    } catch (error) {
        console.log(error,"error")
      return res.status(401).json({ message: 'Error',
        error : error.message
    });
    }
  };

  module.exports = {checkToken}
  
