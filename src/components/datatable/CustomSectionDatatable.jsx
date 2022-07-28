import * as access from "../../access";
import "./datatable.scss";
import Tooltip from "@mui/material/Tooltip";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialog from "../confirm/ConfirmDialog";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import { url, state_enum } from "../../config";
import * as api from "../../api";
import { useStyles } from "../../utils";

const CustomSectionDatatable = () => {
	const [data, setData] = useState();
	const classes = useStyles();
	const [confirmOpen, setConfirmOpen] = useState({ state: false, id: "" });
	const [multiActionVisibility, setMultiActionVisibility] = useState(false);
	const [selectionModel, setSelectionModel] = React.useState([]);

	const handleDelete = () => {
        let body = {
			id: confirmOpen.id,
		};
 
		api.deleteSection(body)
			.then((response) => {
				if (response.status === 200) {
					let msg = "Custom Section is deleted.";

					 window.location.href = "/custom-section?msg=" + msg;
				} else {
					toast.error("Some error occurred", {
						autoClose: 9000,
						pauseOnHover: true,
					});
				}
			})
			.catch((error) => {
				toast.error("Some error occurred", {
					autoClose: 9000,
					pauseOnHover: true,
				});
			});
	};

	const updateState = (state) => {
		let body = {
			id: selectionModel,
		};

		api.deleteSection(body)
			.then((response) => {
				if (response.status === 200) {
					let msg = "Deleted are updated.";

					window.location.href = "/custom-section?msg=" + msg;
				} else {
					toast.error("Some error occurred", {
						autoClose: 9000,
						pauseOnHover: true,
					});
				}
			})
			.catch((error) => {
				toast.error("Some error occurred", {
					autoClose: 9000,
					pauseOnHover: true,
				});
			});
	};
	useEffect(() => {
		api.fetchSections()
			.then((response) => {
				if (response.status === 200) {
					let data = response.data;
					console.log('data',data)
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

	const actionColumn = [
		{
			field: "action",
			headerName: "Action",
			sortable: false,
			width: 200,
			disableColumnFilter: true,
			renderCell: (params) => {
				let apiUrl = `/custom-section/${params.id}`;
				return (
					<div className="cellAction">
						<Button
							disabled={access.product_edit ? false : true}
							onClick={() => {
								window.location.href = apiUrl;
							}}
							variant="outlined"
							color="info"
							size="small"
						>
							Edit
						</Button>

						<Button
							disabled={access.product_delete ? false : true}
							onClick={(e) => {
								e.preventDefault();
								setConfirmOpen({
									state: true,
									id: [params.row.id],
								});
							}}
							variant="outlined"
							color="error"
							size="small"
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	const userColumns = [
		{
			field: "serial",
			headerName: "Sr. No.",
			width: 70,
		},
		{ field: "id", headerName: "ID", width: 80 },
		{
			field: "name",
			headerName: "Section Name",
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
			field: "tag",
			headerName: "Tag Name",
			width: 180,
			renderCell: (params) => (
				<Tooltip title={params.row?.tag?.name}>
					<span className="table-cell-trucate">
						{params.row?.tag?.name}
					</span>
				</Tooltip>
			),
		},
	];

	return (
		<div className="datatable">
			<ConfirmDialog
				title="Delete Custom Section ?"
				open={confirmOpen}
				setOpen={setConfirmOpen}
				onConfirm={handleDelete}
			>
				Are you sure you want to delete this product?
			</ConfirmDialog>
			<ToastContainer icon={false} limit={1} autoClose={2000} />
			<div>
				<Stack
					direction="row"
					spacing={2}
					style={{
						display: multiActionVisibility ? "block" : "none",
					}}
				>
					<Button
						onClick={() => {
							updateState(state_enum.trashed);
						}}
						disabled={access.product_delete ? false : true}
						variant="outlined"
						color="error"
						startIcon={<DeleteIcon />}
					>
						Delete
					</Button>
				</Stack>
			</div>
			<br />
			{data && (
				<DataGrid
					className={classes.root}
					disableSelectionOnClick
					disableColumnSelector
					rows={data}
					columns={userColumns.concat(actionColumn)}
					pageSize={10}
					rowsPerPageOptions={[10]}
					checkboxSelection
					onSelectionModelChange={(newSelectionModel, a) => {
						if (newSelectionModel.length) {
							setMultiActionVisibility(true);
						} else {
							setMultiActionVisibility(false);
						}
						setSelectionModel(newSelectionModel);
					}}
					selectionModel={selectionModel}
				/>
			)}
		</div>
	);
};

export default CustomSectionDatatable;
