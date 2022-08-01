import "./datatable.scss";

import Tooltip from "@mui/material/Tooltip";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import { DataGrid } from "@mui/x-data-grid";

import * as api from "../../api";
import { useStyles } from "../../utils";
import EditIcon from "@mui/icons-material/Edit";
import ActionsUpdate from "../confirm/ActionsUpdate";
const LeadeGenerationDatatable = () => {
	const [data, setData] = useState();
	const classes = useStyles();
	const [rowId, setRowId] = useState(null);

	useEffect(() => {
		api.fetchLeads()
			.then((response) => {
				if (response.status === 200) {
					let data = response.data;
					console.log("data", data);
					let serial = 1;
					data.forEach((element) => {
						element.serial = serial;
						serial++;
					});
					setData(data);
				} else {
					toast.error("Some error occurred", {
						autoClose: 9000,
						pauseOnHover: true,
					});
				}
			})
			.catch((error) => {
				console.log(error);
				if (error?.response?.status === 401) {
					toast.error("Session Expired. Please Login Again", {
						autoClose: 9000,
						pauseOnHover: true,
					});
					setTimeout(() => {
						window.location.href = "/login";
					}, 1000);
				}
			});
	}, []);

	const userColumns = [
		{
			field: "serial",
			headerName: "Sr. No.",
			width: 70,
		},
		{ field: "id", headerName: "ID", width: 50 },
		{
			field: "name",
			headerName: "Name",
			width: 180,
			renderCell: (params) => (
				<Tooltip title={params.row.name}>
					<span className="table-cell-trucate">
						{params.row.name}
					</span>
				</Tooltip>
			),
		},
		{
			field: "email",
			headerName: "Email",
			width: 180,
			renderCell: (params) => (
				<Tooltip title={params.row.email}>
					<span className="table-cell-trucate">
						{params.row.email}
					</span>
				</Tooltip>
			),
		},
		{ field: "location", headerName: "location", width: 140 },
		{ field: "mobile", headerName: "mobile", width: 140 },
		{
			field: "status",
			headerName: "status",
			width: 180,
			editable: true,
			type: "singleSelect",
			valueOptions: [
				{ value: "In-progress", label: "In-progress" },
				{ value: "Pending", label: "Pending" },
				{ value: "Completed", label: "Completed" },
			],
			renderCell: (params) => (
				<Tooltip title={params.row.status}>
					<span className="table-cell-trucate">
						{params.row.status}{" "}
						<EditIcon style={{ marginLeft: "20px" }} />
					</span>
				</Tooltip>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			type: "actions",
			renderCell: (params) => (
				<ActionsUpdate {...{ params, rowId, setRowId }} />
			),
		},
	];

	return (
		<div className="datatable">
			<ToastContainer icon={false} limit={1} autoClose={2000} />
			<div className="datatableTitle">Frenchise Lead Management</div>
			<br />
			{data && (
				<DataGrid
					className={classes.root}
					disableSelectionOnClick
					disableColumnSelector
					rows={data}
					columns={userColumns}
					pageSize={10}
					rowsPerPageOptions={[10]}
					onCellEditCommit={(params) => setRowId(params.id)}
				/>
			)}
		</div>
	);
};

export default LeadeGenerationDatatable;
