const express = require('express');
const router = express.Router();

const db = require('../util/db');
const User = db.user;

// POST /user
// Add a new user
/* 
example body:
{
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "address": "1234 Main St",
    "email": "example@example.com",
    "phone": "1234567890",
    "password": "password",
    "role": "medic"
}
*/
router.post('/', (req, res) => {
    let user = new User({
        info: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            address: req.body.address,
        },
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        role: req.body.role,
        profile: null
    });
    user.save().then((user) => {
        res.send(user.toJSON());
    }).catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;