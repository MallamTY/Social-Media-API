const mongoose = require('mongoose');

exports.connectDB = (url) => {
    mongoose.connect(url,
        {useNewUrlParser: true,
        })
        .then(() => { console.log(`\n Connetion to the Social Media Database has been established .........`)
    })
}
