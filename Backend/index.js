const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
require("dotenv").config();

const db = require("./util/db");
db.connect();

const app = express();
// #region middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(methodOverride());
app.use(
	session({
		secret: "very secure secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		},
		store: MongoStore.create({ mongoUrl: db.url }),
	})
);
app.use(
	cors({
		credentials: true,
	})
);
// #endregion

const signupRouter = require("./routes/signup");
app.use("/signup", signupRouter);
const loginRouter = require("./routes/login");
app.use("/login", loginRouter);
const doctorRouter = require("./routes/doctor");
app.use("/doctor", doctorRouter);
const patientRouter = require("./routes/patient");
app.use("/patient", patientRouter);
const appointmentRouter = require("./routes/appointments");
app.use("/appointments", appointmentRouter);
const consultationRouter = require("./routes/consultation");
app.use("/consultation", consultationRouter);
const ai = require("./routes/ai");
app.use("/ai", ai);

// logout
app.get("/logout", (req, res) => {
	req.session.destroy();
	res.status(200).send("Logged out");
});

app.listen(5000, () => {
	console.log("Listening on port 5000 at http://127.0.0.1:5000");
});
