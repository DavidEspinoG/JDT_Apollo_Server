const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO)
        console.log('Connected to Database')
    } catch(e) {
        console.log('Error connecting to DB: ', e);
        process.exit(1);
    }
};

module.exports = connectDB;