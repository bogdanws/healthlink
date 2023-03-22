import { Link } from "react-router-dom";
import styles from "./Login.module.scss";

function Login() {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.topContainer}>
					<Link to="/"><svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-caret-left-fill"
						viewBox="0 0 16 16"
					>
						<path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
					</svg></Link>
					<div className={styles.logoContainer}>
						<img className={styles.logoImg} src="logo.svg" alt="" />
						<p className={styles.logoText}>Healthlink</p>
					</div>
				</div>

				<div className={styles.title}>
					<h1>Sign in.</h1>
				</div>
				<div className={styles.containerLg}>
					<div className={styles.header}>
						<img src="signin.svg" className={styles.headerPhoto} />
					</div>
					<form className={styles.form}>
						<div>
							<label>E-mail:</label>
							<input type="email" name="email" />
						</div>
						<div>
							<label>Password:</label>
							<input type="password" name="password" />
						</div>
						<button>Sign in</button>
					</form>
				</div>
			</div>
			<div className={styles.triangle}></div>
		</>
	);
}

export default Login;
