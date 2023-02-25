const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/*
Doctor: {
    user: User,
    patients: [Patient],
    appointments: [Appointment],
    info: {
        address: String,
        phone: String,
        picture: String,
        description: String
    },
    timetable: {[
        day: Number (0-6),
        startingHour: Number (0-23),
        startingMinutes: Number (0-59),
        endingHour: Number (0-23),
        endingMinutes: Number (0-59)
    ]}
}
*/

let timetableSchema = new Schema({
    day: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    startingHour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    startingMinutes: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    },
    endingHour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    endingMinutes: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    }
});


let doctorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: false,
        default: []
    }],
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: false,
        default: []
    }],
    info: {
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: false,
        },
        picture: {
            type: String,
            required: false,
            default: null
        },
        description: {
            type: String,
            required: false,
            default: null
        }
    },
    timetable: [timetableSchema]
});

module.exports = mongoose.model('Doctor', doctorSchema);