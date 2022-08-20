import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import './category.scss'
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
import * as api from "../../api";
import TrashDatatable from "../../components/datatable/TrashDatatable";
import * as access from "../../access";

function Trash() {
	const [categories, setCategories] = useState();
	const [products, setProducts] = useState();
	const [searchParams, setSearchParams] = useSearchParams();
	let isToastcalled = false;
	const [value, setValue] = React.useState("1");

	useEffect(() => {
		if (searchParams.get("products")) {
			setValue("1");
		} else if (searchParams.get("categories")) {
			setValue("2");
		}
		api.fetchTrashedItems()
			.then((response) => {
				if (response?.data) {
					let prod = response?.data.filter(
						(i) => i.type == "product"
					);
					//append a serial number to the data
					if (prod) {
						let serial = 1;
						prod.forEach((element) => {
							element.serial = serial;
							serial++;
						});
					}
					setProducts(prod);
					let cat = response?.data.filter(
						(i) => i.type == "category" || i.type == "subcategory"
					);
					//append a serial number to the data
					if (cat) {
						let serial = 1;
						cat.forEach((element) => {
							element.serial = serial;
							serial++;
						});
					}
					setCategories(cat);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	useEffect(() => {
		if (!isToastcalled && searchParams.get("msg")) {
			isToastcalled = true;
			toast.success(searchParams.get("msg"), {
				autoClose: 9000,
				pauseOnHover: true,
			});
			window.history.pushState({}, "", window.location.pathname);
		}
	}, []);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className="home">
			<Sidebar />
			{/* <ToastContainer icon={false} limit={1} autoClose={2000} /> */}
			<div className="homeContainer">
				<Navbar />
				<TabContext value={value}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList
							onChange={handleChange}
							aria-label="lab API tabs example"
						>
							<Tab label="Products" value="1" />
							<Tab label="Categories" value="2" />
						</TabList>
					</Box>
					<TabPanel value="1" style={{ height: "81%" }}>
						{!access.product_read && "No product read access"}
						{access.product_read && (
							<>
								<div className="datatableTitle">
									Trashed Products
								</div>
								<TrashDatatable
									data={products}
									type={"product"}
								/>
							</>
						)}
					</TabPanel>
					<TabPanel value="2" style={{ height: "81%" }}>
						{!access.category_read && "No categories read access"}
						{access.category_read && (
							<>
								<div className="datatableTitle">
									Trashed Categories
								</div>
								<TrashDatatable
									data={categories}
									type={"category"}
								/>
							</>
						)}
					</TabPanel>
				</TabContext>
			</div>
		</div>
	);
}

export default Trash;
