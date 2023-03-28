const express = require("express");
const router = express.Router();
const path = require("path");

const Patient = require("../models/patient");
const Document = require("../models/document");

// GET /patient/:id/documents
// Get all documents for a patient
router.get("/:id/documents", (req, res) => {
	Patient.findById(req.params.id)
		.populate("documents")
		.then((patient) => {
			res.send(patient.documents);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Error retrieving documents",
			});
		});
});

// GET /patient/:id/:documentId
// Get a specific document for a patient
router.get("/:id/:documentId", (req, res) => {
	Document.findById(req.params.documentId)
		.then((document) => {
			res.sendFile(path.join(__dirname, "..", document.data));
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Error retrieving document",
			});
		});
});

// POST /patient/profile
// Update patient profile
router.post("/profile", (req, res) => {
	// get profile id from session
	let profileId = req.session.patient;

	// update patient profile
	Patient.findByIdAndUpdate(profileId, req.body, { new: true })
		.then((patient) => {
			res.status(200).send(patient);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Error updating patient profile",
			});
		});
});

module.exports = router;
