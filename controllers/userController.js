const User = require('../models/users');
const validator = require('validator');
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt');



const registerUser = async(req, res) => {

    const {firstname, lastname, middlename, username, 
        email, password, confirmPassword, relationship,
        gender, city, country} = req.body
    try {
        if (!firstname || !lastname || !username
            || !email || !password || !confirmPassword || !relationship
            || !gender || !city || !country){
               return  res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `Failed !!!`,
                    message: `Requied filled must be filled !!!`
                })
            }
    
            if (!validator.isEmail(email)) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    message: `Valid email address is required !!!`
                })
            }
    
            if (!validator.isStrongPassword(password) || !validator.isStrongPassword(confirmPassword)) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    message: `Password not strong enough`
                })
            }
    
            if (password !== confirmPassword) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    message: `Password doesn't match !!!`
            })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt)
    
            let user = new User({
                firstname, lastname, middlename, username, 
               email, password: hashedPassword, confirmPassword: hashedConfirmPassword, relationship,
               gender, city, country
            })
            
            user = await user.save();
    
            if(!user) {
                return res.status(StatusCodes.NOT_IMPLEMENTED).json({
                    status: `Failed !!!`,
                    message: `Operation failed !!!`
                })
            }
    
            res.status(StatusCodes.OK).json({
                status: `Success ...`,
                message: `Account creation successful`,
                user
            })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
    }
   
}

module.exports = {
    registerUser
}