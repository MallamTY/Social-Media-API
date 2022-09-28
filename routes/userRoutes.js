const mongoose = require('mongoose')
const express = require('express');
const  {registerUser, userLogin}  = require('../controllers/userController');
const router  = express.Router()
const bcrypt = require('bcrypt');
const User = require('../models/users');



router.route('/').post(registerUser)

router.route('/login').post(userLogin)


// router.put('/updates/:id', async (req, res, next) => {
//     if(req.body.userId === req.params.id || req.body.isAdmin){
//         if(req.body.password && req.body.confirmPassword){  
//             try {
//                 salt = await bcrypt.genSalt(10);
//                 req.body.password = await bcrypt.hash(req.body.password, salt);
//                 req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

//             } catch (error) {
//                 res.status(500).send(error.message)
//             }
//         }
//         try {
//             const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body})
//             res.status(200).send('Information successfully updated')
    
//         } catch (error) {
//             res.status(500).send(error.message)
//         }
//     }
//     else{
//         res.status(403).send('You can only update your own account')}
    
// })


// router.delete('/delete/:id', async (req, res, next) => {
//     if(req.body.userId === req.params.id || req.body.isAdmin){

//         try {
//             const user = await User.deleteOne({_id: req.params.id})
//             res.status(200).send('Record successfully deleted from our database')
    
//         } catch (error) {
//             res.status(500).send(error.message)
//         }
//     }
//     else{
//         res.status(403).send('You can only delete your own records!!!!!!!!!!!!')
//     }
// })

// router.get('/findUser/:id', async(req, res, next) => {
//     try {
//         const user = await User.findOne({_id: req.params.id}).select(['-password', '-confirmPassword', '-__v'])
//             res.status(200).send(user)
        

//      } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

// router.put('/:id/follow', async(req, res, next) => {
//     if(req.body.userId !== req.params.id) {
//         try {
//             const user = await User.findById(req.params.id)
//             const currentUser = await User.findById(req.body.userId)
            
//             if(!user.followers.includes(req.body.userId)){
//                 await user.updateOne({$push: {followers: req.body.userId}})
//                 await currentUser.updateOne({$push: {following: req.params.id}})
//                 res.status(200).send('You are now following.......')
//             }
//             else{
//                 res.status(403).send(`You can't follow a user more than once`)
//             }
//         } catch (error) {
//             res.status(500).send(error.message)
//         }
    
//     }
//     else{
//         res.status(403).send(`You can't follow yourself!!!!!!!!!!!!!!!!`)
//     }

// })

// router.put('/:id/unfollow', async(req, res, next) => {
//     if(req.body.userId !== req.params.id) {
//         try {
//             const user = await User.findById(req.params.id)
//             const currentUser = await User.findById(req.body.userId)
            
//             if(user.followers.includes(req.body.userId)){
//                 await user.updateOne({$pull: {followers: req.body.userId}})
//                 await currentUser.updateOne({$pull: {following: req.params.id}})
//                 res.status(200).send('You have unfollowed this handle.......')
//             }
//             else{
//                 res.status(403).send(`You are currently not following this handle`)
//             }
//         } catch (error) {
//             res.status(500).send(error.message)
//         }
    
//     }
//     else{
//         res.status(403).send(`You can't unfollow yourself!!!!!!!!!!!!!!!!`)
//     }

// })




module.exports = router
