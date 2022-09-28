const mongoose = require('mongoose');

const schema = mongoose.Schema;

 const postSchema = new schema({
     username: {
         type: String,
         required:true
     },

     userId: {
        type: String,
        required:true
    },

     description: {
         type: String,
         max: 255
     },

     image: {
         type: String
     },

     likes:{
         type: Array,
         default: []
 }
},
     {timestamps: true})

 module.exports = mongoose.model('Posts-Databases', postSchema)