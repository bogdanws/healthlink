const express = require("express");
const router = express.Router();

const multer = require("multer");

const db = require("../util/db");
const Patient = db.patient;
const Doctor = db.doctor;
const Invite = db.invite;
const Appointment = db.appointment;
const Document = db.document;

let upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "uploads/");
		},
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		},
	}),
});

// Function to check if doctor is logged in
function isLoggedIn(req, res, next) {
	if (req.session.doctor) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}
router.use(isLoggedIn);

// POST /doctor/createInvite
// Create a new invite
/*
example body:
{
  "inviteCode": "123456"
}
*/
router.post("/createInvite", (req, res) => {
	// get profile id from session
	let profileId = req.session.doctor;

	// create new invite
	let invite = new Invite({
		inviteCode: req.body.inviteCode,
		doctor: profileId,
	});
});

// POST /doctor/uploadLicense
// Upload medical license
router.post("/uploadLicense", upload.single("license"), (req, res) => {
	// get profile id from session
	let profileId = req.session.doctor;

	// update doctor profile
	Doctor.findByIdAndUpdate(
		profileId,
		{ "info.license": req.file.path },
		{ new: true }
	).then((doctor) => {
		res.status(200).send(doctor);
	});
});

module.exports = router;
