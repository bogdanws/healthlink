const express = require("express");
const router = express.Router();
const multer = require("multer");

const Consultation = require("../models/consultation");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Document = require("../models/document");

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

// Get all consultations for a patient/doctor
router.get("/", async (req, res) => {
	if (req.session.patient) {
		const consultations = await Consultation.find({
			patient: req.session.patient,
		});
		res.send(consultations);
	} else if (req.session.doctor) {
		const consultations = await Consultation.find({
			doctor: req.session.doctor,
		}).populate("patient");

		res.send(consultations);
	}
});

// Get documents for a consultation
router.get("/:id/documents", async (req, res) => {
	if (!req.session.doctor && !req.session.patient) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}

	const consultation = await Consultation.findById(req.params.id).populate(
		"documents"
	);

	res.send(consultation.documents);
});

// Create a consultation
router.post("/", async (req, res) => {
	if (!req.session.doctor) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}

	// Create consultation
	const consultation = new Consultation({
		patient: req.body.patient,
		doctor: req.session.doctor,
		date: req.body.date,
	});

	await consultation.save();

	const result = await Consultation.find({
		doctor: req.session.doctor,
	}).populate("patient");

	res.send(result);
});

// Add a document to a consultation
router.post("/:id/documents", upload.single("document"), async (req, res) => {
	if (!req.session.doctor) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}

	// get patient id from consultation
	const patientId = await Consultation.findById(req.params.id).select(
		"patient"
	);

	// get file type
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

	// add document to consultation
	const consultation = await Consultation.findByIdAndUpdate(
		req.params.id,
		{ $push: { documents: savedDocument._id } },
		{ new: true }
	).populate("documents");

	res.send(consultation.documents);
});

module.exports = router;
