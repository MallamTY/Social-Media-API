const User = require('../models/users');
const validator = require('validator');
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt');
const { createToken } = require('../accessories/otpGenerator');



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

const userLogin = async(req, res) => {
    const {username, email, password} = req.body

    try {
        if(!(username || email) || !password){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                status: `Failed !!!`,
                message: `All filed must be field`
            })
        }
    
        const user = await User.findOne({$or: [{username}, {email}]})
    
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: `Failed !!!`,
                message: `Incorrect email and/or password`
            })
        }
    
        const match = await bcrypt.compare(password, user.password)

        if(!match){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: `Failed !!!`,
                message: `Incorrect email and/or password`
    
            })
        }

        const token = createToken(user._id, user.username)
        res.status(StatusCodes.ACCEPTED).json({
            status: `Success .....`,
            message: `Login successful`,
            token
        })
        
    } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
    }
}

const updateProfile = async(req, res) => {
    try {
        const {password, confirmPassword} = req.body;

        if(!validator.isStrongPassword(password) || !validator.isStrongPassword(confirmPassword)){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                message: `Password not strong enough !!!`
            })
        }

        if (password !== confirmPassword) {
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                message: `Password doesn't match !!!`
        })  
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);



        const updatedUser = await User.findOneAndUpdate({username: req.params.username}, {...req.body, password:hashedPassword, confirmPassword:hashedConfirmPassword}, {new: true})

        res.status(StatusCodes.OK).json({
            status: `Success ...`,
            message: `Profile updated`,
            updatedUser
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
    }
}


module.exports = {
    registerUser,
    userLogin,
    updateProfile
}