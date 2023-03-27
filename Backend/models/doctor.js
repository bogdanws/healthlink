const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

/*
Doctor: {
	firstName: String,
	lastName: String,
	birthDate: Date,
	email: String,
	phone: String,
	password: String,
	patients: [Patient],
	appointments: [Appointment],
	info: {
		address: String,
		phone: String,
		picture: String,
		description: String,
		// TODO: Medical license
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
		max: 6,
	},
	startingHour: {
		type: Number,
		required: true,
		min: 0,
		max: 23,
	},
	startingMinutes: {
		type: Number,
		required: true,
		min: 0,
		max: 59,
	},
	endingHour: {
		type: Number,
		required: true,
		min: 0,
		max: 23,
	},
	endingMinutes: {
		type: Number,
		required: true,
		min: 0,
		max: 59,
	},
});

let doctorSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	birthDate: {
		type: Date,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phone: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	patients: [
		{
			type: Schema.Types.ObjectId,
			ref: "Patient",
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
	info: {
		address: {
			type: String,
			required: false,
		},
		phone: {
			type: String,
			required: false,
		},
		picture: {
			type: String,
			required: false,
			default: null,
		},
		description: {
			type: String,
			required: false,
			default: null,
		},
	},
	timetable: [timetableSchema],
});

// hash password before saving to database
doctorSchema.pre("save", async function (next) {
	const doctor = this;
	if (doctor.isModified("password")) {
		doctor.password = await bcrypt.hash(doctor.password, 8);
	}
	next();
});

// toJSON
doctorSchema.methods.toJSON = function () {
	let doctor = this.toObject();
	delete doctor.password;
	return doctor;
};

module.exports = mongoose.model("Doctor", doctorSchema);
