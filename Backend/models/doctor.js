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
	info: {
		address: String,
		phone: String,
		picture: String,
		description: String,
		license: String,
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
	monday: {
		start: {
			type: String,
			required: false,
			default: null,
		},
		end: {
			type: String,
			required: false,
			default: null,
		},
	},
	tuesday: {
		start: {
			type: String,
			required: false,
			default: null,
		},
		end: {
			type: String,
			required: false,
			default: null,
		},
	},
	wednesday: {
		start: {
			type: String,
			required: false,
			default: null,
		},
		end: {
			type: String,
			required: false,
			default: null,
		},
	},
	thursday: {
		start: {
			type: String,
			required: false,
			default: null,
		},
		end: {
			type: String,
			required: false,
			default: null,
		},
	},
	friday: {
		start: {
			type: String,
			required: false,
			default: null,
		},
		end: {
			type: String,
			required: false,
			default: null,
		},
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
	address: {
		type: String,
		required: false,
	},
	patients: [
		{
			type: Schema.Types.ObjectId,
			ref: "Patient",
			required: false,
			default: [],
		},
	],
	info: {
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
		license: {
			type: String,
			required: false,
			default: null,
		},
		address: {
			type: String,
			required: false,
			default: null,
		},
	},
	timetable: {
		type: timetableSchema,
		required: false,
		default: null,
	},
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
