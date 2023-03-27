import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { TextField, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useState } from "react";

function Login() {
	const desktop = useMediaQuery("(min-width:768px)");
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function submitHandler(e) {
		e.preventDefault();

		axios
			.post("/api/login", { email, password }, { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					navigate("/dashboard");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.topContainer}>
					<Link to="/">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-caret-left-fill"
							viewBox="0 0 16 16"
						>
							<path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
						</svg>
					</Link>
					{!desktop && (
						<div className={styles.logoContainer}>
							<img className={styles.logoImg} src="logo.svg" alt="" />
							<p className={styles.logoText}>Healthlink</p>
						</div>
					)}
				</div>
				<div className={styles.title}>
					<h1>Sign in.</h1>
				</div>
				<div className={styles.containerLg}>
					<div className={styles.header}>
						<img src="signin.svg" className={styles.headerPhoto} />
					</div>
					<form className={styles.form} onSubmit={submitHandler}>
						{desktop && (
							<div className={styles.loginTitle}>
								<img className={styles.logoImg} src="logo.svg" alt="" />
								<h2>Sign in to your comprehensive healthcare platform</h2>
							</div>
						)}
						<TextField
							label="E-mail"
							variant="outlined"
							sx={inputSx}
							name="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
						<TextField
							label="Password"
							variant="outlined"
							sx={inputSx}
							type="password"
							name="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						<button>Sign in</button>
					</form>
				</div>
			</div>
			<div className={styles.triangle}></div>
		</>
	);
}

const inputSx = {
	backgroundColor: "#F6F8FD",
	my: "0.4rem",
	borderRadius: "0.3rem",
	"& .MuiInputLabel-root": {
		color: "primary.dark"
	}
};

export default Login;
