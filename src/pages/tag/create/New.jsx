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

import {
	ListSubheader,
	TextField,
	InputAdornment,
	IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Unauthorized from "../../../utils/unauthorized";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
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
	productCategoryMapping: [],
};

const NewTag = (props) => {
	const { tagId } = useParams();
	const [ProductsData, setProductsData] = useState();
	const [selectedProduct, setSelectedProduct] = React.useState([]);
	const [searchText, setSearchText] = useState("");
	const [catergories, setcatergories] = useState([]);
	const [mapProduct, setmapProduct] = useState([
		{ id: uuidv4(), category: "", product: [] },
	]);
	const [newProducts, setNewProducts] = useState([]);

	const handleAddFields = () => {
		setmapProduct([
			...mapProduct,
			{ id: uuidv4(), category: "", product: [] },
		]);
	};

	const handleChangeInput = (id, event) => {
		// selectedProduct
		const newInputFields = mapProduct.map((i) => {
			if (id === i.id) {
				i[event.target.name] = event.target.value;

				let categoryWiseProduct = newProducts.filter(
					(item) => item.category?.parent.id === event.target.value
				);
				i["product"] = categoryWiseProduct;
			}
			return i;
		});
		values.productCategoryMapping.forEach((pro) => {
			if (pro.currentId === id) {
				pro.products.length = 0;
			}
		});

		// handleInputChange({
		//   target: {
		//     name: "specification",
		//     value: newInputFields,
		//   },
		// });
		setmapProduct(newInputFields);
		// setValues({ ...values, specification: newInputFields });
	};

	const handleRemoveFields = (id) => {
		const mapvalues = [...mapProduct];
		mapvalues.splice(
			mapvalues.findIndex((value) => value.id === id),
			1
		);
		values.productCategoryMapping.splice(
			values.productCategoryMapping.findIndex((value) => value.id === id),
			1
		);

		setmapProduct(mapvalues);
	};
	const validate = (fieldValues = values, state) => {
		let temp = { ...errors };
		console.log("fieldValues", fieldValues);
		if (fieldValues.tag === "") {
			temp.tag = "Tag is required";
		} else {
			temp.tag = "";
		}

		if (fieldValues?.productCategoryMapping?.length === 0) {
			temp.category = "Category is required";
		} else {
			temp.category = "";
		}

		setErrors({
			...temp,
		});
		console.log("error", errors);
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
				setcatergories(categories);
				api.fetchProducts()
					.then((response) => {
						let data = response.data;

						let tempProduct = [];
						data.forEach((prod) => {
							if (prod.state.id === 2) {
								tempProduct.push(prod);
							}
						});
						setNewProducts(tempProduct);
						// let objCategoryWiseProduct = [];

						// categories.forEach((category) => {
						//   let categoryWiseProduct = data.filter(
						//     (item) =>
						//       //state 2 is for active
						//       item.category?.parent.id === category.id
						//   );

						//   categoryWiseProduct.length > 0 &&
						//     objCategoryWiseProduct.push({
						//       categoryName: category.name,
						//       categoryId: category.id,
						//       products: categoryWiseProduct,
						//     });
						// });
						// console.log(objCategoryWiseProduct);
						// setProductsData(objCategoryWiseProduct);
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
					// handleAddFields();
					let new_tag = [];
					let new_option = [];
					let product_selected = [];
					console.log("values", values);
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

							let categoryWiseProduct = newProducts.filter(
								(category_item) =>
									category_item.category?.parent.id ===
									item.category
							);
							new_option.push({
								id: uuidv4(),
								category: item.category,
								product: categoryWiseProduct,
								array_products: [item.product],
							});
						} else {
							new_tag.forEach((category) => {
								if (category.categoryId === item.category) {
									category.products.push(item.product);
								}
							});

							new_option.forEach((category) => {
								if (category.category === item.category) {
									category.array_products.push(item.product);
								}
							});
						}
					});

					new_option.forEach((item) => {
						product_selected.push({
							currentId: item.id,
							products: item.array_products,
						});
					});

					setSelectedProduct(product_selected);
					setmapProduct(new_option);
					setValues({
						tag: response.data.name,
						productCategoryMapping: product_selected,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [tagId, newProducts]);

	const submitForm = async function (state) {
		let finalProduct = [];

		values.productCategoryMapping.forEach((product) => {
			finalProduct.push(...product.products);
		});

		if (validate(values, state)) {
			let body = {
				name: values.tag,
				products: finalProduct,
			};

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

	const productValue = (selectProduct, currentId) => {
		let newSelectProduct = [];
		selectProduct.forEach((item) => {
			if (item.currentId === currentId) {
				newSelectProduct.push(...item.products);
			}
		});
		return newSelectProduct;
	};

	const handleChange = (event) => {
		const {
			target: { value, name },
		} = event;

		let newChange = selectedProduct.map((item) => {
			if (item.currentId === name) {
				item.products = value;
			}
			return item;
		});

		if (!newChange.find((item) => item.currentId === name)) {
			newChange.push({
				currentId: name,
				products: value,
			});
		}

		setValues(newChange);
		setSelectedProduct(newChange);
		handleInputChange({
			target: {
				name: "productCategoryMapping",
				value: newChange,
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
								<h3 style={{ marginLeft: "8px" }}>
									Map Product Category
								</h3>
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

							{mapProduct.map((inputField) => (
								<div key={inputField.id}>
									<Controls.Select
										required
										name="category"
										label="Category"
										//  error={errors.category}
										value={inputField.category}
										onChange={(e) => {
											handleChangeInput(inputField.id, e);
										}}
										options={catergories}
									/>

									<FormControl sx={{ m: 1, width: 300 }}>
										<InputLabel id="demo-multiple-checkbox-label">
											Product
										</InputLabel>
										<Select
											labelId="demo-multiple-checkbox-label"
											id="demo-multiple-checkbox"
											multiple
											value={productValue(
												selectedProduct,
												inputField.id
											)}
											onChange={handleChange}
											onClose={() => setSearchText("")}
											name={inputField.id}
											input={
												<OutlinedInput label="Product" />
											}
											renderValue={(selected) => {
												let newSelected = [];
												selected.forEach((item) => {
													inputField.product.filter(
														(pro) => {
															if (
																pro.id === item
															) {
																newSelected.push(
																	pro.name
																);
															}
														}
													);
												});

												return newSelected.join(", ");
											}}
											MenuProps={MenuProps}
										>
											<ListSubheader>
												<TextField
													size="small"
													autoFocus
													placeholder="Type to search..."
													fullWidth
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<SearchIcon />
															</InputAdornment>
														),
													}}
													onChange={(e) => {
														return setSearchText(
															e.target.value
														);
													}}
													onKeyDown={(e) => {
														if (
															e.key !== "Escape"
														) {
															e.stopPropagation();
														}
													}}
												/>
											</ListSubheader>
											{searchText.length > 0
												? inputField.product
														.filter((pro) => {
															return pro.name
																.toLowerCase()
																.includes(
																	searchText.toLowerCase()
																);
														})
														.map((pro) => {
															return (
																<MenuItem
																	key={pro.id}
																	value={
																		pro.id
																	}
																>
																	<ListItemText
																		primary={
																			pro.name
																		}
																	/>
																</MenuItem>
															);
														})
												: inputField.product.map(
														(pro) => {
															return (
																<MenuItem
																	key={pro.id}
																	value={
																		pro.id
																	}
																>
																	<ListItemText
																		primary={
																			pro.name
																		}
																	/>
																</MenuItem>
															);
														}
												  )}
										</Select>
									</FormControl>

									<div>
										<IconButton
											disabled={mapProduct.length === 1}
											onClick={() =>
												handleRemoveFields(
													inputField.id
												)
											}
										>
											<Button
												disabled={
													mapProduct.length === 1
												}
												variant="outlined"
												color="secondary"
												startIcon={<DeleteIcon />}
											>
												Delete
											</Button>
										</IconButton>
										<IconButton onClick={handleAddFields}>
											<Button
												variant="outlined"
												endIcon={<AddIcon />}
											>
												Add
											</Button>
										</IconButton>
									</div>

									<br />
									<br />
									<br />
								</div>
							))}

							{/* {ProductsData &&
                ProductsData.map((items) => {
                  return (
                    <>
                      <h4>{items.categoryName}</h4>
                      <FormControl sx={{ m: 1, width: 300 }}>
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
                          onClose={() => setSearchText("")}
                          name={items.categoryId}
                          input={<OutlinedInput label="Product" />}
                          renderValue={(selected) => {
                            console.log('selected',selected)
                            let newSelected = [];
                            selected.forEach((item) => {
                              items.products.filter((product) => {
                                if (product.id === item) {
                                  newSelected.push(product.name);
                                }
                              });
                            });

                            return newSelected.join(", ");
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
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e) => {
                                return setSearchText(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                if (e.key !== "Escape") {
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </ListSubheader>
                          {searchText.length > 0
                            ? items.products
                                .filter((product) => {
                                  return product.name
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase());
                                })
                                .map((product) => {
                                  return (
                                    <MenuItem
                                      key={product.id}
                                      value={product.id}
                                    >
                                      <ListItemText primary={product.name} />
                                    </MenuItem>
                                  );
                                })
                            : items.products.map((product) => {
                                return (
                                  <MenuItem key={product.id} value={product.id}>
                                    <ListItemText primary={product.name} />
                                  </MenuItem>
                                );
                              })}
                        </Select>
                      </FormControl>
                    </>
                  );
                })} */}
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
