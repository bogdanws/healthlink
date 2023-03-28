import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
	AppBar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	useMediaQuery
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { profileActions } from "../../store";

const drawerWidth = "20vw";
const drawerMaxWidth = "17em";

const doctorRoutes = [
	{
		text: "Patients",
		icon: <PeopleIcon />,
		path: "/dashboard/patients"
	},
	{
		text: "Appointments",
		icon: <CalendarMonthIcon />,
		path: "/dashboard/appointments"
	},
	{
		text: "Consultations",
		icon: <LibraryBooksIcon />,
		path: "/dashboard/consultations"
	},
	{
		text: "Profile",
		icon: <PersonIcon />,
		path: "/dashboard/profile"
	}
];

const patientRoutes = [
	{
		text: "Medical Records",
		icon: <LibraryBooksIcon />,
		path: "/dashboard/medical-records"
	},
	{
		text: "Appointments",
		icon: <CalendarMonthIcon />,
		path: "/dashboard/appointments"
	},
	{
		text: "Doctors",
		icon: <PeopleIcon />,
		path: "/dashboard/doctors"
	},
	{
		text: "Profile",
		icon: <PersonIcon />,
		path: "/dashboard/profile"
	}
];

export default function Dashboard() {
	const isDesktop = useMediaQuery("(min-width:768px)");
	const navigate = useNavigate();
	const location = useLocation();
	const [showDrawer, setShowDrawer] = useState(false);
	const accountType = useSelector((state) => state.profile.accountType);
	const uploadedLicense = useSelector((state) => state.profile.uploadedLicense);
	const dispatch = useDispatch();

	function getAccount() {
		axios
			.get("/api/login", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					// console.log(res.data);
					dispatch(profileActions.setAccountType(res.data.accountType));
					if (res.data.accountType === "doctor") {
						dispatch(profileActions.setProfile(res.data.doctor));
						dispatch(
							profileActions.setUploadedLicense(
								res.data.doctor.info.license === "true"
							)
						);
					} else {
						dispatch(profileActions.setProfile(res.data.patient));
					}
				}
			})
			.catch((err) => {
				console.log(err);
				navigate("/");
			});
	}

	useEffect(() => {
		getAccount();
	}, []);

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1
				}}
			>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: "space-between"
					}}
				>
					<Typography variant="h6" noWrap component="div">
						HealthLink
					</Typography>
					{!isDesktop && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="end"
							onClick={() => setShowDrawer((prev) => !prev)}
						>
							<MenuIcon />
						</IconButton>
					)}
				</Toolbar>
			</AppBar>
			{isDesktop && (
				<Drawer
					variant="permanent"
					sx={{
						width: drawerWidth,
						maxWidth: drawerMaxWidth,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: "20vw",
							maxWidth: "17em",
							boxSizing: "border-box"
						}
					}}
				>
					<DrawerContent accountType={accountType} />
				</Drawer>
			)}
			{!isDesktop && (
				<Drawer
					variant="temporary"
					anchor="left"
					open={showDrawer}
					ModalProps={{
						keepMounted: true
					}}
					onClose={() => setShowDrawer(false)}
				>
					<DrawerContent accountType={accountType} />
				</Drawer>
			)}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					px: 3,
					width: "100%",
					maxWidth: "100%",
					height: "100vh",
					overflow: "auto"
				}}
			>
				<Toolbar />
				{!uploadedLicense &&
					accountType === "doctor" &&
					location.pathname !== "/dashboard/profile" && (
						<Dialog open={true}>
							<DialogTitle>Upload License</DialogTitle>
							<DialogContent>
								<DialogContentText>
									Please upload your license to continue.
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => navigate("profile")} color="primary">
									Ok
								</Button>
							</DialogActions>
						</Dialog>
					)}
				<Outlet />
			</Box>
		</Box>
	);
}

function DrawerContent(props) {
	const navigate = useNavigate();
	let routes = [];
	if (props.accountType === "doctor") {
		routes = doctorRoutes;
	} else if (props.accountType === "patient") {
		routes = patientRoutes;
	}

	return (
		<>
			<Toolbar />
			<List>
				{routes.map((data, index) => (
					<Link to={data.path} key={index}>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>{data.icon}</ListItemIcon>
								<ListItemText
									primary={
										<Typography variant="body1" noWrap>
											{data.text}
										</Typography>
									}
								/>
							</ListItemButton>
						</ListItem>
					</Link>
				))}
				{/* logout */}
				<ListItem disablePadding>
					<ListItemButton
						onClick={() => {
							axios
								.get("/api/logout", { withCredentials: true })
								.then((res) => {
									if (res.status === 200) {
										navigate("/");
									}
								})
								.catch((err) => {
									console.log(err);
								});
						}}
					>
						<ListItemIcon>
							<ExitToAppIcon
								sx={{
									color: "secondary.main"
								}}
							/>
						</ListItemIcon>
						<ListItemText
							primary={
								<Typography
									variant="body1"
									noWrap
									sx={{
										color: "secondary.main"
									}}
								>
									Logout
								</Typography>
							}
						/>
					</ListItemButton>
				</ListItem>
			</List>
		</>
	);
}
