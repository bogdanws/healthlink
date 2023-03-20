import { Link } from "react-router-dom";
import styles from "./Welcome.module.scss";

export default function Welcome() {
	return (
		<div className={styles.container}>
			<div className={styles.logoContainer}>
				<img className={styles.logoImg} src="logo.svg" alt="" />
				<p className={styles.logoText}>Healthlink</p>
			</div>
			<div className={styles.header}>
				<img className={styles.headerPhoto} src="welcome_header.svg" alt="" />
			</div>
			<div className={styles.title}>
				<h1>Welcome!</h1>
				<h2>Connecting you to better healthcare, one click at a time.</h2>
			</div>
			<div className={styles.fullWidth}>
				<div className={styles.buttonContainer}>
					<Link to="signup">
						<button className={`${styles.button} ${styles.signup}`}>
							Sign up
						</button>
					</Link>
					<Link to="login">
						<button className={`${styles.button} ${styles.login}`}>
							Sign in
						</button>
					</Link>
				</div>
			</div>
			<div className={styles.triangleContainer}>
				<div className={styles.triangle}></div>
				<div className={styles.triangle}></div>
			</div>
		</div>
	);
}
