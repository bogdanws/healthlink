import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Paper,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	TableSortLabel
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import gridStyles from "./GridList.module.scss";
import dayjs from "dayjs";

export default function Doctors() {
	const [doctorList, setDoctorList] = useState([]);
	const [selectedDoctorTimetable, setSelectedDoctorTimetable] = useState(null);
	const [selectedDoctorName, setSelectedDoctorName] = useState("");
	const [showDialog, setShowDialog] = useState(false);

	useEffect(() => {
		axios.get("/api/doctor/getList").then((res) => {
			setDoctorList(res.data);
		});
	}, []);

	function getTimetable(doctor) {
		axios.get(`/api/doctor/getTimetable/${doctor._id}`).then((res) => {
			const timetable = [
				res.data.monday,
				res.data.tuesday,
				res.data.wednesday,
				res.data.thursday,
				res.data.friday
			].map((day, index) => {
				return {
					day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index],
					startTime: day.start,
					endTime: day.end
				};
			});
			console.log(timetable);
			setSelectedDoctorTimetable(timetable);
			setShowDialog(true);
		});
	}

	return (
		<>
			{showDialog && (
				<Dialog
					open={showDialog}
					onClose={() => setShowDialog(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{selectedDoctorName}&apos;s Timetable
					</DialogTitle>
					<DialogContent>
						<TableContainer component={Paper}>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Day</TableCell>
										<TableCell align="right">Start Time</TableCell>
										<TableCell align="right">End Time</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{selectedDoctorTimetable.map((row) => (
										<TableRow
											key={row.day}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.day}
											</TableCell>
											<TableCell align="right">
												{row.startTime
													? dayjs(row.startTime).format("hh:mm A")
													: "N/A"}
											</TableCell>
											<TableCell align="right">
												{row.endTime
													? dayjs(row.endTime).format("hh:mm A")
													: "N/A"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowDialog(false)}>Close</Button>
					</DialogActions>
				</Dialog>
			)}
			<div className={gridStyles.grid}>
				{doctorList.map((doctor) => {
					return (
						<Paper sx={{ p: 2, my: 1, mx: 1 }} key={doctor._id}>
							<h3>
								{doctor.firstName} {doctor.lastName}
							</h3>
							<p>Phone: {doctor.phone}</p>
							<p>Email: {doctor.email}</p>
							<p>Address: {doctor.address}</p>
							<p>Patients: {doctor.patients.length}</p>
							<Button
								variant="contained"
								onClick={() => {
									setSelectedDoctorName(
										`${doctor.firstName} ${doctor.lastName}`
									);
									getTimetable(doctor);
								}}
							>
								View Schedule
							</Button>
						</Paper>
					);
				})}
			</div>
		</>
	);
}
