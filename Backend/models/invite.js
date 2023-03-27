const mongoose = require("mongoose");
let Schema = mongoose.Schema;

/*
Invite: {
  inviteCode: String,
  doctor: Doctor
}
*/

let inviteSchema = new Schema({
	inviteCode: {
		type: String,
		required: true,
		unique: true,
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
		required: true,
	},
});

module.exports = mongoose.model("Invite", inviteSchema);
