import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";

export default function PasswordPage(props) {
	const [password, setPassword] = useState("");
	const [secondPassword, setSecondPassword] = useState("");
	const [passwordError, setPasswordError] = useState(false);
	const [touched, setTouched] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	function handleShowPassword() {
		setShowPassword(!showPassword);
	}

	useEffect(() => {
		if (touched && password !== secondPassword) {
			setPasswordError(true);
		} else {
			setPasswordError(false);
		}
	}, [secondPassword]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (
				!passwordError &&
				password === secondPassword &&
				password.length >= 1
			) {
				props.setPassword(password);
			} else {
				props.setPassword("");
			}
		}, 250);

		return () => clearTimeout(timer);
	}, [password, secondPassword, passwordError]);

	return (
		<>
			<TextField
				label="Password"
				variant="outlined"
				type={showPassword ? "text" : "password"}
				sx={inputSx}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleShowPassword}
								edge="end"
							>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
			<TextField
				label="Confirm password"
				variant="outlined"
				type={showPassword ? "text" : "password"}
				sx={{
					...inputSx,
					backgroundColor: passwordError ? "#FEE2E2" : "#F6F8FD"
				}}
				value={secondPassword}
				onChange={(e) => setSecondPassword(e.target.value)}
				onFocus={() => setTouched(true)}
			/>
		</>
	);
}

const inputSx = {
	backgroundColor: "#F6F8FD",
	my: "0.3rem",
	borderRadius: "0.3rem",
	"& .MuiInputLabel-root": {
		color: "primary.dark"
	}
};
