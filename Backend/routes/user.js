const express = require('express');
const router = express.Router();

const db = require('../util/db');
const User = db.user;

// POST /user/add
// Add a new user
router.post('/add', (req, res) => {
    let user = new User(req.body);
    user.save().then((user) => {
        res.send(user.toJSON());
    }).catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;