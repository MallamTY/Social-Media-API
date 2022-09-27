const mongoose = require('mongoose')
const express = require('express')
const router  = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt');
const { findOne } = require('../models/users');


router.post('/auth', async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt)
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            description: req.body.description
            
        })
        const updatedUser = await user.save()
        res.status(200).send(updatedUser)
    } 
    catch (error) {
        res.status(404).send(error.message)
    }
    
})

//Signing In
router.post('/SignIn', async(req, res, next) => {
   try {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(404).send(`You currently don't have an account with us, please proceed to the signup page!!!!!!!!!!!!!!!!`)
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword){
        return res.status(400).send('Userame or Password not match!!!!!!!!!!!!!!!')
    }

    res.status(200).send('You have successfully logged in....................')

   } catch (error) {
       res.status(500).send(error.message)
   }

})



module.exports = router
