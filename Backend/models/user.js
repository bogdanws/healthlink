const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let Schema = mongoose.Schema;

/* 
User: {
    info: {
        firstName: String,
        lastName: String,
        birthDate: Date,
        address: String,
        gender: String,
    },
    email: String,
    phone: String,
    password: String,
    role: String,
    profile: ref to Medic or Patient,
}
 */

let userSchema = new Schema({
	info: {
		// info of the user
		firstName: {
			// first name of the user
			type: String,
			required: true,
		},
		lastName: {
			// last name of the user
			type: String,
			required: true,
		},
		birthDate: {
			// birth date of the user
			type: Date,
			required: false,
			default: null,
		},
		address: {
			// address of the user
			type: String,
			required: false,
			default: null,
		},
	},
	email: {
		// email of the user
		type: String,
		unique: false,
		required: true,
	},
	phone: {
		// phone number of the user
		type: String,
		required: true,
	},
	password: {
		// hashed password of the user
		type: String,
		required: true,
	},
	role: {
		// role of the user
		type: String,
		required: true,
		enum: ["doctor", "patient"],
		default: "patient",
	},
	profile: {
		// profile of the user
		type: Schema.Types.ObjectId,
		ref: "Doctor" || "Patient",
		required: false,
		default: null,
	},
});

// override toJSON method to remove password from the response
userSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;
	return userObject;
};

// find by email/phone/inviteCode and password
userSchema.statics.findByCredentials = function (email, phone, password) {
	let User = this;
	return User.findOne({ $or: [{ email }, { phone }] }).then((user) => {
		if (!user) {
			return Promise.reject();
		}
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

// hash the password before saving the user model
userSchema.pre("save", function (next) {
	let user = this;
	if (user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

// export the model
module.exports = mongoose.model("User", userSchema);
