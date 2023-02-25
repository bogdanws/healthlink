const express = require('express');
const router = express.Router();

// require user from util\db.js
const User = require('../util/db').user;

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

// GET /user
// Get user by id/email/phone
router.get('/', (req, res) => {
    let query = {};
    if (req.query.id) {
        query._id = req.query.id;
    } else if (req.query.email) {
        query.email = req.query.email;
    } else if (req.query.phone) {
        query.phone = req.query.phone;
    } else {
        res.status(400).send('Invalid query');
        return;
    }

    User.findOne(query).then((user) => {
        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.send(user.toJSON());
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;