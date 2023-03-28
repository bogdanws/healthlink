const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

/* 
Patient: {
	firstName: String,
	lastName: String,
	birthDate: Date,
	email: String,
	phone: String,
	password: String,
	doctor: Doctor,
	inviteCode: String,
	documents: [Document],
*/

let patientSchema = new Schema({
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
	doctor: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
		required: true,
	},
	inviteCode: {
		type: String,
		required: true,
		unique: true,
	},
	documents: [
		{
			type: Schema.Types.ObjectId,
			ref: "Document",
			required: false,
			default: [],
		},
	],
});

// hash password before saving to database
patientSchema.pre("save", async function (next) {
	const patient = this;
	if (patient.isModified("password")) {
		patient.password = await bcrypt.hash(patient.password, 8);
	}
	next();
});

// toJSON
patientSchema.methods.toJSON = function () {
	let patient = this.toObject();
	delete patient.password;
	return patient;
};

module.exports = mongoose.model("Patient", patientSchema);
