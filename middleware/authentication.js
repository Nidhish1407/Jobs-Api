const User = require('../models/user');
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError('Invalid credential');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);

        // const user = await User.findById(payload.userID).select('-password');
        // req.user = user;
        
        //attaching user to job routes
        req.user = {userID:payload.userID,name:payload.name};
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = auth;