const mongoose = require('mongoose');

const schema = mongoose.Schema;

 const userSchema = new schema({
    firstname: {
        type: String,
         required: [true, `First name can't be empty`],
         trim: true
    },

    lastname: {
        type: String,
        required: [true, `Last name filed can't be empty`],
        trim: true
    },

    middlename: {                           
        type: String,
        min: 1,
        trim: true
    },

     username:{
         type: String,
         required: true,
         min: 5,
         max: 50,
         unique: true,
         trim: true
     },

     email: {
         type: String,
         required: true,
         min: 5,
         max: [50, `Email address too long`],
         unique: true,
         trim: true
     },

     password:{
         type: String,
         required: true,
         min: 6
     },
     confirmPassword:{
        type: String,
        required: true,
        min: 6
    },

     profilePicture: {
        type: String,
        default: ""
     },

     coverPicture: {
        type: String,
        default: ""
     },

     followers: {
        type: Array,
        default: []
     },

     following: {
        type: Array,
        default: []
     },

     isAdmin: {
         type: Boolean,
         default: false
     },

     description: {
         type: String,
         max: 50
     },

     country: {
        type: String,
        max: 50,
        required: true,
        trim: true
    },

    city: {
        type: String,
        max: 50,
        required: true,
        trim: true
    },

    gender: {                                                                   
        type: String,
        enum: [`Male`, `Female`, `Cross-dresser`],
        required: true
    },
    
     relationship: {
         type: String,
         enum: [`Single`, `Married`, `Complicated`, `In a relationship`]
     }


 },
 {timestamps: true})

 module.exports = mongoose.model('User-Databases', userSchema)