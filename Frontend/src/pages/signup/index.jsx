import styles from "./Signup.module.scss";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

function Signup() {
	const desktop = useMediaQuery("(min-width:768px)");
	const [step, setStep] = useState(1);

	const inputSx = {
		backgroundColor: "#F6F8FD",
		my: "0.2rem",
		borderRadius: "0.3rem",
		"& .MuiInputLabel-root": {
			color: "primary.dark"
		}
	};

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
					<div className={styles.logoContainer}>
						<img className={styles.logoImg} src="logo.svg" alt="" />
						<p className={styles.logoText}>Healthlink</p>
					</div>
				</div>
				<div className={styles.title}>
					<h1>Sign up.</h1>
				</div>
				<div className={styles.containerLg}>
					{desktop && (
						<div className={styles.header}>
							<img src="signin.svg" className={styles.headerPhoto} />
						</div>
					)}
					<div className={styles.formContainer}>
						<form className={styles.form}>
							{step === 1 && (
								<>
									<TextField
										label="First name"
										variant="outlined"
										className={styles.input}
										sx={inputSx}
									/>
									<TextField
										label="Last name"
										variant="outlined"
										className={styles.input}
										sx={inputSx}
									/>
									<DatePicker
										label="Birth date"
										variant="outlined"
										className={styles.input}
										sx={inputSx}
									/>
									<TextField
										label="E-mail"
										variant="outlined"
										className={styles.input}
										type="email"
										sx={inputSx}
									/>
									<TextField
										label="Phone number"
										variant="outlined"
										className={styles.input}
										type="tel"
										sx={inputSx}
									/>
									<TextField
										label="Password"
										variant="outlined"
										className={styles.input}
										type="password"
										sx={inputSx}
									/>
									<TextField
										label="Confirm password"
										variant="outlined"
										className={styles.input}
										type="password"
										sx={inputSx}
									/>
								</>
							)}
						</form>
						<div className={styles.navContainer}>
							<div className={styles.stepContainer}>
								<div
									className={`${styles.step} ${
										step === 1 ? styles.active : ""
									}`}
								/>
								<div
									className={`${styles.step} ${
										step === 2 ? styles.active : ""
									}`}
								/>
								<div
									className={`${styles.step} ${
										step === 3 ? styles.active : ""
									}`}
								/>
							</div>
							<button className={styles.nextStepButton}>
								<span>Next</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-caret-right-fill"
									viewBox="0 0 16 16"
								>
									<path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.triangle}></div>
		</>
	);
}

export default Signup;
