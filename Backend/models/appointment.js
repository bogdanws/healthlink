const mongoose = require("mongoose");
let Schema = mongoose.Schema;

/*
Appointment: {
    patient: Patient,
    doctor: Doctor,
    date: Date,
    description: String
}
*/

let appointmentSchema = new Schema({
	patient: {
		type: Schema.Types.ObjectId,
		ref: "Patient",
		required: true,
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	description: {
		type: String,
		required: false,
		default: null,
	},
});
