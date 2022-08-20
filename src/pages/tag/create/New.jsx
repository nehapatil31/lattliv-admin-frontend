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

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";

import { ListSubheader, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Unauthorized from "../../../utils/unauthorized";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			borderRadius: "5px",
			backgroundColor: "#fafafa",
		},
	},
};

const initialFormValues = {
	tag: "",
	category: [],
};

const NewTag = (props) => {
	const { tagId } = useParams();
	const [ProductsData, setProductsData] = useState();
	const [selectedProduct, setSelectedProduct] = React.useState([]);
	const [searchText, setSearchText] = useState("");
	const validate = (fieldValues = values, state) => {
		let temp = { ...errors };
		if (fieldValues.tag === "") {
			temp.tag = "Tag is required";
		} else {
			temp.tag = "";
		}
		console.log("fieldValues", fieldValues);
		if (fieldValues?.category?.length === 0) {
			temp.category = "Category is required";
		} else {
			temp.category = "";
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
	/* A custom hook that is used to handle form state. */
	const {
		values,
		setValues,
		errors,
		setErrors,
		handleInputChange,
		resetForm,
	} = useForm(initialFormValues, true, validate);

	/* This is a react hook that is used to fetch data from the server. */
	useEffect(() => {
		api.fetchCategories()
			.then((response) => {
				//state 2 is for active
				let categories = response.data.filter((item) => !item.parent);

				api.fetchProducts()
					.then((response) => {
						let data = response.data;
						let objCategoryWiseProduct = [];

						categories.forEach((category) => {
							let categoryWiseProduct = data.filter(
								(item) =>
									//state 2 is for active
									item.category?.parent.id === category.id
							);

							categoryWiseProduct.length > 0 &&
								objCategoryWiseProduct.push({
									categoryName: category.name,
									categoryId: category.id,
									products: categoryWiseProduct,
								});
						});
						console.log(objCategoryWiseProduct);
						setProductsData(objCategoryWiseProduct);
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	// fetchTag
	useEffect(() => {
		if (tagId) {
			api.fetchTag(tagId)
				.then((response) => {
					let new_tag = [];
					console.log("tagfetch", response);
					response.data.data.forEach((item) => {
						//check if  category is exixt in new_tag array
						let category_exist = new_tag.find(
							(category) => category.categoryId === item.category
						);
						if (!category_exist) {
							new_tag.push({
								categoryId: item.category,
								products: [item.product],
							});
						} else {
							new_tag.forEach((category) => {
								if (category.categoryId === item.category) {
									category.products.push(item.product);
								}
							});
						}
					});
					setSelectedProduct(new_tag);
					setValues({
						tag: response.data.name,
						category: new_tag,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [tagId]);

	const submitForm = async function (state) {
		if (validate(values, state)) {
			let body = {
				name: values.tag,
				category: values.category,
			};
			console.log("body", body, tagId);
			try {
				if (tagId) {
					await api
						.updateTag(tagId, body)
						.then((res) => {
							let msg = "Tag is updated !";
							window.location.href = "/tag?msg=" + msg;
						})
						.catch((err) => {
							Unauthorized(err);
							toast.error(err.response.data.message, {
								autoClose: 9000,
								pauseOnHover: true,
							});
						});
				} else {
					await api
						.createTag(body)
						.then((res) => {
							let msg = "Tag  is created !";
							window.location.href = "/tag?msg=" + msg;
						})
						.catch((err) => {
							Unauthorized(err);
							toast.error(err.response.data.message, {
								autoClose: 9000,
								pauseOnHover: true,
							});
						});
				}
			} catch (error) {
				toast.error(error.response.data.error, {
					autoClose: 9000,
					pauseOnHover: true,
				});
			}
		}
	};

	const productValue = (selectProduct, categoriesId) => {
		let newSelectProduct = [];
		selectProduct.forEach((item) => {
			if (item.categoryId === categoriesId) {
				newSelectProduct.push(...item.products);
			}
		});
		return newSelectProduct;
	};

	const handleChange = (event) => {
		const {
			target: { value, name },
		} = event;

		let newChnage = selectedProduct.map((item) => {
			if (item.categoryId === name) {
				item.products = value;
			}
			return item;
		});

		if (!newChnage.find((item) => item.categoryId === name)) {
			newChnage.push({
				categoryId: name,
				products: value,
			});
		}
		setValues(newChnage);
		setSelectedProduct(newChnage);
		handleInputChange({
			target: {
				name: "category",
				value: newChnage,
			},
		});
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
								name="tag"
								label="Tag"
								value={values.tag}
								error={errors.tag}
								onChange={handleInputChange}
							/>

							<Grid xs={12} style={{ display: "flex" }}>
								<h3 style={{ marginLeft: "8px" }}>Category</h3>
								<p style={{ color: "red" }}>*</p>
								{errors.category && (
									<p
										style={{
											color: "red",
											margin: "20px 20px",
										}}
									>
										{errors.category}
									</p>
								)}
							</Grid>

							{ProductsData &&
								ProductsData.map((items) => {
									return (
										<>
											<h4>{items.categoryName}</h4>
											<FormControl
												sx={{ m: 1, width: 300 }}
											>
												<InputLabel id="demo-multiple-checkbox-label">
													Product
												</InputLabel>
												<Select
													labelId="demo-multiple-checkbox-label"
													id="demo-multiple-checkbox"
													multiple
													value={productValue(
														selectedProduct,
														items.categoryId
													)}
													onChange={handleChange}
													onClose={() =>
														setSearchText("")
													}
													name={items.categoryId}
													input={
														<OutlinedInput label="Product" />
													}
													renderValue={(selected) => {
														let newSelected = [];
														selected.forEach(
															(item) => {
																items.products.filter(
																	(
																		product
																	) => {
																		if (
																			product.id ===
																			item
																		) {
																			newSelected.push(
																				product.name
																			);
																		}
																	}
																);
															}
														);

														return newSelected.join(
															", "
														);
													}}
													MenuProps={MenuProps}
												>
													<ListSubheader>
														<TextField
															size="small"
															// Autofocus on textfield
															autoFocus
															placeholder="Type to search..."
															fullWidth
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<SearchIcon />
																		</InputAdornment>
																	),
															}}
															onChange={(e) => {
																return setSearchText(
																	e.target
																		.value
																);
															}}
															onKeyDown={(e) => {
																if (
																	e.key !==
																	"Escape"
																) {
																	e.stopPropagation();
																}
															}}
														/>
													</ListSubheader>
													{searchText.length > 0
														? items.products
																.filter(
																	(
																		product
																	) => {
																		return product.name
																			.toLowerCase()
																			.includes(
																				searchText.toLowerCase()
																			);
																	}
																)
																.map(
																	(
																		product
																	) => {
																		return (
																			<MenuItem
																				key={
																					product.id
																				}
																				value={
																					product.id
																				}
																			>
																				<ListItemText
																					primary={
																						product.name
																					}
																				/>
																			</MenuItem>
																		);
																	}
																)
														: items.products.map(
																(product) => {
																	return (
																		<MenuItem
																			key={
																				product.id
																			}
																			value={
																				product.id
																			}
																		>
																			<ListItemText
																				primary={
																					product.name
																				}
																			/>
																		</MenuItem>
																	);
																}
														  )}
												</Select>
											</FormControl>
										</>
									);
								})}
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

export default NewTag;
