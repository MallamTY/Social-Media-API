const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const userAuth = require('./routes/userAuth')
const postRoutes = require('./routes/postRoutes');
const { connectDB } = require('./db/dbConfig');
const { MONGO_URI, PORT } = require('./configuration/configurations');

app.use(express.json())
app.use(helmet());
app.use(morgan("common"))
app.use('/app/api', userRoutes);
app.use('/api', userAuth);
app.use('/app/api', postRoutes);


const start = async() => {
    const port = PORT || 8080;
    try {
        await connectDB(MONGO_URI)
        app.listen(port, () =>{
            console.log(`\n Backend server started and running on port: ${port}`)
        })
    } catch (error) {
        console.log(console.log(error.message));
    }
}

start()

