import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Paper,
	TextField
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import gridStyles from "./GridList.module.scss";
import dayjs from "dayjs";
import FileViewer from "./components/FileViewer";

export default function Patients() {
	const [patientList, setPatientList] = useState([]);
	const [showInviteDialog, setShowInviteDialog] = useState(false);
	const [showPatientDialog, setShowPatientDialog] = useState(false);
	const [selectedPatient, setSelectedPatient] = useState(null);

	useEffect(() => {
		axios.get("/api/doctor/patients").then((res) => {
			setPatientList(res.data);
		});
	}, []);

	return (
		<>
			{showInviteDialog && (
				<InviteDialog
					showDialog={showInviteDialog}
					setShowDialog={setShowInviteDialog}
				/>
			)}
			{showPatientDialog && (
				<PatientDialog
					showDialog={showPatientDialog}
					setShowDialog={setShowPatientDialog}
					patient={selectedPatient}
				/>
			)}
			<div className={gridStyles.grid}>
				<Paper
					elevation={4}
					sx={{ p: 2, my: 1, mx: 1, position: "relative", minHeight: "150px" }}
				>
					<h3>Invite new patient</h3>
					<p>Invite a new patient to your practice</p>
					<Button
						variant="contained"
						color="primary"
						sx={{
							m: 2,
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0
						}}
						onClick={() => setShowInviteDialog(true)}
					>
						Invite
					</Button>
				</Paper>
				{patientList.map((patient) => {
					return (
						<Paper sx={{ p: 2, my: 1, mx: 1 }} key={patient._id}>
							<h3>
								{patient.firstName} {patient.lastName}
							</h3>
							<p>Phone: {patient.phone}</p>
							<p>Email: {patient.email}</p>
							<Button
								variant="outlined"
								sx={{
									width: "100%"
								}}
								onClick={() => {
									setSelectedPatient(patient);
									setShowPatientDialog(true);
								}}
							>
								View
							</Button>
						</Paper>
					);
				})}
			</div>
		</>
	);
}

function InviteDialog(props) {
	function invitePatient() {
		axios.get("/api/doctor/createInvite").then((res) => {
			alert(`Generated invite: ${res.data.inviteCode}`);
		});
	}

	return (
		<Dialog open={props.showDialog} onClose={() => props.setShowDialog(false)}>
			<DialogTitle>Invite new patient</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Invite a new patient to your practice by sending them an email with a
					link to create an account.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Email Address"
					type="email"
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => props.setShowDialog(false)}>Cancel</Button>
				<Button
					onClick={() => {
						invitePatient();
						props.setShowDialog(false);
					}}
				>
					Invite
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function PatientDialog(props) {
	const [documents, setDocuments] = useState([]);
	const [showDocumentDialog, setShowDocumentDialog] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState(null);

	useEffect(() => {
		axios.get(`/api/patient/${props.patient._id}/documents`).then((res) => {
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
			.post(`/api/doctor/uploadDocument/${props.patient._id}`, fd, config)
			.then((res) => {
				// if status is 200, then license was uploaded successfully
				if (res.status === 200) {
					setDocuments([...documents, res.data]);
				}
			});
	}

	return (
		<>
			<Dialog
				open={props.showDialog}
				onClose={() => props.setShowDialog(false)}
			>
				<DialogTitle>
					{props.patient.firstName} {props.patient.lastName}
				</DialogTitle>
				<DialogContent>
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
												`/api/patient/${props.patient._id}/${document._id}`
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
					<Button onClick={() => props.setShowDialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>
			{showDocumentDialog && (
				<DocumentDialog
					showDialog={showDocumentDialog}
					setShowDialog={setShowDocumentDialog}
					document={selectedDocument}
					patientId={props.patient._id}
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
