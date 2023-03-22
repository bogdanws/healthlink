const express = require("express");
const router = express.Router();

const db = require("../util/db");
const Patient = db.patient;
const Doctor = db.doctor;
const User = db.user;

// POST /patient
// Create a new patient
/*
example body:
{
    user: "5c9b1b5b9b9b9b9b9b9b9b9b",
    doctor: "5c9b1b5b9b9b9b9b9b9b9b9b"
}
*/
router.post("/", (req, res) => {
	let patient = new Patient({
		user: req.body.user,
		doctor: req.body.doctor,
	});
	patient
		.save()
		.then((patient) => {
			res.send(patient.toJSON());

			// Add patient to doctor
			Doctor.findOneAndUpdate(
				{ _id: req.body.doctor },
				{ $push: { patients: patient._id } }
			);
			// Link patient to user
			User.findOneAndUpdate(
				{ _id: req.body.user },
				{ $set: { profile: patient._id } }
			).catch((err) => {
				console.error(err);
			});
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

// GET /patient
// Get patient by id
router.get("/", (req, res) => {
	let query = {};
	if (req.query.id) {
		query._id = req.query.id;
	} else {
		res.status(400).send("Invalid query");
		return;
	}

	Patient.findOne(query)
		.then((patient) => {
			if (!patient) {
				res.status(404).send("Patient not found");
			} else {
				res.send(patient.toJSON());
			}
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

// PATCH /patient
// Change doctor for patient
/*
example body:
{
    patient: "5c9b1b5b9b9b9b9b9b9b9b9b",
    doctor: "5c9b1b5b9b9b9b9b9b9b9b9b"
}
*/
router.patch("/", async (req, res) => {
	let query = {};
	if (req.body.patient && req.body.doctor) {
		query._id = req.body.patient;
		query.doctor = req.body.doctor;
	} else {
		res.status(400).send("Invalid query");
		return;
	}

	// Get patient
	let patient = await Patient.findOne(query).catch((err) => {
		res.status(400).send(err);
		return;
	});
	if (!patient) {
		res.status(404).send("Patient not found");
		return;
	}

	// Remove patient from old doctor
	await Doctor.findOneAndUpdate(
		{ _id: patient.doctor },
		{ $pull: { patients: patient._id } }
	).catch((err) => {
		res.status(400).send("Doctor not found");
		return;
	});
	// Change doctor for patient
	patient.doctor = req.body.doctor;
	await patient.save().catch((err) => {
		res.status(400).send("Patient not found");
		return;
	});
	// Add patient to new doctor
	await Doctor.findOneAndUpdate(
		{ _id: req.body.doctor },
		{ $push: { patients: patient._id } }
	).catch((err) => {
		res.status(400).send("Target doctor not found");
		return;
	});

	res.send(patient.toJSON());
});

module.exports = router;
