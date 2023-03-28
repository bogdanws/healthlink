import InfoPage from "./InfoPage";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InfoPagePacient(props) {
	const [inviteCode, setInviteCode] = useState("");
	const [validInviteCode, setValidInviteCode] = useState(false);
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (inviteCode.length === 6) {
				axios
					.get(`/api/signup/checkCode?q=${inviteCode}`)
					.then((res) => {
						if (res.data === "valid") {
							setValidInviteCode(true);
							props.setInviteCode(inviteCode);
						} else setValidInviteCode(false);
					})
					.catch((err) => {
						console.log(err);
						setValidInviteCode(false);
					});
			} else {
				setValidInviteCode(false);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [inviteCode]);

	return (
		<>
			{!validInviteCode && (
				<>
					<p>Enter the invite code you received from your doctor</p>
					<TextField
						label="Invite Code"
						variant="outlined"
						sx={{
							...inputSx,
							backgroundColor:
								touched && !validInviteCode ? "#FEE2E2" : "#F6F8FD"
						}}
						value={inviteCode}
						onChange={(e) => {
							setInviteCode(e.target.value);
						}}
						onFocus={() => setTouched(true)}
					/>
				</>
			)}
			{validInviteCode && <InfoPage setProfileData={props.setProfileData} />}
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
