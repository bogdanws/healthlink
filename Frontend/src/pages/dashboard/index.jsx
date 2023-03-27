import axios from "axios";
import { useNavigate, Outlet } from "react-router";
import { useEffect } from "react";

export default function Dashboard() {
	const navigate = useNavigate();

	function getAccount() {
		axios
			.get("/api/login", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					console.log(res.data);
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

	return <Outlet />;
}
