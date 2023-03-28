const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const cors = require("cors");

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
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		},
	})
);
app.use(cors({ credentials: true }));
// #endregion

const signupRouter = require("./routes/signup");
app.use("/signup", signupRouter);
const loginRouter = require("./routes/login");
app.use("/login", loginRouter);
const doctorRouter = require("./routes/doctor");
app.use("/doctor", doctorRouter);

app.listen(5000, () => {
	console.log("Listening on port 5000 at http://127.0.0.1:5000");
});
