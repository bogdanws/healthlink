const mongoose = require('mongoose');

const user = require('../models/user');
const patient = require('../models/patient');
const doctor = require('../models/doctor');
const appointment = require('../models/appointment');
const document = require('../models/document');

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
    user,
    patient,
    doctor,
    appointment,
    document
};