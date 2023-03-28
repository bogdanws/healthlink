import styles from "./Profile.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { profileActions } from "../../store";
import { Button, TextField } from "@mui/material";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

export default function Profile(props) {
	const profile = useSelector((state) => state.profile);
	const uploadedLicense = useSelector((state) => state.profile.uploadedLicense);
	const dispatch = useDispatch();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [birthDate, setBirthDate] = useState(dayjs());
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [schedule, setSchedule] = useState({
		monday: {
			start: null,
			end: null
		},
		tuesday: {
			start: null,
			end: null
		},
		wednesday: {
			start: null,
			end: null
		},
		thursday: {
			start: null,
			end: null
		},
		friday: {
			start: null,
			end: null
		}
	});
	const [clinicAddress, setClinicAddress] = useState("");
	useEffect(() => {
		setFirstName(profile.firstName);
		setLastName(profile.lastName);
		setBirthDate(dayjs(profile.birthDate));
		setEmail(profile.email);
		setPhone(profile.phone);
		setSchedule(profile.schedule);
		setClinicAddress(profile.clinicAddress);
	}, [profile]);

	return (
		<div className={styles.profile}>
			<div className={styles.header}>
				<h3>Welcome, {`${profile.firstName} ${profile.lastName}`}</h3>
				<Button
					variant="contained"
					onClick={() => {
						axios
							.post("/api/profile", {
								firstName,
								lastName,
								birthDate: birthDate.format("YYYY-MM-DD"),
								email,
								phone,
								schedule,
								clinicAddress
							})
							.then((res) => {
								dispatch(profileActions.setProfile(res.data));
							});
					}}
				>
					Save Changes
				</Button>
			</div>
			<div className={styles.profileInfo}>
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
			</div>
			{profile.accountType === "doctor" && (
				<>
					<div className={styles.schedule}>
						<h3>Your Schedule</h3>
						<div className={styles.scheduleDays}>
							{["monday", "tuesday", "wednesday", "thursday", "friday"].map(
								(day) => (
									<div className={styles.scheduleDay} key={day}>
										<h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
										<MobileTimePicker
											label="Start"
											value={schedule[day].start}
											onChange={(newValue) => {
												setSchedule((prev) => ({
													...prev,
													[day]: { ...prev[day], start: newValue }
												}));
											}}
											renderInput={(params) => <TextField {...params} />}
										/>
										<MobileTimePicker
											label="End"
											value={schedule[day].end}
											onChange={(newValue) => {
												setSchedule((prev) => ({
													...prev,
													[day]: { ...prev[day], end: newValue }
												}));
											}}
											renderInput={(params) => <TextField {...params} />}
										/>
										<Button
											variant="outlined"
											sx={{ mt: "0.3rem" }}
											onClick={() => {
												setSchedule((prev) => ({
													...prev,
													[day]: { start: null, end: null }
												}));
											}}
										>
											Clear
										</Button>
									</div>
								)
							)}
						</div>
					</div>
					<div className={styles.clinicInfo}>
						<h3>Your Clinic</h3>
						<div className={styles.clinicInfoGrid}>
							<TextField
								label="Address"
								variant="outlined"
								sx={inputSx}
								value={clinicAddress}
								onChange={(e) => {
									setClinicAddress(e.target.value);
								}}
							/>
							{/* button to upload medical license */}
							{!uploadedLicense && (
								<>
									<input
										accept="image/*"
										className={styles.input}
										style={{ display: "none" }}
										id="raised-button-file"
										multiple
										type="file"
										onChange={(e) => {
											// upload medical license
											const config = {
												headers: { "Content-Type": "multipart/form-data" }
											};
											const fd = new FormData();
											fd.append("license", e.target.files[0]);
											axios
												.post("/api/doctor/uploadLicense", fd, config)
												.then((res) => {
													// if status is 200, then license was uploaded successfully
													if (res.status === 200) {
														dispatch(profileActions.setUploadedLicense(true));
													}
												});
										}}
									/>
									<label htmlFor="raised-button-file">
										<Button
											variant="contained"
											component="span"
											className={styles.button}
										>
											Upload medical license
										</Button>
									</label>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</div>
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
