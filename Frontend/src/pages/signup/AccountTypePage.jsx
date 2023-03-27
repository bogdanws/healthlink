import styled from "@emotion/styled";
import { useState } from "react";

export default function AccountTypePage(props) {
	const [choice, setChoice] = useState(null);
	function handleClick(choice) {
		setChoice(choice);
		props.setChoice(choice);
	}

	return (
		<Div>
			<Button
				onClick={() => handleClick(1)}
				className={`${choice === 1 ? "active" : ""}`}
			>
				<img src="signup/patient.svg" alt="Patient" />
				Patient
			</Button>
			<Button
				onClick={() => handleClick(2)}
				className={`${choice === 2 ? "active" : ""}`}
			>
				<img src="signup/doctor.svg" alt="Doctor" />
				Doctor
			</Button>
		</Div>
	);
}

const Div = styled.div({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	"@media (min-width: 768px)": {
		flexDirection: "row",
		justifyContent: "space-evenly"
	}
});

const Button = styled.button({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",

	width: "15rem",
	height: "15rem",
	maxWidth: "30vh",
	maxHeight: "30vh",

	margin: "0.5rem",
	borderRadius: "0.5rem",
	border: "none",

	backgroundColor: "#96c6f9",
	boxShadow: "0 0 10px 1px #d9d9d9",
	color: "black",
	fontSize: "1.5rem",
	cursor: "pointer",

	transition: "all 0.2s ease-in-out",
	"&:hover": {
		backgroundColor: "#6da8e6"
	},

	"&.active": {
		backgroundColor: "#6da8e6",
		transform: "scale(1.05)"
	},

	img: {
		width: "65%",
		height: "65%",
		marginBottom: "0.5rem"
	}
});
