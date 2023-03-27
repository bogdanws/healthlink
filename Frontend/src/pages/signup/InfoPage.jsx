import { TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function InfoPage(props) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [birthDate, setBirthDate] = useState(dayjs().add(-18, "year"));
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			props.setProfileData({
				firstName,
				lastName,
				birthDate,
				email,
				phone
			});
		}, 250);

		return () => clearTimeout(timer);
	}, [firstName, lastName, birthDate, email, phone]);

	return (
		<>
			<TextField
				label="First Name"
				variant="outlined"
				sx={inputSx}
				value={firstName}
				onChange={(e) => {
					setFirstName(e.target.value);
				}}
			/>
			<TextField
				label="Last Name"
				variant="outlined"
				sx={inputSx}
				value={lastName}
				onChange={(e) => {
					setLastName(e.target.value);
				}}
			/>
			<MobileDatePicker
				label="Birth Date"
				sx={inputSx}
				slotProps={{
					input: {
						variant: "outlined",
						sx: inputSx
					}
				}}
				value={birthDate}
				onChange={(newValue) => {
					setBirthDate(newValue);
				}}
			/>
			<TextField
				label="Email"
				variant="outlined"
				type="email"
				sx={inputSx}
				value={email}
				onChange={(e) => {
					setEmail(e.target.value);
				}}
			/>
			<TextField
				label="Phone"
				variant="outlined"
				sx={inputSx}
				value={phone}
				onChange={(e) => {
					setPhone(e.target.value);
				}}
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
