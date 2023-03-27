import styles from "./Signup.module.scss";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import AccountTypePage from "./AccountTypePage";
import InfoPagePacient from "./InfoPagePacient";
import InfoPage from "./InfoPage";
import PasswordPage from "./PasswordPage";
import axios from "axios";

function Signup() {
	const desktop = useMediaQuery("(min-width:768px)");
	const navigate = useNavigate();
	// #region Steps
	const [step, setStep] = useState(1);
	const [title, setTitle] = useState("Sign up.");
	function nextStepHandler() {
		if (step === 1) {
			if (accountType === null) return;
		}

		if (step === 2) {
			if (
				!profileData.firstName ||
				!profileData.lastName ||
				!profileData.birthDate ||
				!profileData.email ||
				!profileData.phone
			)
				return;
		}

		if (step === 3) {
			if (!password) return;

			handleSubmit();
			return;
		}
		setStep((val) => val + 1);
	}
	// Set title
	useEffect(() => {
		switch (step) {
			case 1:
				setTitle("Choose your account type");
				break;
			case 2:
				setTitle("Create your profile");
				break;
			case 3:
				setTitle("Choose a password");
				break;
			default:
				setTitle("Error");
		}
	}, [step]);
	// #endregion

	function handleSubmit(e = null) {
		if (e) {
			e.preventDefault();
		}

		if (step !== 3) return;
		// Send data to backend
		if (accountType === 1) {
			axios
				.post("/api/signup/patient", {
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					birthDate: profileData.birthDate,
					email: profileData.email,
					phone: profileData.phone,
					password
				})
				.then((res) => {
					if (res.status === 200) {
						navigate("/dashboard");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axios
				.post("/api/signup/doctor", {
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					birthDate: profileData.birthDate,
					email: profileData.email,
					phone: profileData.phone,
					password
				})
				.then((res) => {
					if (res.status === 200) {
						navigate("/dashboard");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	const [accountType, setAccountType] = useState(null);
	const [profileData, setProfileData] = useState({
		firstName: "",
		lastName: "",
		birthDate: "",
		email: "",
		phone: ""
	});
	const [password, setPassword] = useState("");

	// #region Form content
	let formContent;
	switch (step) {
		case 1:
			formContent = <AccountTypePage setChoice={setAccountType} />;
			break;
		case 2:
			if (accountType === 1) {
				formContent = <InfoPagePacient setProfileData={setProfileData} />;
			} else {
				formContent = <InfoPage setProfileData={setProfileData} />;
			}
			break;
		case 3:
			formContent = <PasswordPage setPassword={setPassword} />;
			break;
		default:
			formContent = <p>Error</p>;
	}
	// #endregion

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
					<h1>Sign up.</h1>
				</div>
				<div className={styles.containerLg}>
					{desktop && (
						<div className={styles.header}>
							<img src="signin.svg" className={styles.headerPhoto} />
						</div>
					)}
					<div className={styles.formContainer}>
						<form className={styles.form} onSubmit={handleSubmit}>
							<div className={styles.loginTitle}>
								{desktop && (
									<img className={styles.logoImg} src="logo.svg" alt="" />
								)}
								<h2>{title}</h2>
							</div>
							{formContent}
						</form>
						<div className={styles.navContainer}>
							<div className={styles.stepContainer}>
								<div
									className={`${styles.step} ${step >= 1 ? styles.active : ""}`}
								/>
								<div
									className={`${styles.step} ${step >= 2 ? styles.active : ""}`}
								/>
								<div
									className={`${styles.step} ${step >= 3 ? styles.active : ""}`}
								/>
							</div>
							<button
								className={styles.nextStepButton}
								onClick={nextStepHandler}
							>
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
