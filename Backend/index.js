const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/db');
db.connect();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const user = require('./routes/user');
app.use('/user', user);

app.listen(3000, () => {
    console.log('Listening on port 3000 at http://127.0.0.1:3000');
});