import styles from "./Welcome.module.css";

export default function Welcome() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<img src="doctor.svg" />
			</div>
			<div className={styles.body}>
				<div className={styles.title}>
					<h1>Welcome</h1>
					<h2>
						Connecting you to better healthcare, one click at a
						time.
					</h2>
				</div>
				<div className={styles.buttons}>
					<button className={styles.signup}>Register</button>
					<button className={styles.login}>Log in</button>
				</div>
			</div>
		</div>
	);
}
