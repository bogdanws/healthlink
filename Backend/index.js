const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const db = require("./util/db");
db.connect();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

const user = require("./routes/user");
app.use("/user", user);
const doctor = require("./routes/doctor");
app.use("/doctor", doctor);
const patient = require("./routes/patient");
app.use("/patient", patient);

app.listen(3000, () => {
	console.log("Listening on port 3000 at http://127.0.0.1:3000");
});
