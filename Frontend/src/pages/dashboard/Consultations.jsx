import styles from "./Consultations.module.scss";
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
	useMediaQuery,
	Select,
	InputLabel,
	FormControl,
	MenuItem
} from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import FileViewer from "./components/FileViewer";

export default function Consultations() {
	const profileType = useSelector((state) => state.profile.accountType);
	const isDoctor = profileType === "doctor";

	const [consultations, setConsultations] = useState([]);
	const [showAddDialog, setShowAddDialog] = useState(false);

	const [showDialog, setShowDialog] = useState(false);
	const [selectedConsultation, setSelectedConsultation] = useState(null);

	useEffect(() => {
		axios.get("/api/consultation/").then((res) => {
			setConsultations(res.data);
		});
	}, []);

	return (
		<>
			{showAddDialog && (
				<NewConsultation
					showAddDialog={showAddDialog}
					setShowAddDialog={setShowAddDialog}
					setConsultations={setConsultations}
				/>
			)}
			{showDialog && (
				<ConsultationFiles
					showDialog={showDialog}
					setShowDialog={setShowDialog}
					selectedConsultation={selectedConsultation}
					isDoctor={isDoctor}
				/>
			)}
			<div className={styles.consultations}>
				{isDoctor && (
					<Paper
						elevation={3}
						sx={{
							padding: "1rem",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							alignItems: "center"
						}}
					>
						<h3>Create Consultation</h3>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setShowAddDialog(true);
							}}
						>
							Create Consultation
						</Button>
					</Paper>
				)}
				{consultations.map((consultation) => {
					return (
						<Paper
							key={consultation._id}
							elevation={3}
							sx={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								cursor: "pointer"
							}}
						>
							{isDoctor && (
								<h3>
									{consultation.patient.firstName}{" "}
									{consultation.patient.lastName}
								</h3>
							)}
							<p>{dayjs(consultation.date).format("DD/MM/YYYY")}</p>
							<Button
								variant="contained"
								color="primary"
								onClick={() => {
									setSelectedConsultation(consultation);
									setShowDialog(true);
								}}
							>
								View Documents
							</Button>
						</Paper>
					);
				})}
			</div>
		</>
	);
}

function ConsultationFiles({
	showDialog,
	setShowDialog,
	selectedConsultation,
	isDoctor
}) {
	const [documents, setDocuments] = useState([]);
	const [showDocumentDialog, setShowDocumentDialog] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState(null);

	useEffect(() => {
		axios
			.get(`/api/consultation/${selectedConsultation._id}/documents`)
			.then((res) => {
				setDocuments(res.data);
			});
	}, []);

	function uploadDocument(e) {
		const config = {
			headers: { "Content-Type": "multipart/form-data" }
		};
		const fd = new FormData();
		fd.append("document", e.target.files[0]);
		axios
			.post(
				`/api/consultation/${selectedConsultation._id}/documents`,
				fd,
				config
			)
			.then((res) => {
				if (res.status === 200) {
					setDocuments(res.data);
				}
			});
	}

	return (
		<>
			<Dialog open={showDialog} onClose={() => setShowDialog(false)}>
				<DialogTitle>
					{selectedConsultation.patient.lastName}{" "}
					{selectedConsultation.patient.firstName}
				</DialogTitle>
				<DialogContent>
					{isDoctor && (
						<>
							<input
								accept="*"
								style={{ display: "none" }}
								id="raised-button-file"
								type="file"
								onChange={(e) => {
									uploadDocument(e);
								}}
							/>
							<label htmlFor="raised-button-file">
								<Button variant="contained" component="span">
									Upload Document
								</Button>
							</label>
						</>
					)}
					{documents.map((document) => {
						const date = dayjs(document.date).format("MM/DD/YYYY");
						const fileName = document.data.split("\\")[1];
						return (
							<Paper
								key={document._id}
								sx={{
									p: 2,
									m: 1
								}}
								elevation={3}
							>
								<p>
									<b>{fileName}</b> - {date}
								</p>
								<Button
									variant="outlined"
									color="primary"
									onClick={() => {
										if (
											document.data.split(".")[1] === "jpg" ||
											document.data.split(".")[1] === "png" ||
											document.data.split(".")[1] === "jpeg"
										) {
											setShowDocumentDialog(true);
											setSelectedDocument(document);
										} else {
											window.open(
												`/api/patient/${document.patient._id}/${document._id}`
											);
										}
									}}
								>
									View
								</Button>
							</Paper>
						);
					})}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowDialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>
			{showDocumentDialog && (
				<DocumentDialog
					showDialog={showDocumentDialog}
					setShowDialog={setShowDocumentDialog}
					document={selectedDocument}
					patientId={document.patient}
				/>
			)}
		</>
	);
}

function DocumentDialog(props) {
	return (
		<Dialog open={props.showDialog} onClose={() => props.setShowDialog(false)}>
			<DialogTitle>{props.document.data.split("\\")[1]}</DialogTitle>
			<DialogContent>
				<FileViewer
					fileURL={`/api/patient/${props.patientId}/${props.document._id}`}
					fileType={props.document.type}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => props.setShowDialog(false)}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

function NewConsultation({
	showAddDialog,
	setShowAddDialog,
	setConsultations
}) {
	const [patientList, setPatientList] = useState([]);
	const [patient, setPatient] = useState("");
	const [date, setDate] = useState(dayjs());

	useEffect(() => {
		axios.get("/api/doctor/patients").then((res) => {
			setPatientList(res.data);
		});
	}, []);

	function createConsultation() {
		axios
			.post("/api/consultation", {
				patient,
				date: date.toISOString()
			})
			.then((res) => {
				setConsultations(res.data);
				setShowAddDialog(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
			<DialogTitle>Create new consultation</DialogTitle>
			<DialogContent>
				<DialogContentText
					sx={{
						marginBottom: "1rem"
					}}
				>
					Please select a patient and a date for the consultation.
				</DialogContentText>
				<FormControl
					sx={{
						width: "100%"
					}}
				>
					<InputLabel id="patient">Patient</InputLabel>
					<Select
						value={patient}
						onChange={(e) => setPatient(e.target.value)}
						labelId="patient"
						label="Patient"
						sx={{
							marginBottom: "1rem"
						}}
					>
						{patientList.map((patient) => {
							return (
								<MenuItem key={patient._id} value={patient._id}>
									{patient.firstName} {patient.lastName}
								</MenuItem>
							);
						})}
					</Select>
					<MobileDatePicker
						label="Date"
						value={date}
						onChange={(newDate) => setDate(newDate)}
						renderInput={(params) => <TextField {...params} />}
					/>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
				<Button onClick={() => createConsultation()}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}
