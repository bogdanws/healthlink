const express = require("express");
const router = express.Router();

const db = require("../util/db");
const Appointment = db.appointment;
const Patient = db.patient;
const Doctor = db.doctor;

// Function to check if patient or doctor is logged in
function isLoggedIn(req, res, next) {
	if (req.session.patient || req.session.doctor) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}
router.use(isLoggedIn);

// GET /appointments
// Get all appointments for a patient or doctor
router.get("/", (req, res) => {
	// get profile id from session
	let profileId;
	if (req.session.patient) {
		profileId = req.session.patient;
	} else if (req.session.doctor) {
		profileId = req.session.doctor;
	}

	// if patient, get all appointments for patient
	if (req.session.patient) {
		Appointment.find({ patient: profileId })
			.populate("doctor")
			.then((appointments) => {
				res.send(appointments);
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message || "Error retrieving appointments",
				});
			});
	}
	// if doctor, get all appointments for doctor
	else if (req.session.doctor) {
		Appointment.find({ doctor: profileId })
			.populate("patient")
			.then((appointments) => {
				res.send(appointments);
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message || "Error retrieving appointments",
				});
			});
	}
	// if neither, return error
	else {
		res.status(500).send({
			message: "Error retrieving appointments",
		});
	}
});

// POST /appointments
// Create a new appointment
/*
example body:
{
  "date": "2020-12-12 12:00:00",
}
*/
router.post("/", async (req, res) => {
	// get profile id from session
	let profileId;
	if (req.session.patient) {
		profileId = req.session.patient;
	} else if (req.session.doctor) {
		profileId = req.session.doctor;
	}

	// create appointment
	/* 	const appointment = new Appointment({
		profile: profileId,
		doctor: req.body.doctor,
		patient: req.body.patient,
		date: req.body.date,
		time: req.body.time,
	});

	// save appointment in the database
	appointment
		.save(appointment)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Error creating appointment",
			});
		}); */
	if (req.session.patient) {
		// get doctor from database
		const profile = await Patient.findById(profileId);
		// get doctor ID from profile
		const doctor = profile.doctor;
		if (!doctor) {
			res.status(500).send({
				message: "Error creating appointment",
			});
		}

		// create appointment
		const appointment = new Appointment({
			patient: profileId,
			doctor: doctor,
			date: req.body.date,
		});

		// save appointment in the database
		await appointment.save();

		// return all appointments for patient
		const appointments = await Appointment.find({ patient: profileId });
		res.send(appointments);
	} else {
		// TODO: create appointment for doctor
		res.status(501).send({
			message: "Not implemented",
		});
	}
});

module.exports = router;
