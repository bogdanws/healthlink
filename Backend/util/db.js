const mongoose = require('mongoose');

const user = require('../models/user');

function connect() {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://127.0.0.1:27017/healthlink', (err) => {
        if (err) {
            console.log('Error connecting to MongoDB');
        } else {
            console.log('Connected to MongoDB...');
        }
    });
}

module.exports = {
    connect,
};