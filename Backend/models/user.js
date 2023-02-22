const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: { // first name of the user
        type: String,
        required: true
    },
    lastName: { // last name of the user
        type: String,
        required: true
    },
    email: { // email of the user
        type: String,
        unique: false,
        required: true
    },
    phone: { // phone number of the user
        type: String,
        required: true
    },
    password: { // hashed password of the user
        type: String,
        required: true
    },
    role: { // role of the user
        type: String,
        required: true,
        enum: ['medic', 'patient', 'admin'],
        default: 'patient'
    },
    image: { // optional avatar image of the user
        type: Buffer,
        required: false,
        // default: undefined,
        contentType: String
    },
    inviteCode: { // optional invite code of the user, used for patient registration
        type: String,
        required: false,
        default: null
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
userSchema.statics.findByCredentials = function (email, phone, inviteCode, password) {
    let User = this;
    return User.findOne({ $or: [{ email }, { phone }, { inviteCode }] }).then((user) => {
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
userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
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
module.exports = mongoose.model('User', userSchema);