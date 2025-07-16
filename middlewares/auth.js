const jwt = require('jsonwebtoken');


function auth(req, res, next) {
  console.log("Cookies:", req.cookies);} // For debugging

function auth(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized Access !!'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({message: 'Unauthorised access!!'});
    }
}


module.exports = auth;