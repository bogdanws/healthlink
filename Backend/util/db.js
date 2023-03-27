const mongoose = require("mongoose");

const patient = require("../models/patient");
const invite = require("../models/invite");
const doctor = require("../models/doctor");
const appointment = require("../models/appointment");
const document = require("../models/document");

function connect() {
	mongoose.set("strictQuery", false);
	mongoose.connect("mongodb://127.0.0.1:27017/healthlink", (err) => {
		if (err) {
			console.log("Error connecting to MongoDB");
		} else {
			console.log("Connected to MongoDB...");
		}
	});
}

module.exports = {
	connect,
	patient,
	invite,
	doctor,
	appointment,
	document,
};
