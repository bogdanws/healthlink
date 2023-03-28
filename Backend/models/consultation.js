const mongoose = require("mongoose");
let Schema = mongoose.Schema;

/*
Consultation: {
  patient: ref to patient,
  doctor: ref to doctor,
  date: date,
  documents: [ref to documents],
}
*/

const consultationSchema = new Schema({
	patient: {
		type: Schema.Types.ObjectId,
		ref: "Patient",
		required: true,
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	documents: [
		{
			type: Schema.Types.ObjectId,
			ref: "Document",
		},
	],
});

module.exports = mongoose.model("Consultation", consultationSchema);
