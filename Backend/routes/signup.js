const express = require("express");
const router = express.Router();

const db = require("../util/db");
const Patient = db.patient;
const Doctor = db.doctor;
const Invite = db.invite;

// POST /signup/patient
// Create a new patient
/*
example body:
{
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "email": "johndoe@email.com",
  "phone": "1234567890",
  "password": "password",
  "inviteCode": "123456"
}
*/
router.post("/patient", async (req, res) => {
	// get invite code from request
	let inviteCode = req.body.inviteCode;

	let doctor;

	// check if invite code is valid
	try {
		let invite = await Invite.findOne({ inviteCode: inviteCode });
		if (!invite) {
			res.status(401).send("Invalid invite code");
			return;
		}
		doctor = invite.doctor;
	} catch (err) {
		res.status(500).send(err);
		return;
	}

	// create new patient
	let patient = new Patient({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		birthDate: req.body.birthDate,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
		doctor: doctor,
		inviteCode: inviteCode,
	});

	try {
		await patient.save();
		res.send(patient.toJSON());
	} catch (err) {
		res.status(500).send(err);
	}

	// Add patient to doctor
	await Doctor.findOneAndUpdate(
		{ _id: doctor },
		{ $push: { patients: patient._id } }
	);

	// Delete invite code
	await Invite.findOneAndDelete({ inviteCode: inviteCode });
});

// POST /signup/doctor
// Create a new doctor
/*
example body:
{
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "email": "",
  "phone": "",
  "password": "password"
}
*/
router.post("/doctor", (req, res) => {
	// create new doctor
	let doctor = new Doctor({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		birthDate: req.body.birthDate,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
	});

	doctor
		.save()
		.then((doctor) => {
			res.send(doctor.toJSON());
		})
		.catch((err) => {
			console.error(err);
			res.status(400).send(err);
		});
});

// GET /signup/checkCode?q=123456
// Check if invite code is valid
router.get("/checkCode", (req, res) => {
	// get invite code from request
	let inviteCode = req.query.q;
	if (!inviteCode) {
		res.status(400).send("Invalid query");
		return;
	}

	// check if invite code is valid
	Invite.findOne({ inviteCode: inviteCode })
		.then((invite) => {
			if (!invite) {
				res.status(401).send("invalid");
				return;
			}
			res.send("valid");
		})
		.catch((err) => {
			res.status(400).send(err);
			return;
		});
});

module.exports = router;
