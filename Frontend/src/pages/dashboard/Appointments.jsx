import {
	DateCalendar,
	MobileDatePicker,
	MobileDateTimePicker
} from "@mui/x-date-pickers";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Paper,
	TextField,
	useMediaQuery
} from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Appointments.module.scss";
import axios from "axios";

export default function Appointments() {
	const profileType = useSelector((state) => state.profile.accountType);
	const isDoctor = profileType === "doctor";
	const isMobile = useMediaQuery("(max-width: 768px)");

	const [appointments, setAppointments] = useState([]);
	const [selectedDate, setSelectedDate] = useState(dayjs());

	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
	const [appointmentDate, setAppointmentDate] = useState(dayjs());

	useEffect(() => {
		axios.get("/api/appointments").then((res) => {
			setAppointments(res.data);
		});
	}, [selectedDate]);

	function createAppointment() {
		if (!isDoctor) {
			axios
				.post("/api/appointments", {
					date: appointmentDate.toISOString()
				})
				.then((res) => {
					setAppointments(res.data);
					setShowAppointmentDialog(false);
				});
		}
	}

	return (
		<>
			{showAppointmentDialog && (
				<Dialog
					open={showAppointmentDialog}
					onClose={() => setShowAppointmentDialog(false)}
				>
					<DialogTitle>Create new appointment</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Select a date and time for the appointment
						</DialogContentText>
						<MobileDateTimePicker
							label="Select date and time"
							value={appointmentDate}
							onChange={(newValue) => {
								setAppointmentDate(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
							sx={{
								width: "100%",
								mt: 2
							}}
							minDate={dayjs()}
							maxDate={dayjs().add(1, "month")}
						/>
						{isDoctor && (
							<>
								<TextField
									label="Patient name"
									sx={{
										width: "100%",
										mt: 2
									}}
								/>
								<TextField
									label="Patient email"
									sx={{
										width: "100%",
										mt: 2
									}}
								/>
							</>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowAppointmentDialog(false)}>
							Cancel
						</Button>
						<Button onClick={createAppointment}>Create</Button>
					</DialogActions>
				</Dialog>
			)}
			{isMobile && (
				<MobileDatePicker
					label="Select date"
					value={selectedDate}
					onChange={(newValue) => {
						setSelectedDate(newValue);
					}}
					minDate={dayjs()}
					maxDate={dayjs().add(1, "month")}
					sx={{
						width: "100%",
						mt: 2,
						mb: 2
					}}
				/>
			)}
			{!isMobile && (
				<DateCalendar
					label="Select date"
					value={selectedDate}
					onChange={(newValue) => {
						setSelectedDate(newValue);
					}}
					minDate={dayjs()}
					maxDate={dayjs().add(1, "month")}
				/>
			)}
			<div className={styles.appointments}>
				<Paper elevation={4} sx={{ p: 2, my: 1, mx: 1, minHeight: "150px" }}>
					<h3>Create new appointment</h3>
					<Button
						variant="contained"
						color="primary"
						sx={{ m: 2 }}
						onClick={() => setShowAppointmentDialog(true)}
					>
						Create
					</Button>
				</Paper>
				{appointments.map((appointment) => {
					const formattedHour = dayjs(appointment.date).format("HH:mm");
					return (
						<Paper
							key={appointment._id}
							elevation={4}
							sx={{
								p: 2,
								my: 1,
								mx: 1,
								position: "relative",
								minHeight: "150px"
							}}
						>
							{isDoctor && (
								<>
									<h3>
										{appointment.patient.firstName}{" "}
										{appointment.patient.lastName} - {formattedHour}
									</h3>
									<p>Email: {appointment.patient.email}</p>
									<p>Phone: {appointment.patient.phone}</p>
								</>
							)}
							{!isDoctor && (
								<>
									<h3>{formattedHour}</h3>
									<p>
										Doctor: {appointment.doctor.firstName}{" "}
										{appointment.doctor.lastName}
									</p>
									<p>Address: {appointment.doctor.address}</p>
								</>
							)}
						</Paper>
					);
				})}
			</div>
		</>
	);
}
