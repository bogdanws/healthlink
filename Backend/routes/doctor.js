const express = require("express");
const router = express.Router();

const db = require("../util/db");
const Patient = db.patient;
const Doctor = db.doctor;
const Invite = db.invite;
const Appointment = db.appointment;
const Document = db.document;

// Function to check if doctor is logged in
function isLoggedIn(req, res, next) {
	if (req.session.doctor) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}
router.use(isLoggedIn);

// POST /createInvite
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
