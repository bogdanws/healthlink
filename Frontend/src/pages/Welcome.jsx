import { Link } from "react-router-dom";
import styles from "./Welcome.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Welcome() {
	const desktop = useMediaQuery("(min-width:768px)");

	return (
		<div className={styles.container}>
			<div className={styles.containerLg}>
				{!desktop && (
					<div className={styles.logoContainer}>
						<img className={styles.logoImg} src="logo.svg" alt="" />
						<p className={styles.logoText}>Healthlink</p>
					</div>
				)}
				<div className={styles.header}>
					{!desktop && (
						<img
							className={styles.headerPhoto}
							src="welcome_header.svg"
							alt=""
						/>
					)}
					{desktop && (
						<img
							className={styles.headerPhoto}
							src="welcome_header_lg.svg"
							alt=""
						/>
					)}
				</div>
				<div className={styles.title}>
					<h1>Welcome!</h1>
					<h2>Connecting you to better healthcare, one click at a time.</h2>
				</div>
				<div className={styles.buttonPositioning}>
					<div className={styles.buttonContainer}>
						<Link to="signup">
							<button className={styles.signup}>Sign up</button>
						</Link>
						<Link to="login">
							<button className={styles.login}>Sign in</button>
						</Link>
					</div>
				</div>
				{!desktop && (
					<div className={styles.triangleContainer}>
						<div className={styles.triangle}></div>
						<div className={styles.triangle}></div>
					</div>
				)}
			</div>
			{desktop && (
				<img src="welcome_leaves_lg.svg" alt="" className={styles.leaves} />
			)}
		</div>
	);
}
