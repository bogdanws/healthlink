const mongoose = require("mongoose");
let Schema = mongoose.Schema;

/* 
Patient: {
    user: User,
    doctor: Doctor,
    documents: [Document],
    appointments: [Appointment],
*/

let patientSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
		required: true,
	},
	documents: [
		{
			type: Schema.Types.ObjectId,
			ref: "Document",
			required: false,
			default: [],
		},
	],
	appointments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Appointment",
			required: false,
			default: [],
		},
	],
});

module.exports = mongoose.model("Patient", patientSchema);
