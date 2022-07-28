import * as React from "react";
import * as api from "../../../api";
import { useParams } from "react-router-dom";
import { state_enum } from "../../../config";
import { toast } from "react-toastify";
import { useForm, Form } from "../../../components/form/useForm";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { mandatoryTheam } from "../../../utils";
import { v4 as uuidv4 } from "uuid";
import { Grid, Button, Stack } from "@mui/material";

import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Controls from "../../../components/form/Controls";

import "react-toastify/dist/ReactToastify.css";
import "./new.scss";
import Unauthorized from "../../../utils/unauthorized";

const initialFormValues = {
	tag: "",
	name: "",
};



const NewCustomSection = (props) => {
	const { customsectionId } = useParams();
	const [ tags , setTags ] = useState([]);
	const validate = (fieldValues = values, state) => {
		let temp = { ...errors };
		if (fieldValues.name === "") {
			temp.name = "Custom Section  Name is required";
		} else {
			temp.name = "";
		}

		if (fieldValues.tag === "") {
			temp.tag = "Tag is required";
		} else {
			temp.tag = "";
		}

		setErrors({
			...temp,
		});

		if (fieldValues === values) {
			let validated = Object.values(temp).every((x) => x === "");
			if (!validated) {
				toast.error("Validation errors", {
					autoClose: 9000,
					pauseOnHover: true,
				});
				return false;
			} else {
				return true;
			}
		}
	};

	const {
		values,
		setValues,
		errors,
		setErrors,
		handleInputChange,
		resetForm,
	} = useForm(initialFormValues, true, validate);

	useEffect(() => {
		api.fetchTags()
			.then((response) => {
				console.log('tagresponse',response.data)
				setTags(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {

		if (customsectionId) {
		  api
			.fetchSection(customsectionId)
			.then((response) => {
			  console.log("customsectionId", response.data);
			  setValues({
				...values,
				name: response.data.name,
				tag: response.data?.tag?.id,
			  });
			})
			.catch((error) => {
			  console.log(error);
			});
		}
	  }, [customsectionId]);

	const submitForm = async function (state) {
		if (validate(values, state)) {
			let body = {
				tag: values.tag,
				name: values.name,
			};

			try {
				if(customsectionId){
					await api.updateSection(customsectionId,body)
					.then((res)=>{
					   let msg = "Custom Section Updated Succesfully."
					   window.location.href = "/custom-section?msg=" + msg;
					}).catch((err)=>{
					   Unauthorized(err);
					   toast.error(err.response.data.message, {
						   autoClose: 9000,
						   pauseOnHover: true,
					   });
					})
				}else{
					await api.section(body)
					.then((res)=>{
					   let msg = "Custom Section Added Succesfully."
					   window.location.href = "/custom-section?msg=" + msg;
					}).catch((err)=>{
					   Unauthorized(err);
					   toast.error(err.response.data.message, {
						   autoClose: 9000,
						   pauseOnHover: true,
					   });
					})
				}
				
			} catch (error) {
				toast.error(error.response.data.message, {
					autoClose: 9000,
					pauseOnHover: true,
				});
			}
		}
	};

	return (
		<div className="new">
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="form-container">
					<h1>{props.title}</h1>
					<Form>
						<ThemeProvider theme={mandatoryTheam}>
							<Controls.Input
								required
								name="name"
								label="Custom Section Name"
								value={values.name}
								error={errors.name}
								onChange={handleInputChange}
							/>

							<Controls.Select
								name="tag"
								label="Tag"
								error={errors.tag}
								value={values.tag}
								onChange={handleInputChange}
								options={tags}
								required
							/>
						</ThemeProvider>

						<Stack
							direction="row"
							spacing={2}
							style={{ marginLeft: "8px", marginTop: "21px" }}
						>
							<Button
								onClick={() => {
									submitForm(state_enum.saved);
								}}
								variant="contained"
								color="warning"
							>
								Save
							</Button>
						</Stack>
					</Form>

					<br />
					<br />
					<br />
				</div>
			</div>
		</div>
	);
};

export default NewCustomSection;
