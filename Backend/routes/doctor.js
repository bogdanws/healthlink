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

// GET /doctor/getList
// Get list of all doctors
router.get("/getList", (req, res) => {
	Doctor.find().then((doctors) => {
		res.status(200).send(doctors);
	});
});

// GET /doctor/getTimetable/:doctorId
// Get timetable for doctor
router.get("/getTimetable/:doctorId", (req, res) => {
	// get doctor id from url
	let doctorId = req.params.doctorId;

	// get timetable from database
	Doctor.findById(doctorId).then((doctor) => {
		res.status(200).send(doctor.timetable);
	});
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
router.get("/createInvite", (req, res) => {
	// get profile id from session
	let profileId = req.session.doctor;

	// create new random invite code with 6 digits
	const inviteCode = Math.floor(100000 + Math.random() * 900000);
	// make sure invite code is unique
	let isUnique = false;
	while (!isUnique) {
		isUnique = true;

		Invite.findOne({ inviteCode: inviteCode }).then((invite) => {
			if (invite) {
				// invite code already exists, generate new one
				inviteCode = Math.floor(100000 + Math.random() * 900000);
				isUnique = false;
			}
		});
	}

	let invite = new Invite({
		inviteCode: inviteCode,
		doctor: profileId,
	});

	// save invite to database
	invite.save().then((invite) => {
		res.status(200).send(invite);
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

// POST /doctor/uploadDocument/:patientId
// Upload document for patient
router.post(
	"/uploadDocument/:patientId",
	upload.single("document"),
	async (req, res) => {
		// get profile id from session
		let profileId = req.session.doctor;

		// get patient id from url
		let patientId = req.params.patientId;

		// get type of document from body
		let type;
		const fileExtension = req.file.originalname.split(".").pop();
		if (fileExtension === "pdf") {
			type = "pdf";
		} else if (fileExtension === "png" || fileExtension === "jpg") {
			type = "image";
		} else {
			type = "other";
		}

		// create new document
		let document = new Document({
			patient: patientId,
			date: new Date(),
			data: req.file.path,
			type: type,
		});

		// save document to database
		const savedDocument = await document.save();

		// add document to patient's list of documents
		await Patient.findByIdAndUpdate(
			patientId,
			{ $push: { documents: savedDocument._id } },
			{ new: true }
		);

		res.status(200).send(savedDocument);
	}
);

// POST /doctor/profile
// Update doctor profile
/*
example body:
{
	"firstName": "John",
	"lastName": "Doe",
	"email": "email@email.com",
	"phone": "1234567890",
	info: {
		"address": "123 Main St",
	},
	schedule: {
		monday: {
			start: "09:00",
			end: "17:00",
		},
		tuesday: {
			start: "09:00",
			end: "17:00",
		}
	},
}
*/
router.post("/profile", (req, res) => {
	// get profile id from session
	let profileId = req.session.doctor;

	// update doctor profile
	const newProfile = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		phone: req.body.phone,
		address: req.body.address,
		timetable: req.body.timetable,
	};

	Doctor.findByIdAndUpdate(profileId, newProfile, { new: true })
		.then((doctor) => {
			res.status(200).send(doctor);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

// GET /doctor/patients
// Get list of patients
router.get("/patients", (req, res) => {
	// get profile id from session
	let profileId = req.session.doctor;

	// get list of patients from doctor
	Doctor.findById(profileId)
		.populate("patients")
		.then((doctor) => {
			res.status(200).send(doctor.patients);
		});
});

module.exports = router;
