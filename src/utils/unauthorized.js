import { toast } from "react-toastify";
const Unauthorized = (error) => {
	if (error.response.status === 401) {
		toast.error("You are not authorized Please login to continue", {
			autoClose: 9000,
			pauseOnHover: true,
		});
		window.location.href = "/login";
	}
};
export default Unauthorized;
