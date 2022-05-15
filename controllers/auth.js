const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors');

const register = async (req,res) => {
    const user = await User.create({...req.body});

    const token = user.createJwt();

    res.status(StatusCodes.CREATED).json({user:user.name,token});
}

const login = async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password)
        throw new BadRequestError('Please provide email and password');

    const user = await User.findOne({email});

    //check user
    if(!user)
    {
        throw new UnauthenticatedError('Invalid credentials');
    }
    
    //check password
    const isPassword = await user.comparePassword(password);
    if(!isPassword)
    {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const token = user.createJwt();
    res.status(StatusCodes.OK).json({user:user.name,token});
}

module.exports = {register,login,};