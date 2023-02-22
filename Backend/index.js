const express = require('express');
const app = express();

const db = require('./util/db');
db.connect();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000 at http://localhost:3000');
});