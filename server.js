const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose =  require('mongoose');
const userRoutes = require('./routes/users')
const userAuth = require('./routes/userAuth')
const postRoutes = require('./routes/postRoutes')

dotenv.config();

mongoose.connect(process.env.MongoDB_Connection_URL,
    {useNewUrlParser: true,
    })
    .then(() => { console.log(`\n Connetion to the Social Media Database has been established!!!!!!!!!!!!!`)
})

app.use(express.json())
app.use(helmet());
app.use(morgan("common"))
app.use('/api', userRoutes);
app.use('/api', userAuth);
app.use('/api', postRoutes);


const port = process.env.PORT || 8080;
app.listen(port, () =>{
    console.log(`\n Backend server started and running on port: ${port}`)
})