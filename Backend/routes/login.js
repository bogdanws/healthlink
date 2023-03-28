const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const db = require("../util/db");
const Patient = db.patient;
const Doctor = db.doctor;

// POST /api/login
// login user
router.post("/", (req, res) => {
	// get email and password from request
	const email = req.body.email;
	const password = req.body.password;

	// check if email and password are valid
	if (!email || !password) {
		res.status(400).send("Invalid email or password");
		return;
	}

	// check if email is in either patient or doctor table
	// check patient table first
	Patient.findOne({ email: email })
		.then((patient) => {
			// if patient is found, check password
			if (patient) {
				bcrypt.compare(password, patient.password, (err, result) => {
					if (err) {
						res.status(500).send("Internal server error");
						return;
					}
					if (result) {
						// if password is correct, send patient data and set session
						req.session.patient = patient;
						res.status(200).send(patient);
					} else {
						// if password is incorrect, send error
						res.status(400).send("Invalid email or password");
					}
				});
			} else {
				// if patient is not found, check doctor table
				Doctor.findOne({ email: email })
					.then((doctor) => {
						// if doctor is found, check password
						if (doctor) {
							bcrypt.compare(password, doctor.password, (err, result) => {
								if (err) {
									res.status(500).send("Internal server error");
									return;
								}
								if (result) {
									// if password is correct, send doctor data and set session
									req.session.doctor = doctor;
									res.status(200).send(doctor);
								} else {
									// if password is incorrect, send error
									res.status(400).send("Invalid email or password");
								}
							});
						} else {
							// if doctor is not found, send error
							res.status(400).send("Invalid email or password");
						}
					})
					.catch((err) => {
						res.status(500).send("Internal server error");
					});
			}
		})
		.catch((err) => {
			res.status(500).send("Internal server error");
		});
});

// GET /api/login
// check if user is logged in
router.get("/", (req, res) => {
	// check if patient is logged in
	if (req.session.patient) {
		// get patient from database
		Patient.findById(req.session.patient._id)
			.then((patient) => {
				// if patient is found, send patient data
				if (patient) {
					res.status(200).send({ ...patient, accountType: "patient" });
				}
			})
			.catch((err) => {
				res.status(500).send("Internal server error");
			});
	} else if (req.session.doctor) {
		// check if doctor is logged in
		// get doctor from database
		Doctor.findById(req.session.doctor._id)
			.then((doctor) => {
				// if doctor is found, send doctor data
				if (doctor) {
					// check if doctor has uploaded license
					if (doctor.info.license) {
						doctor.info.license = true;
					} else {
						doctor.info.license = false;
					}

					console.log(doctor);
					res.status(200).send({ doctor, accountType: "doctor" });
				}
			})
			.catch((err) => {
				res.status(500).send("Internal server error");
			});
	} else {
		// if user is not logged in, send error
		res.status(401).send("not logged in");
	}
});

module.exports = router;
