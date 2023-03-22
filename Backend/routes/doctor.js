const express = require("express");
const router = express.Router();

const db = require("../util/db");
const Doctor = db.doctor;
const User = db.user;

// POST /doctor
// Create a new doctor
/*
example body:
{
    user: "5c9b1b5b9b9b9b9b9b9b9b9b",
    address: "1234 Main St"
}
*/
router.post("/", (req, res) => {
	let doctor = new Doctor({
		user: req.body.user,
		info: {
			address: req.body.address,
			phone: req.body.phone || null,
			description: req.body.description || null,
		},
		timetable: req.body.timetable || null,
	});
	doctor
		.save()
		.then((doctor) => {
			res.send(doctor.toJSON());
			// Link doctor to user
			User.findOneAndUpdate(
				{ _id: req.body.user },
				{ $set: { profile: doctor._id } }
			).catch((err) => {
				console.error(err);
			});
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

// GET /doctor
// Get doctor by id or user
router.get("/", (req, res) => {
	if (!req.query.id && !req.query.user) {
		res.status(400).send("Invalid query");
		return;
	}

	let query = {};
	if (req.query.id) {
		query._id = req.query.id;
	} else if (req.query.user) {
		query.user = req.query.user;
	}

	Doctor.findOne(query)
		.then((doctor) => {
			if (!doctor) {
				res.status(404).send("Doctor not found");
			} else {
				res.send(doctor.toJSON());
			}
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

module.exports = router;
